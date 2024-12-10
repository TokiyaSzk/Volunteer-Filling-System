const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = require('../db.js');

// 获取所有专业
router.get('/', (req, res) => {
    db.query('SELECT * FROM majors', (err, results) => {
        if (err) {
            console.error('Error fetching majors:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

// 获取特定专业信息
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM majors WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching major:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Major not found');
            return;
        }
        res.json(results[0]);
    });
});

// 添加新专业
router.post('/', (req, res) => {
    const { name, school_id, min_score, max_score,max_admissions } = req.body;

    if (!name || !school_id || min_score === undefined || max_score === undefined) {
        res.status(400).send('Missing required fields');
        return;
    }

    db.query(
        'INSERT INTO majors (name, school_id, min_score, max_score,max_admissions) VALUES (?, ?, ?, ?,?)',
        [name, school_id, min_score, max_score,max_admissions],
        (err, results) => {
            if (err) {
                console.error('Error adding major:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).json({ id: results.insertId, message: 'Major added successfully' });
        }
    );
});

// 删除专业
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM majors WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting major:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('Major not found');
            return;
        }
        res.json({ message: 'Major deleted successfully' });
    });
});

module.exports = router;