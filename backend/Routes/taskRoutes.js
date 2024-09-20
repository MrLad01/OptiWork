const express = require('express');
const router = express.Router();
const Task = require('../Models/Task');
const User = require('../Models/User');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assigned_user', 'first_name last_name')
      .populate('resources.material');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assigned_user', 'first_name last_name')
      .populate('resources.material');
    if (task == null) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  const task = new Task(req.body);
  try {
    const newTask = await task.save();
    // Update the assigned user's tasks array
    if (newTask.assigned_user) {
      await User.findByIdAndUpdate(newTask.assigned_user, 
        { $push: { tasks: newTask._id } }
      );
    }
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task.assigned_user !== req.body.assigned_user) {
      // Remove task from old user's tasks array
      if (task.assigned_user) {
        await User.findByIdAndUpdate(task.assigned_user, 
          { $pull: { tasks: task._id } }
        );
      }
      // Add task to new user's tasks array
      if (req.body.assigned_user) {
        await User.findByIdAndUpdate(req.body.assigned_user, 
          { $push: { tasks: task._id } }
        );
      }
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task.assigned_user) {
      await User.findByIdAndUpdate(task.assigned_user, 
        { $pull: { tasks: task._id } }
      );
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;