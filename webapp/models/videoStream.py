import os
import time
import datetime
import imutils
import wave
import pyaudio
import numpy as np
import soundfile as sf
import tensorflow as tf
import tensorflow_io as tfio
import tensorflow_hub as hub

from models.util import utils

import cv2
import numpy as np
# from keras.models import load_model

rate = 44100

sample_rate = 16000
record_seconds = 5

class VideoStream:
    def __init__(self):
        self.LABELS       = self.init_label()
        self.yamnet_model = tf.saved_model.load('baby_crying_yamnet')

    # initial labels
    def init_label(self):
        labelsPath = utils.get_file_path("webapp/cfg", "classes.names")
        return open(labelsPath).read().strip().split("\n")
    
    def load_wav_16k_mono(self, filename):
        """ read in a waveform file and convert to 16 kHz mono """
        filename = utils.get_file_path('webapp/static/processed', filename)
        
        file_contents = tf.io.read_file(filename)
        wav, sample_rate = tf.audio.decode_wav(file_contents,
                                              desired_channels=1)
        wav = tf.squeeze(wav, axis=-1)
        sample_rate = tf.cast(sample_rate, dtype=tf.int64)
        wav = tfio.audio.resample(wav, rate_in=sample_rate, rate_out=16000)
        return wav

    def save_clip(self, data, index, filename):
        filename = filename.rsplit('.', 1)[0];
        filename = '{:s}-clip{:d}.wav'.format(filename, index)
        filename = utils.get_file_path('webapp/static/processed', filename)

        sf.write(filename, data, sample_rate, subtype='PCM_24')
    
    # process audio
    def processvideo(self, filename):
        print("process audio for -> " + filename)
        
        data = self.load_wav_16k_mono(filename)

        duration = len(data)/sample_rate
        print(f'Total duration: {duration:.2f}s')

        index = 0
        outputfilename = {}
        
        for i in range(0, int(duration), 5):
            start = i*sample_rate
            end   = (i+5)*sample_rate
            
            duration = 'duration from {:d} -- {:d}'.format(i, i+5)
            print(duration)

            wav_data = data[start:end]

            reloaded_results = self.yamnet_model(wav_data)
            baby_sound = self.LABELS[tf.argmax(reloaded_results)]
            print(f'The main sound is: {baby_sound}')
            
            # save clip file
            self.save_clip(wav_data, i, filename)
            
            outputfilename[i] = baby_sound

        print("processed video was successfully saved", outputfilename)

        return outputfilename


class c3d:
    def __init__(self, model_path = 'model_c3d.h5'):
        self.c3d_model = load_model(model_path)
        self.depth = 10
        self.height = 32
        self.width = 32
        self.windowsize = 5
        self.classes = ['Climb','Crawl','Roll','Walk']

    def predict(self, filepath):
        cap = cv2.VideoCapture(filepath)
        nframe = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        fps = cap.get(cv2.CAP_PROP_FPS)
        windowframes = (fps*self.windowsize)
        nwindow = int(nframe/windowframes)
        bAppend = False
        actions = []
        for w in range(nwindow):

          action = {}
          action['time'] = w*5
          
          if (nframe>=self.depth):
              frames = [(x * windowframes / self.depth) + (w * windowframes) for x in range(self.depth)]
          else:
              bAppend = True
              frames = [x + (w * windowframes) for x in range(int(nframe))] # nframe is a float

          framearray = []

          for i in range(len(frames)):#self.depth):
              cap.set(cv2.CAP_PROP_POS_FRAMES, frames[i])
              ret, frame = cap.read()
              frame = cv2.resize(frame, (self.height, self.width))
              framearray.append(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY))

          
          if bAppend:
              while len(framearray) < self.depth:
                  framearray.append(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY))
          pred =  np.array(framearray)
          pred = pred.reshape((1, 32, 32, 10, 1))
          result = self.c3d_model.predict(pred, verbose=0)
          if result[0][np.argmax(result, axis=1)[0]] < 0.7:
            action['action'] = 'other'
          else:
            action['action'] = self.classes[np.argmax(result, axis=1)[0]]
          actions.append(action)
        cap.release()
        return actions



