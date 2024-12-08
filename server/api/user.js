const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const argon2 = require('argon2');
const db = require('../db.js');




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
    // const hashedPassword = await bcrypt.hash(password, 10);库冲突
    const hashedPassword = await argon2.hash(password);

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
        const isPasswordValid = await argon2.verify(user.password, password);

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
        console.log('Generated Token:', token);
    });
});

// 获取用户信息
router.get('/profile',async (req, res) => {
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
            'SELECT username, email, score, region FROM users WHERE id = ?',
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

// 用户更新完整信息（必须包含完整字段）
router.put('/update', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).send('Unauthorized');
        return;
    }

    // 验证令牌
    jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
        if (err) {
            res.status(401).send('Unauthorized');
            return;
        }

        const userId = decoded.id;
        const { username, email, password, score, region } = req.body;

        // 检查所有字段是否提供
        if (!username || !email || !password || score === undefined || !region) {
            res.status(400).send('All fields (username, email, password, score, region) are required');
            return;
        }

        try {
            // 确保用户名唯一
            const [existingUser] = await db.promise().query(
                'SELECT * FROM users WHERE username = ? AND id != ?',
                [username, userId]
            );
            if (existingUser.length > 0) {
                res.status(400).send('Username already exists');
                return;
            }

            // 加密新密码
            const hashedPassword = await argon2.hash(password);

            // 更新用户信息
            const [results] = await db.promise().query(
                `UPDATE users SET username = ?, email = ?, password = ?, score = ?, region = ? WHERE id = ?`,
                [username, email, hashedPassword, score, region, userId]
            );

            if (results.affectedRows === 0) {
                res.status(404).send('User not found');
                return;
            }

            res.status(200).send('User information updated successfully');
        } catch (err) {
            console.error('Error updating user information:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});
module.exports = router;