const express = require('express');
const router = express.Router();
const Material = require('../Models/Material');
const Task = require('../Models/Task');

// ... (keep existing routes)

// Get tasks associated with a material
router.get('/:id/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ 'resources.material': req.params.id })
      .populate('assigned_user', 'first_name last_name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;