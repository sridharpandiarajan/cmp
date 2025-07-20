const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// CREATE (POST) a new worker
router.post('/', async (req, res) => {
  try {
    const newWorker = new Worker(req.body);
    await newWorker.save();
    res.status(201).json(newWorker);
  } catch (error) {
    console.error('Error saving worker:', error);
    res.status(500).json({ message: 'Error saving worker', error });
  }
});

// GET all workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find();
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workers' });
  }
});

// GET one worker by ID
router.get('/find/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.status(200).json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching worker' });
  }
});

// UPDATE a worker
router.put('/:id', async (req, res) => {
  try {
    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedWorker);
  } catch (error) {
    res.status(500).json({ message: 'Error updating worker' });
  }
});

// DELETE a worker
router.delete('/:id', async (req, res) => {
  try {
    await Worker.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Worker deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting worker' });
  }
});

module.exports = router;
