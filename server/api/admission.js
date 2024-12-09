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
    res.send('You have reached the Admissions API');
});


// 查询某个学生的录取结果
router.get('/results/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    console.log(user_id)
    db.query(
        'SELECT * FROM admissions WHERE user_id = ?',
        [user_id],
        (err, results) => {
            if (err) {
                console.error('Error fetching admission:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.length === 0) {
                res.status(404).send('No admissions found for this user');
                return;
            }

            res.json(results);
        }
    );
});

// 添加录取结果
router.post('/add', (req, res) => {
    const { user_id, school_id, major_id, batch } = req.body;

    if (!user_id || !school_id || !major_id || !batch) {
        res.status(400).send('All fields (user_id, school_id, major_id, batch) are required');
        return;
    }

    db.query(
        'INSERT INTO admissions (user_id, school_id, major_id, batch) VALUES (?, ?, ?, ?)',
        [user_id, school_id, major_id, batch],
        (err, results) => {
            if (err) {
                console.error('Error adding admission:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).json({ message: 'Admission added successfully', admission_id: results.insertId });
        }
    );
});

// 更新录取结果
router.put('/update/:id', (req, res) => {
    const admission_id = req.params.id;
    const { user_id, school_id, major_id, batch } = req.body;

    if (!user_id) {
        res.status(400).send('User ID is required');
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
    if (batch) {
        updates.push('batch = ?');
        values.push(batch);
    }
    values.push(admission_id, user_id);

    db.query(
        `UPDATE admissions SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
        values,
        (err, results) => {
            if (err) {
                console.error('Error updating admission:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send('Admission not found or unauthorized');
                return;
            }

            res.status(200).json({ message: 'Admission updated successfully' });
        }
    );
});

// 删除录取结果
router.delete('/delete/:id', (req, res) => {
    const admission_id = req.params.id;
    const { user_id } = req.body;

    if (!user_id) {
        res.status(400).send('User ID is required');
        return;
    }

    db.query(
        'DELETE FROM admissions WHERE id = ? AND user_id = ?',
        [admission_id, user_id],
        (err, results) => {
            if (err) {
                console.error('Error deleting admission:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send('Admission not found or unauthorized');
                return;
            }

            res.status(200).json({ message: 'Admission deleted successfully' });
        }
    );
});

// 平行志愿录取接口
router.post('/start', async (req, res) => {
    try {
        // 查询志愿信息和相关的用户分数、专业最低分数
        const [applications] = await db.promise().query(`
            SELECT 
                a.user_id,
                a.school_id,
                a.major_id,
                a.priority,
                u.score,
                m.min_score
            FROM applications a
            JOIN users u ON a.user_id = u.id
            JOIN majors m ON a.major_id = m.id
            ORDER BY a.priority ASC, u.score DESC;
        `);

        if (applications.length === 0) {
            return res.status(404).send('No applications found for processing.');
        }

        const admittedUsers = new Set(); // 记录已录取用户ID
        const admissions = []; // 存储录取结果

        // 遍历志愿表进行录取
        for (const application of applications) {
            const {
                user_id,
                school_id,
                major_id,
                score,
                min_score
            } = application;

            // 如果用户已经录取，跳过后续志愿
            if (admittedUsers.has(user_id)) {
                continue;
            }

            // 检查用户分数是否满足专业最低分数线
            if (score >= min_score) {
                // 录取用户
                admissions.push([user_id, school_id, major_id, 1]); // batch 固定为 1
                admittedUsers.add(user_id);
            }
        }

        // 将录取结果插入 admissions 表
        if (admissions.length > 0) {
            await db.promise().query(`
                INSERT INTO admissions (user_id, school_id, major_id, batch)
                VALUES ?
            `, [admissions]);
        }

        res.status(200).json({
            message: 'Admissions process completed successfully',
            admittedUsers: Array.from(admittedUsers)
        });
    } catch (error) {
        console.error('Error processing admissions:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;