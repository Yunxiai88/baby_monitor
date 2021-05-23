# Video-Based Multi-Modal Intelligent Infant Activities Tracking System

## Description
* Taking care of newborn babies is not an easy job, it takes timefor the parents to understand their infant’s behavior to takecare of them better. 
* This project proposed a multi-modal solution to analyze the babys’ action activities including climbing,crawling, rolling, walking, as well as detecing crying using audio input




## Technology
* Python: 3.x
* Flask
* OpenCV
* YAMNet
* 3D Convolutional Network
* tensorflow, pandas, numpy
* Other libraries like librosa, moviepy, pyaudio, pydub

## Training Details

1. **Training YAMNet**
      * Loading YAMNet from TensorFlow Hub or download YAMNet to your local.
      * Download ESC-50 dataset from https://github.com/karolpiczak/ESC-50.
      * Filter the data which you will apply some transformation on it. then split the dataset into train, validation and test.
      * Create a simple Sequential Model with -- one hiden layer and 2 outputs to recognize baby crying and others.
      * Combine YAMNet with new model into one single model.
      * refer to ```YAMNet_Detection.ipynb``` for more details on traning YAMNet.

2. **Training 3D CNN**
      * Download A2D(Actor-Action Dataset) dataset from https://web.eecs.umich.edu/~jjcorso/r/a2d/.
      * Extract only the Baby action dataset.
      * refer to ```video_preprocessing.py``` for more details on baby video dataset preparation.
      * From the extracteded video dataset, filter out video if have other human in the video.
      * Split the Dataset into 80/20 for training and testing.
      * refer to ```video_classification_on_baby_action.ipynb``` for more details on 3D CNN model summary and training parameters.
       

## How to run the system


* 1. create environment:   
            ```
      	conda create -n baby python=3.6
            ```

* 2. activate newly created environment:   
            ```
      	conda activate baby
            ```

* 3. Go to the project root folder and run below command to install packages:   
            ```
      	pip install -r requirement.txt
            ```


* 4. Run this command at the project root directory:  
             ```
             python webapp/babymonitor.py --ip 127.0.0.1 --port 8000
             ```
* 5. open URL in your browser:   
             ```
             http://localhost:8000/
             ```
## References

* https://www.soundjay.com/baby-crying-sound-effect.html
* https://research.google.com/audioset/ontology/index.html
* https://gist.github.com/achillessin
* https://blog.tensorflow.org/2021/03/transfer-learning-for-audio-data-with-yamnet.html
* https://towardsdatascience.com/deep-learning-for-classifying-audio-of-babies-crying-9a29e057f7ca

