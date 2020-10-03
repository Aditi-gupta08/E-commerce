E- Commerce Project

Process to run the repo :
1) Clone project
Run foll. commands in Terminal :
- git clone 'https://github.com/Aditi-gupta08/E-commerce.git'
- cd E-commerce
- code .
   

2) Install Packages
- npm init
- Install -> node, await-to-js, bcrypt, env-cmd, express, joi, jsonwebtoken, mysql2, redis, sequelize, winston Packages
  To install any package run in terminal: npm i <package_name>


3) Database setup
- Install xampp application 
- Start the server
- Go to 'http://localhost:81/phpmyadmin/' and create database named 'E-commerce'


4) Setup env variables 
- Create file variables.env in E-commerce/data 
- Set secret key and admin id ( who can add Categories, Products )


5) Start server
-5 Run cmd on terminal: npm run start


6) Setup postman
- Install postman App -> Click Import -> import collection using the given link 
  Postman collection Link : 'https://www.getpostman.com/collections/434e5a75850b03776089'

- Signup customer -> Login (Access token will be provided)
- To call any authencated Api, add in header :
  key - Autherization  value - Bearer <access_token>



Demo of project: 'https://youtu.be/jnSLjxTvWes'