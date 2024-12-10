const express = require('express');
const router = express.Router();
const db = require('../db.js');

// 数据库连接检查
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// 基础路由
router.get('/', (req, res) => {
    res.send('You have reached the Applications API');
});

// 增加志愿
router.post('/add', (req, res) => {
    const { user_id, school_id, major_id, priority } = req.body;

    if (!user_id || !school_id || !major_id || !priority) {
        res.status(400).send('All fields (user_id, school_id, major_id, priority) are required');
        return;
    }

    db.query(
        'INSERT INTO applications (user_id, school_id, major_id, priority) VALUES (?, ?, ?, ?)',
        [user_id, school_id, major_id, priority],
        (err, results) => {
            if (err) {
                console.error('Error adding application:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).json({ message: 'Application added successfully', application_id: results.insertId });
        }
    );
});

// 删除志愿
router.delete('/delete/:id', (req, res) => {
    const application_id = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
        res.status(400).send('User ID is required');
        return;
    }

    db.query(
        'DELETE FROM applications WHERE id = ? AND user_id = ?',
        [application_id, user_id],
        (err, results) => {
            if (err) {
                console.error('Error deleting application:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send('Application not found or unauthorized');
                return;
            }

            res.status(200).json({ message: 'Application deleted successfully' });
        }
    );
});

// 修改志愿
router.put('/update/:id', (req, res) => {
    const application_id = req.params.id;
    const { user_id, school_id, major_id, priority } = req.body;

    if (!user_id) {
        res.status(400).send('User ID is required');
        return;
    }

    // 检查是否提供了至少一个字段更新
    if (!school_id && !major_id && !priority) {
        res.status(400).send('At least one field (school_id, major_id, priority) must be provided for update');
        return;
    }

    // 动态构建 SQL 更新语句
    const updates = [];
    const values = [];
    if (school_id) {
        updates.push('school_id = ?');
        values.push(school_id);
    }
    if (major_id) {
        updates.push('major_id = ?');
        values.push(major_id);
    }
    if (priority) {
        updates.push('priority = ?');
        values.push(priority);
    }
    values.push(application_id, user_id);

    db.query(
        `UPDATE applications SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
        values,
        (err, results) => {
            if (err) {
                console.error('Error updating application:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send('Application not found or unauthorized');
                return;
            }

            res.status(200).json({ message: 'Application updated successfully' });
        }
    );
});


// 查询志愿
router.get('/query', (req, res) => {
    const { user_id, school_id } = req.query;

    // 检查是否只传递了其中一个参数
    if ((user_id && school_id) || (!user_id && !school_id)) {
        res.status(400).send('Please provide either user_id or school_id, but not both.');
        return;
    }

    // 构建查询语句
    let query = '';
    let queryParam = null;

    if (user_id) {
        query = 'SELECT * FROM applications WHERE user_id = ?';
        queryParam = user_id;
    } else if (school_id) {
        query = 'SELECT * FROM applications WHERE school_id = ?';
        queryParam = school_id;
    }

    // 执行查询
    db.query(query, [queryParam], (err, results) => {
        if (err) {
            console.error('Error fetching applications:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        res.status(200).json(results);
    });
});
module.exports = router;