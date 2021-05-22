#import shutil, os
import pandas as pd
import cv2
import numpy as np
import random
import copy
import math

# Utilities to open video files using CV2
def crop_center_square(frame):
  y, x = frame.shape[0:2]
  min_dim = min(y, x)
  start_x = (x // 2) - (min_dim // 2)
  start_y = (y // 2) - (min_dim // 2)
  return frame[start_y:start_y+min_dim,start_x:start_x+min_dim]

def load_video(path, max_frames=0, frames_skip = 1, resize=(224, 224)):
  cap = cv2.VideoCapture(path)
  frames = []
  frame_count = 0
  try:
    while True:
      ret, frame = cap.read()
      if not ret:
        break
      if not(frame_count%frames_skip): 
          frame = crop_center_square(frame)
          frame = cv2.resize(frame, resize)
          frame = frame[:, :, [2, 1, 0]]
          frames.append(frame)
      if len(frames) == max_frames:
        break
      frame_count = frame_count+1
  finally:
    cap.release()
  return np.array(frames) / 255.0

df = pd.read_csv("..\\dataset\\Release\\videoset.csv")
df = df.to_numpy()

test = []

climb_train = []
crawl_train = []
roll_train = []
walk_train = []

#climb_c = 96
#crawl_c  = 82
#roll_c  = 78
#walk_c  = 72

climb_test_c = 20
crawl_test_c  = 20
roll_test_c  = 20
walk_test_c  = 20
    
    
for item in df:
    if item[1] == 21:
        try:
            t_start = item[2].split(":")
            t_end = item[3].split(":")
            duration = ((int(t_end[0])*360 + int(t_end[1])*60 + int(t_end[2])) - (int(t_start[0])*360 + int(t_start[1])*60 + int(t_start[2])))
            fps = math.floor(item[6]/(duration*5))
            sample = load_video('..\\dataset\\\Release\\clips320H\\'+item[0]+'.mp4',max_frames = 10,frames_skip = fps)
            if sample.shape[0] == 10:
                if climb_test_c:
                    test.append([sample,'climb'])
                    climb_test_c = climb_test_c - 1
                else:
                    climb_train.append([sample,'climb'])
        except:
            print('climb : ' + item[0])
    elif item[1] == 22:
        try:
            t_start = item[2].split(":")
            t_end = item[3].split(":")
            duration = ((int(t_end[0])*360 + int(t_end[1])*60 + int(t_end[2])) - (int(t_start[0])*360 + int(t_start[1])*60 + int(t_start[2])))
            fps = math.floor(item[6]/(duration*5))
            sample = load_video('..\\dataset\\\Release\\clips320H\\'+item[0]+'.mp4',max_frames = 10,frames_skip = fps)
            if sample.shape[0] == 10:
                if crawl_test_c:
                    test.append([sample,'crawl'])
                    crawl_test_c = crawl_test_c - 1
                else:
                    crawl_train.append([sample,'crawl'])
        except:
            print('crawl : ' + item[0])
    elif item[1] == 26:
        try:
            t_start = item[2].split(":")
            t_end = item[3].split(":")
            duration = ((int(t_end[0])*360 + int(t_end[1])*60 + int(t_end[2])) - (int(t_start[0])*360 + int(t_start[1])*60 + int(t_start[2])))
            fps = math.floor(item[6]/(duration*5))
            sample = load_video('..\\dataset\\\Release\\clips320H\\'+item[0]+'.mp4',max_frames = 10,frames_skip = fps)
            if sample.shape[0] == 10:
                if roll_test_c:
                    test.append([sample,'roll'])
                    roll_test_c = roll_test_c - 1
                else:
                    roll_train.append([sample,'roll'])
        except:
            print('roll : ' + item[0])
    elif item[1] == 28:
        try:
            t_start = item[2].split(":")
            t_end = item[3].split(":")
            duration = ((int(t_end[0])*360 + int(t_end[1])*60 + int(t_end[2])) - (int(t_start[0])*360 + int(t_start[1])*60 + int(t_start[2])))
            fps = math.floor(item[6]/(duration*5))
            sample = load_video('..\\dataset\\\Release\\clips320H\\'+item[0]+'.mp4',max_frames = 10,frames_skip = fps)
            if sample.shape[0] == 10:
                if walk_test_c:
                    test.append([sample,'walk'])
                    walk_test_c = walk_test_c - 1
                else:
                    walk_train.append([sample,'walk'])
        except:
            print('walk : ' + item[0])
"""
d_climb_train = copy.copy(climb_train)
d_crawl_train = copy.copy(crawl_train)
d_roll_train = copy.copy(roll_train)
d_walk_train = copy.copy(walk_train)

d_climb_train = random.sample(climb_train, 80-len(climb_train))
d_crawl_train = random.sample(crawl_train, 80-len(crawl_train))
d_roll_train = random.sample(roll_train, 80-len(roll_train))
d_walk_train = random.sample(walk_train, 80-len(walk_train))

random.shuffle(d_climb_train)
random.shuffle(d_crawl_train)
random.shuffle(d_roll_train)
random.shuffle(d_walk_train)

train = climb_train + d_climb_train[:(80-len(climb_train))] + crawl_train + d_crawl_train[:(80-len(crawl_train))] + roll_train + d_roll_train[:(80-len(roll_train))] + walk_train + d_walk_train[:(80-len(walk_train))]
"""

train = climb_train + crawl_train + roll_train + walk_train

random.shuffle(test)
random.shuffle(train)

p_train = []
p_train_label = []
p_test = []
p_test_label = []

for i in test:
    p_test.append(i[0])
    p_test_label.append(i[1])
    
for j in train:
    p_train.append(j[0])
    p_train_label.append(j[1])

np.save('..\\dataset\\train', p_train)
np.save('..\\dataset\\test', p_test)
np.save('..\\dataset\\train_label', p_train_label)
np.save('..\\dataset\\test_label', p_test_label)

"""
for item in df:
    if item[1] == 21:
        sample = load_video('..\\dataset\\\Release\\clips320H\\'+item[0]+'.mp4')
        if sample.shape[0] = 8:
            shutil.copy('..\\dataset\\Release\\clips320H\\'+item[0]+'.mp4', '..\\dataset\\reduce\\train\\1_'+item[0]+'.mp4')
    if item[1] == 22:
        sample = load_video('..\\dataset\\\Release\\clips320H\\'+item[0]+'.mp4')
        if sample.shape[0] = 8:
            shutil.copy('..\\dataset\\Release\\clips320H\\'+item[0]+'.mp4', '..\\dataset\\reduce\\train\\2_'+item[0]+'.mp4')
    if item[1] == 26:
        sample = load_video('..\\dataset\\\Release\\clips320H\\'+item[0]+'.mp4')
        if sample.shape[0] = 8:
            shutil.copy('..\\dataset\\Release\\clips320H\\'+item[0]+'.mp4', '..\\dataset\\reduce\\train\\3_'+item[0]+'.mp4')
    if item[1] == 28:
        sample = load_video('..\\dataset\\\Release\\clips320H\\'+item[0]+'.mp4')
        if sample.shape[0] = 8:
            shutil.copy('..\\dataset\\Release\\clips320H\\'+item[0]+'.mp4', '..\\dataset\\reduce\\train\\4_'+item[0]+'.mp4')
"""
