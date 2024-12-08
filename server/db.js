// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'rootpassword',
    database: 'dev',
    port: 3306
});

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Caierh521.',
//     port: 3306
// });

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports = db;