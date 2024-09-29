const express = require('express');
const router = express.Router();
const TaskStatusChange = require('../Models/TaskStatusChange');

// Get status changes for a specific task
router.get('/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const statusChanges = await TaskStatusChange.find({ task: taskId })
      .populate('changed_by', 'first_name last_name') // Populate user details if needed
      .sort({ createdAt: -1 }); // Sort by most recent changes

    if (!statusChanges.length) {
      return res.status(404).json({ message: 'No status changes found for this task.' });
    }

    res.json(statusChanges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all status changes
router.get('/', async (req, res) => {
  try {
    const statusChanges = await TaskStatusChange.find()
      .populate('changed_by', 'first_name last_name') // Populate user details if needed
      .sort({ createdAt: -1 }); // Sort by most recent changes

    res.json(statusChanges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
