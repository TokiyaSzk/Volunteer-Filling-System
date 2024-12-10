# Volunteer-Filling-System
Software engineering Course final program 

## How to use
*Attention If you don't have mysql in you computer. please click [here](#docker) to use docker*
*If you have mysql in your computer Please change some params to fit you mysql and please don't create the dev database*

## Run in Local
- Server (express app)
  -	run code in your terminal. we expected you terminal in program root
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
  


- Client (NextJs+TailwindCSS+JWT)
  -	run code in your terminal. we expected you terminal in program root
	```
	cd client
	npm install 
	npm run dev
	```
	Now you can click http://localhost:3000 to browser the Client  
	*Attention the button in HomePage which name is "初始化数据". Please just click once* 
## Run in Docker
This docker is use docker-compose to build image and run docker. Please atteion you have docker in your computer. 
- Don't have docker  
	If you don't have docker please click https://www.docker.com to install docker 
- Have docker 
   - Before start  
	Please change some code in /server/db.js
	Annotate these code
	```
		const db = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'Caierh521.',
		port: 3306
		});
	```
	Cancel Annotate these code
	```
		const db = mysql.createConnection({
		host: 'db',
		user: 'root',
		password: 'rootpassword',
		database: 'dev',
		port: 3306
		});
	```
   - Start Docker
		Just run code in your program root terminal
	```
		docker-compose build
		docker-compose up
	```
		