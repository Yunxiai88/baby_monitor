import os
import threading
import argparse
import base64
import cv2

import numpy as np
from PIL import Image
from io import BytesIO
from datetime import datetime

from flask import Flask, Response, make_response, send_file
from flask import flash, request, redirect, jsonify
from flask import render_template

from models.util import utils
from models.videoStream import VideoStream
from models.videoStream import c3d

# initialize a flask object
app = Flask(__name__)

@app.route("/")
def index():
    # return the rendered template
    global t
    try:
        t.running = False
        t.join()
    except Exception:
        print("realtime thread is not running")
    return render_template("index.html")


@app.route("/staticstream/")
def staticstream():
    # stop the detection thread
    global t
    try:
        t.running = False
        t.join()
    except Exception:
        print("realtime thread is not running")

    # forward to static stream page
    return render_template("staticStream.html")

@app.route("/about/")
def about():
    # stop the detection thread
    global t
    try:
        t.running = False
        t.join()
    except Exception:
        print("realtime thread is not running")

    # forward to about page
    return render_template("about.html")

@app.route("/contact/")
def contact():
    # stop the detection thread
    global t
    try:
        t.running = False
        t.join()
    except Exception:
        print("realtime thread is not running")

    # forward to contact page
    return render_template("contact.html")


#---------------------------------------------------------------------
#----------------------------Functions--------------------------------
#---------------------------------------------------------------------
@app.route("/uploadvideo", methods=['GET', 'POST'])
def uploadvideo():
    if request.method == 'POST':
        # save file
        file = request.files['uploadVideo']
        result = utils.save_file(file)
        if result == 0:
            print("file saved failed.")
        else:
            print("file saved successful.")
        
        # call function to convert video to audio
        filename = file.filename.rsplit('.', 1)[0]
        new_file = filename+".wav"
        print(file.filename)
        
        utils.video_audio(file.filename, new_file)
        
        # process for audio sound detect
        vs = VideoStream()
        audio = vs.processvideo(new_file)
        print("audio = ", audio)

        # process for video action detect
        c3d_model = c3d()
        actions = c3d_model.predict('webapp/uploads/'+file.filename)
        print("video = ", actions)
        
        video = []
        
        # group action together
        groups = utils.group_action(actions)
        print("groups = ", groups)

        total_vid_frames = 0
        # category
        bases = [{'1':'Climb', '2':'Crawl', '3':'Roll', '4':'Walk', '5': 'Others'}]
        for dic in bases:
            for id, name in dic.items():
                if name in groups:
                    periods = utils.get_period(id, name, groups)
                    total_vid_frames = total_vid_frames + len(periods)
                else:
                    periods = []
                video.append({'id':id, 'name':name, 'periods':periods})

        
        if (len(audio)>total_vid_frames):
            # if the length does not align, pop the last window from audio
            audio.popitem()
        # allow user to download and listen
        output = {'output': {'filename': filename, 'audio': audio, 'video': video}}
        return jsonify(output)

# execute function
if __name__ == '__main__':
    # construct the argument parser and parse command line arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("-i", "--ip", type=str, default="127.0.0.1", help="ip address")
    ap.add_argument("-o", "--port", type=int, default=8000, help="port number of the server")
    args = vars(ap.parse_args())

    # start the flask app
    app.run(host=args["ip"], port=args["port"], debug=True, threaded=True, use_reloader=False)
