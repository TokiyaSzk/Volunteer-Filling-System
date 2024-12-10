const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const db = require('../db.js');

// 数据库连接检查
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// 默认路由
router.get('/', (req, res) => {
    res.send('Admin route is active');
});

// 管理员注册
router.post('/register', async (req, res) => {
    const { username, password, school_id } = req.body;

    if (!username || !password) {
        res.status(400).send('Username and password are required');
        return;
    }

    try {
        // 加密密码
        const hashedPassword = await argon2.hash(password);

        // 插入管理员数据
        db.query(
            'INSERT INTO admin (username, password, school_id) VALUES (?, ?, ?)',
            [username, hashedPassword, school_id],
            (err, results) => {
                if (err) {
                    console.error('Error registering admin:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.status(201).send('Admin registered successfully');
            }
        );
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).send('Internal Server Error');
    }
});

// 管理员登录
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send('Username and password are required');
        return;
    }

    db.query('SELECT * FROM admin WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Error fetching admin:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Invalid credentials');
            return;
        }

        const admin = results[0];
        const isPasswordValid = await argon2.verify(admin.password, password);

        if (!isPasswordValid) {
            res.status(401).send('Invalid credentials');
            return;
        }

        // 生成 JWT
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.json({ token });
    });
});

// 获取管理员信息
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

        db.query(
            'SELECT id, username, school_id FROM admin WHERE id = ?',
            [decoded.id],
            (err, results) => {
                if (err) {
                    console.error('Error fetching admin profile:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                if (results.length === 0) {
                    res.status(404).send('Admin not found');
                    return;
                }

                res.json(results[0]);
            }
        );
    });
});

// 更新管理员密码
router.put('/update-password', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const { password } = req.body;

    if (!token || !password) {
        res.status(400).send('Token and password are required');
        return;
    }

    jwt.verify(token, 'your_jwt_secret', async (err, decoded) => {
        if (err) {
            res.status(401).send('Unauthorized');
            return;
        }

        try {
            // 加密新密码
            const hashedPassword = await argon2.hash(password);

            // 更新密码
            db.query(
                'UPDATE admin SET password = ? WHERE id = ?',
                [hashedPassword, decoded.id],
                (err, results) => {
                    if (err) {
                        console.error('Error updating password:', err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    if (results.affectedRows === 0) {
                        res.status(404).send('Admin not found');
                        return;
                    }

                    res.status(200).send('Password updated successfully');
                }
            );
        } catch (err) {
            console.error('Error hashing password:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

module.exports = router;