
# SocialBook

This repository contains the code for SocialBook, a simple social media application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The application allows users to register, log in, create posts with images and descriptions, like posts, and manage their own posts. Authentication is handled using JWT (JSON Web Tokens) for secure user authentication, and authorization ensures that only the original poster can delete or edit their posts. Additionally, the authentication system includes email login and a password recovery feature via email.

## Features

- User Registration
- User Login (via email)
- Password Recovery (via email)
- View and Edit Profile
- Create Posts with Images and Descriptions
- Like and Unlike Posts
- Displaying Each post Along with total likes
- Manage Own Posts (edit and delete)
- JWT-based Authentication and Authorization


## Installation

First clone this to your local machine using git:

```bash
https://github.com/osamullah420/SocialBook-MernStack.git

cd SocialBook-MernStack
```

Change the Directory to backend and Install Dependencies for it:

```bash
cd backend

npm install
```

Create .env File and set your credentials:


```bash
PORT = 8080

MONGO_URL = your mongo url

JWT_SECRET = your jwt secret

EMAIL= your email for node mailer
EMAIL_PASSWORD= less secure app passwrd for email

CLOUDINARY_CLIENT_NAME = your cloudinary client name
CLOUDINARY_CLIENT_API = your cloudinary api
CLOUDINARY_CLIENT_SECRET = your cloudinary client secret
```

Now Change directory to frontend and install dependencies:

```bash
cd ..
cd frontend

npm install
```


Run this Command to concurrently run frontend & backend ( make sure you are in backend directory):


```bash
npm run get
```

Copy and Paste this in your browsser :

```bash
http://localhost:5173/
```


This README provides step-by-step instructions for cloning the repository, setting up the backend and client, and running the application.




    
