Bond Booth
============

CS247 Assignment Number 2 -- Shadowboxing

Set-up:
KinectSDK & KinectJS need to be installed on the computer. Place the Kinect along the same direction of the webcam. No user needs to be in front of the computer or within the Kinect range initially.

1) Run the server: ./server.sh
(OR "python -m SimpleHTTPServer 8000")

2) Open Chrome web browser and go to http://localhost:8000

3) Enter KinectJS socket server's address. 

4) Allow the app to use the camera and hit Capture Background button.

5) User walks into the scene with both of his hands lowered. The barrel will follow his shadow on the screen as he walks.

6) The user raises his hand to "fire" the gun. The "blood" overlay will drop to cover the whole screen and the 007 theme song will play automatically.