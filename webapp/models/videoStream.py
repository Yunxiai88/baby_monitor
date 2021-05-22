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
