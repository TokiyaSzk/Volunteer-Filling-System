const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;
const userRoutes = require('./api/user.js');
const schoolRoutes = require('./api/school.js');
const majorRoutes = require('./api/majors.js');
const db = require('./db.js');
const volunteer = require('./api/volunteer.js');
const admission = require('./api/admission.js');


app.use(cors()); // 默认允许所有源访问
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    }
    console.log('Connected to the MySQL database');
});

initDatabaseAndTable(db);


app.get('/', (req, res) => {
    res.send('You have reached the Express server');
});
app.use('/api/user', userRoutes);
app.use('/api/school', schoolRoutes);
app.use('/api/major', majorRoutes);
app.use('/api/volunteer', volunteer);
app.use('/api/admission', admission);

app.get('/init', (req, res) => {
    insertTestData(db);
    res.send('Test data inserted');
});

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});

function initDatabaseAndTable(db) {
    db.query(`CREATE DATABASE IF NOT EXISTS dev`, (err, result) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log('Database checked/created');
    });

    db.changeUser({ database: 'dev' }, (err) => {
        if (err) {
            console.error('Error changing database:', err);
            return;
        }
        console.log('Database changed to dev');
    });

    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            score INT,
            region VARCHAR(255)
        );`,
        `CREATE TABLE IF NOT EXISTS schools (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            province VARCHAR(255),
            ranking INT,
            category VARCHAR(255)
        );`,
        `CREATE TABLE IF NOT EXISTS majors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            school_id INT,
            min_score INT,
            max_score INT,
            FOREIGN KEY (school_id) REFERENCES schools(id)
        );`,
        `CREATE TABLE IF NOT EXISTS applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            school_id INT NOT NULL,
            major_id INT NOT NULL,
            priority INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (school_id) REFERENCES schools(id),
            FOREIGN KEY (major_id) REFERENCES majors(id)
        );`,
        `CREATE TABLE IF NOT EXISTS admissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            school_id INT NOT NULL,
            major_id INT NOT NULL,
            batch INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (school_id) REFERENCES schools(id),
            FOREIGN KEY (major_id) REFERENCES majors(id)
        );`
    ];
    queries.forEach(query => {
        db.query(query, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return;
            }
            console.log('Query executed successfully');
        });
    });
}

function insertTestData(db) {

    // 插入学校表数据
    const insertSchools = `
      INSERT INTO schools (name, province, ranking, category) VALUES
      ('University A', 'Province X', 1, 'Comprehensive'),
      ('University B', 'Province Y', 2, 'Science'),
      ('University C', 'Province Z', 3, 'Technology'),
      ('University D', 'Province W', 4, 'Arts'),
      ('University E', 'Province V', 5, 'Medicine');
    `;

    // 插入专业表数据
    const insertMajors = `
      INSERT INTO majors (name, school_id, min_score, max_score) VALUES
      ('Computer Science', 1, 600, 750),
      ('Mechanical Engineering', 1, 620, 740),
      ('Physics', 2, 610, 730),
      ('Law', 4, 580, 690),
      ('Medicine', 5, 650, 800),
      ('Mathematics', 3, 590, 710),
      ('Civil Engineering', 2, 600, 720),
      ('Economics', 1, 580, 700),
      ('Philosophy', 4, 570, 680),
      ('Biology', 3, 600, 730);
    `;

    // 执行插入操作

    db.query(insertSchools, (err) => {
        if (err) {
            console.error('插入学校表数据失败:', err);
            return;
        }
        console.log('学校表数据插入成功');
    });

    db.query(insertMajors, (err) => {
        if (err) {
            console.error('插入专业表数据失败:', err);
            return;
        }
        console.log('专业表数据插入成功');
    });
};
