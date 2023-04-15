# PulmoCoach

## Demo Video
Watch a quick demo of our project in action!
[![Alt text](https://img.youtube.com/vi/ieyXoZJ4PU8%26pp%3DygUKcHVsbW9jb2FjaA%253D%253D/0.jpg)](https://www.youtube.com/watch?v=ieyXoZJ4PU8%26pp%3DygUKcHVsbW9jb2FjaA%253D%253D)


## Running the Web Frontend and Backend Locally
To run the PulmoCoach web frontend and backend locally, follow these steps:

### Prerequisites
Before running the application, ensure that the following are installed on your machine:

- Node.js and npm (Node Package Manager): You can download them from https://nodejs.org/<br>
- Angular CLI: You can install it by running the following command in your terminal/command prompt:
```bash
npm install -g @angular/cli
```
- Python 3.x: You can download it from https://www.python.org/downloads/<br>
- Git: You can download it from https://git-scm.com/downloads
### Clone the Repository
Open your terminal/command prompt and navigate to the directory where you want to clone the repository.
Run the following command to clone the repository:

```bash
git clone https://github.com/eric900115/PulmoCoach.git
```

### Frontend
Open a new terminal/command prompt and navigate to the <mark>PulmoCoach</mark> directory.
Run the following command to install the required packages:

```bash
npm install
```

Run the following command to start the frontend server:

```bash
npm start
```

The frontend should now be accessible at http://localhost:4200. 
```bash
Note : If the frontend is not running on this URL, the login API may fail.
```
### Backend
Open a new terminal/command prompt and navigate to the <mark>PulmoCoach/backend</mark> directory.
Run the following command to install the required packages:

```bash
pip install -r requirements.txt
```

Run the following command to start the backend server:

```bash
python app.py
```

That's it! You should now be able to access the PulmoCoach web application locally. If you encounter any issues, please refer to the repository's issue tracker or seek assistance from the project contributors.

## Abstract 

<p> &emsp;&emsp; Medical imaging has been widely used as an examination method in hospitals due to its non-invasive characteristic. Among them,chest radiographs, also known as chest x-rays or CXRs,are the most common. However, there have not been many interactive resources that help medical school students and other healthcare providers learn how to interpret medical images. Therefore, the learningcurve for chest radiograph interpretation can be steep and challenging for beginners.</p>
<br>

<p> &emsp;&emsp; Based on this situation, our team, composed of members from departments of computer science, electrical engineering, biomedical engineering, and medicine, decided to build a website that can serve as a tutorial and self-evaluation resource aimed at assisting healthcare providers new to CXR interpretation in better understanding some of the most crucial findings in CXR.</p>
<br>

<p> &emsp;&emsp; Our platform is free and open-source, and our data is also based on open-source atasets. There are plenty of interesting images with accurate lesion localization and annotations made by professional radiologists. So make sure to try it out!</p>            
<br>

<p> &emsp;&emsp; We are looking forward to incorporating AI diffusion model assistance in the future to make image comparisons and lesion localization easier.</p>
<br>
<hr>

## Technical Strucutre 
&emsp;

<img src = '/images/Architecture.jpg'>
&emsp;
<p>Our website is powered by a seamless integration of front-end and back-end technologies. We selected Angular as our front-end framework and utilized the dynamic capabilities of Flask and Firebase for the back-end. We entrust Flask to provide APIs for our front-end framework and the Firebase Realtime Database and Firestore for our data and metadata storage. For secure and reliable authentication, we have incorporated the Google Login API. Our website is now hosted on local computer, and will be deployed on the state-of-the-art GCP Platform soon.
For the machine learning model, we develop the model by using tensorflow
</p>

##### For more information about Angular, please refer to : https://github.com/angular/angular-cli

&emsp;
<hr>

## About our Team

##### We are students from NYCU GDSC Taiwan. Following are the member list.
<br>
<div style = " display : flex;">
    <img src = "./images/team.png">
</div>


