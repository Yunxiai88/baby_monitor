import os
import cv2
import numpy as np
import configparser
import moviepy.editor as mp
from werkzeug.utils import secure_filename

def get_file_path(folder, filename):
    return os.path.join(folder, filename)

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'mp4', 'avi', 'dat', '3gp', 'mov', 'rmvb'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file(file):
    if allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join('webapp/uploads', filename))
        return 1
    return 0

def video_audio(input, output):
    source = get_file_path('webapp/uploads', input)
    my_clip = mp.VideoFileClip(source)

    destination = get_file_path('webapp/static/processed', output)
    print("destination = ", destination)
    my_clip.audio.write_audiofile(destination)

def toRGB(image):
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)


def rotate_bound(image, angle):
    # grab the dimensions of the image and then determine the
    # center
    (h, w) = image.shape[:2]
    (cX, cY) = (w // 2, h // 2)

    # grab the rotation matrix (applying the negative of the
    # angle to rotate clockwise), then grab the sine and cosine
    # (i.e., the rotation components of the matrix)
    M = cv2.getRotationMatrix2D((cX, cY), -angle, 1.0)
    cos = np.abs(M[0, 0])
    sin = np.abs(M[0, 1])

    # compute the new bounding dimensions of the image
    nW = int((h * sin) + (w * cos))
    nH = int((h * cos) + (w * sin))

    # adjust the rotation matrix to take into account translation
    M[0, 2] += (nW / 2) - cX
    M[1, 2] += (nH / 2) - cY

    # perform the actual rotation and return the image
    return cv2.warpAffine(image, M, (nW, nH))

if __name__ == '__main__':
    print('common function')