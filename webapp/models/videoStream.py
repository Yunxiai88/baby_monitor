import os
import time
import datetime
import imutils
import tensorflow as tf
import tensorflow_io as tfio
import tensorflow_hub as hub

from models.util import utils

sample_rate = 16000
sound_classes = ['crying_baby', 'others']

class VideoStream:
    def __init__(self):
        model_path = utils.get_conf('model_name')
        self.yamnet_model = tf.saved_model.load(model_path)

    def init_config(self):
        None
    
    def load_wav_16k_mono(filename):
        """ read in a waveform file and convert to 16 kHz mono """
        file_contents = tf.io.read_file(filename)
        wav, sample_rate = tf.audio.decode_wav(file_contents,
                                              desired_channels=1)
        wav = tf.squeeze(wav, axis=-1)
        sample_rate = tf.cast(sample_rate, dtype=tf.int64)
        wav = tfio.audio.resample(wav, rate_in=sample_rate, rate_out=16000)
        return wav

    def crying_detection(self):
        # global references to the video stream, output frame, and lock variables
        global vs, outputFrame, lock

        # initialize the video stream and allow the camera sensor to warmup
        vs = WebcamVideoStream(src=0).start()
        fps = FPS().start()
        time.sleep(2.0)

        # initialize the detection and the total number of frames read thus far
        (W, H) = (None, None)

        # loop over frames from the video stream
        th = threading.currentThread()
        while getattr(th, "running", True):
            # read the next frame from the video stream
            frame = vs.read()

            if frame is None:
                break

            # initial width and height for frame
            if W is None or H is None:
                (H, W) = frame.shape[:2]

            # process frame
            frame = self.processFrame(frame, W, H)

            # resize the frame, for output
            frame = imutils.resize(frame, width=400)


            # cv2.putText(frame, "HELLO",(10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
            # cv2.imshow("Frame", frame)
            # key = cv2.waitKey(1) & 0xFF
            # acquire the lock, set the output frame, and release the lock
            with lock:
                outputFrame = frame.copy()

        print("thread is stopped, stopping camera")
        vs.stop()

    # plot the frame onto video
    def generate(self):
        # grab global references to the output frame and lock variables
        global outputFrame, lock

        # loop over frames from the output stream
        while True:
            # wait until the lock is acquired
            with lock:
                # check if the output frame is available, otherwise skip
                # the iteration of the loop
                if outputFrame is None:
                    continue

                # encode the frame in JPEG format
                (flag, encodedImage) = cv2.imencode(".jpg", outputFrame)

                # ensure the frame was successfully encoded
                if not flag:
                    continue

            # yield the output frame in the byte format
            yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' +
                bytearray(encodedImage) + b'\r\n')

    # process audio
    def processvideo(self, data):
        print("process audio for -> " + filename)

        duration = len(data)/sample_rate
        print(f'Total duration: {duration:.2f}s')

        for i in range(0, int(duration), 5):
            start = i*sample_rate
            end   = (i+5)*sample_rate
            print('duration from {:d} -- {:d}'.format(i, i+5))

            wav_data = data[start:end]

            reloaded_results = yamnet_model(wav_data)
            baby_sound = sound_classes[tf.argmax(reloaded_results)]
            print(f'The main sound is: {baby_sound}')
            
            if baby_sound == 'crying_baby':
                

        # generate processed file name
        outputfilename = os.path.splitext(filename)[0] + "_processed.mp4"
        outputfilepath = utils.get_file_path('webapp/static/processed', outputfilename)

        # read from video file
        filepath = utils.get_file_path('webapp/uploads', filename)
        video = cv2.VideoCapture(filepath)
        fps = FPS().start()

        # initial parameters
        writer = None
        (H, W) = (None, None)

        while True:
            (grabbed, frame) = video.read()

            if not grabbed:
                break

            # resize frame to width=300
            frame = imutils.resize(frame, width=300)

            if W is None or H is None:
                (H, W) = frame.shape[:2]

            # check whether writer is None
            if writer is None:
                writer = cv2.VideoWriter(
                                    filename=outputfilepath,
                                    fourcc=cv2.VideoWriter_fourcc(*'mp4v'),
                                    fps=video.get(cv2.CAP_PROP_FPS),
                                    frameSize=(W, H))

            # process the frame and update the FPS counter
            frame = self.processFrame(frame, W, H)

            cv2.imshow("frame", frame)

            writer.write(frame)

            cv2.waitKey(1)
            fps.update()

        # do a bit of cleanup
        fps.stop()
        cv2.destroyAllWindows()
        writer.release()

        print("processed video was successfully saved")

        return outputfilename

# release the video stream pointer
#vs.stop()
