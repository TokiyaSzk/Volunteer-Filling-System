const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// 创建数据库连接(dev)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Caierh521.',
    database: 'dev',
    port: 3306
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

router.get('/', (req, res) => {
    res.send('You have reached the Express server');
});
// 用户注册
router.post('/register', async (req, res) => {
    const { username, password, email, score = null, region = null } = req.body;

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入用户数据
    db.query(
        'INSERT INTO users (username, password, email, score, region) VALUES (?, ?, ?, ?, ?)',
        [username, hashedPassword, email, score, region],
        (err, results) => {
            if (err) {
                console.error('Error registering user:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).send('User registered');
        }
    );
});

// 用户登录
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Invalid credentials');
            return;
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).send('Invalid credentials');
            return;
        }

        // 使用 `score` 和 `region` 添加到 JWT payload 中
        const token = jwt.sign(
            { id: user.id, username: user.username, score: user.score, region: user.region },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );
        res.json({ token });
    });
});

// 获取用户信息
router.get('/profile', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).send('Unauthorized');
        return;
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            res.status(401).send('Unauthorized');
            return;
        }

        // 获取用户数据
        db.query(
            'SELECT id, username, email, score, region FROM users WHERE id = ?',
            [decoded.id],
            (err, results) => {
                if (err) {
                    console.error('Error fetching user profile:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                if (results.length === 0) {
                    res.status(404).send('User not found');
                    return;
                }

                res.json(results[0]);
            }
        );
    });
});


module.exports = router;