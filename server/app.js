const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;

const db = mysql.createConnection({
    host: 'db',
    user: 'user',
    password: 'password',
    database: 'mydatabase',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});