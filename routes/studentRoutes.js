const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Create
router.post('/', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Read All
router.get('/', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Read by ID
router.get('/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Not found' });
    res.json(student);
});

// Update
router.put('/:id', async (req, res) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Not found' });
    res.json(student);
});

// Delete
router.delete('/:id', async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
});

module.exports = router;
