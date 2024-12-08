# Volunteer-Filling-System
Software engineering Course final program 

## How to use
*Attention If you don't have mysql in you computer. please click [here](#docker) to use docker*  
*If you have mysql in your computer Please change some params to fit you mysql*

- Server(express app)
	```
	cd server
	npm install
	node app.js
	```
  - to test root api
	```
	curl --location 'http://localhost:3001/'
	```
	You will look output
	```
	You have reached the Express server
	```
  - to test user api
	```
	curl --location 'http://localhost:3001/api/user'
	```
	You will look output
	```
	You have reached the Express server
	```
  


# Run in Docker
