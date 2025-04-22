
# MedConnect

# Setup Instructions:
Prerequisite: Sufficient understanding of react, javascript, express,mongodb(web account), HTML, and CSS are the required prerequisites.


# How to set up the App: 
## Install node.js and npm:
Go to https://nodejs.org/en to install node.js and make sure to click npm manager in the installation screen to install both node.js and npm together.
Go to your command prompt and run npm -v or node -v to verify the installation
Or, You can do npm install to install npm after installing node.js.
Do npm start to start the app. The app will then get started on the local host.
Be sure to perform npm install and npm start on both server and client directories in the terminal( also, you only need to perform npm install once)
When you open up the folder, be sure to import cors, and bcrpyt in the server directory before running npm start. Do this by running npm install cors and npm install bcrpyt. (there's a small chance they might not be installed in there if you open it).
Go to this website for more information:https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac 
## VScode installation:
Go to https://code.visualstudio.com/docs/setup/windows to install vscode
Complete the installer screen, then run the app
Verify npm and node works on it by running npm -v or node -v in the terminal
## MongoDB setup: 
Go to https://www.mongodb.com/ and click sign up
Click Create project and add a name to it. then click create project.
Then click Build Database and be sure to choose the free option for the cluster with aws and choose your nearest region location. Then click CREATE at the very bottom of the page.
Where it says “Security Quickstart”, Enter your username and password. Be sure to keep your username and password somewhere for you to remember, like in a notepad. Click Add User when you're done. If need be, include your ip at the very bottom, but for now it should be done for you already.
Click finish and close to end setup.
Then click Connect. This is to configure any mongodb installation to your software. Choose Drivers and then choose nodejs 6.7. Mongodb should be installed in the app already so just copy and paste the third option(it says “Add your connection string into your application code”.
Place the the code URL in the .env file in the application where it says MONGO_URL. Be sure to replace the <password> with your password from step 4.
This should configure the database for you.
If you need more help, watch this video from the “Set up mongodb and connect it” section of the video.https://youtu.be/XPC81RWOItI?t=2034 

## Zip file import:
Go to the github https://github.com/kiwimped/MedConnectNew 
Click on the code button and download the zip file
Delete node_modules in both server and client folders before extracting them(they contain too many files)
Place the file and extract it into a distinct folder 
Run the folder in VScode, and be sure to type npm install in both directories (you only need to do this once), then type npm start in the project folder’s directory in the terminal to run the project i.e( c:/projectFolder/client and /server  npm start)

## Extras:
Make sure that the directories(i.e. functions or constants) that are called in the code go to their intended folder and file.
Also, make sure that any of the dependencies of the react project from the images below are in their package.json file.

## Client:
![Screenshot](https://media.discordapp.net/attachments/495416328983805975/1316535466195161138/Screenshot_2024-12-11_173743.png?ex=675b66b3&is=675a1533&hm=59358c73049ccfe29fce9a004fe0446979d87f26d13b9459faf75f8e21a4eb17&=&format=webp&quality=lossless&width=482&height=570 "Screenshot Example")

## Server:
![Screenshot](https://media.discordapp.net/attachments/495416328983805975/1316535947638341642/image.png?ex=675b6725&is=675a15a5&hm=8113a1517417a26fa38d0bb3c3c2fc5a797160c72f50f4ce1db7942ba3e44ded&=&format=webp&quality=lossless&width=492&height=570 "Screenshot Example")

# Video on how it runs:


# add api AI key in both .env files in server and client 
