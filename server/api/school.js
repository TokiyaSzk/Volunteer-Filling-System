const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const db = require('../db.js');

// 添加学校
router.post('/add', (req, res) => {
    const { name, province, ranking, category } = req.body;

    db.query(
        'INSERT INTO schools (name, province, ranking, category) VALUES (?, ?, ?, ?)',
        [name, province, ranking, category],
        (err, results) => {
            if (err) {
                console.error('Error adding school:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).send('School added successfully');
        }
    );
});

// 获取所有学校
router.get('/', (req, res) => {
    db.query('SELECT * FROM schools', (err, results) => {
        if (err) {
            console.error('Error fetching schools:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

// 获取单个学校信息
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM schools WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching school:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('School not found');
            return;
        }

        res.json(results[0]);
    });
});

// 更新学校信息
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, province, ranking, category } = req.body;

    db.query(
        'UPDATE schools SET name = ?, province = ?, ranking = ?, category = ? WHERE id = ?',
        [name, province, ranking, category, id],
        (err, results) => {
            if (err) {
                console.error('Error updating school:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send('School not found');
                return;
            }

            res.send('School updated successfully');
        }
    );
});

// 删除学校
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM schools WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting school:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send('School not found');
            return;
        }

        res.send('School deleted successfully');
    });
});

module.exports = router;