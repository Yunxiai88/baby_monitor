# Baby Safety Monitoring

## Description
* Under current COVID-19 pandemic situation, it is critical to ensure everyone stay safe and protected by wearing mask at all time. 
* There is a need for an auto mask detection, especially in public aeras like shopping malls, offices, schools etc.

* This projects aims to provide a system to automatically detect those who enter a public area not wearing a proper mask, and based on the pre-trained Deep Learning model, recognize the identity of the person, which can then be integrated to downstream system to provide possible warnings to the person or the management team.

## System Requirement
* OS: Windows 10/Linux
* GPU: NVIDIA GeForce GTX
* CUDA TOOLKIT: cuda_11.0.3
* cuDNN SDK: v11.0

## Technology
* LabelImg: clone project from (https://github.com/tzutalin/labelImg.git)
* Python: 3.x
* Flask
* OpenCV
* YOLOv4
* YAMNet
* InceptionResNetV2

## Training Details

1. **Training YAMNet**
      * Loading YAMNet from TensorFlow Hub or download YAMNet to your local.
      * Download ESC-50 dataset from https://github.com/karolpiczak/ESC-50.
      * Filter the data which you will apply some transformation on it. then split the dataset into train, validation and test.
      * Create a simple Sequential Model with -- one hiden layer and 2 outputs to recognize baby crying and others.
      * Combine YAMNet with new model into one single model.
      * refer to ```YAMNet_Detection.ipynb``` for more details on traning YAMNet.

2. **Training FaceNet**
     * If you want to directly use a pre-trained model for facial recognition, just skip this step.
     * If you want to implement a tranfer learning with a pre-trained model and your own dataset, you need to first download this pre-trained [model](https://drive.google.com/file/d/0B5MzpY9kBtDVZ2RpVDYwWmxoSUk/edit), put it in /models and unzip it. Make sure that the directory /models/20170512-110547 has 4 files.
       
       Then run
       ```bash
       $ python train_tripletloss.py
       ```
     
       The trained model will be in the /models/facenet.
     
     * If you want to train your own model from scratch. In ```train_tripletloss.py``` line 433, there is an optional argument named "--pretrained_model", delete its default value.
     
       Then run again 
       ```bash
       $ python train_tripletloss.py
       ```
     
       The trained model will also be in the /models/facenet.
       
     * refer to ```facenet_test.ipynb``` for more details on traning facenet.


## System Integration
1. **WebUI**

2. **Execution** 

download the trained weight from 
https://drive.google.com/file/d/1-7JQiyR2yLLPJJJNV30NZIgpqnwsk1Jh/view?usp=sharing
and put it under /yolov4/yolov4_custom_train_final.weights

* run this command at the project root directory:  
       ```
       $ python webapp/babymonitor.py --ip 127.0.0.1 --port 8000
       ```
* open URL in your browser:
       ```
       http://localhost:8000/
       ```
## References

* https://www.soundjay.com/baby-crying-sound-effect.html
* https://research.google.com/audioset/ontology/index.html
* https://gist.github.com/achillessin
* https://towardsdatascience.com/deep-learning-for-classifying-audio-of-babies-crying-9a29e057f7ca

