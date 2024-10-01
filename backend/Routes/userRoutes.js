const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Task = require('../Models/Task');
const bcryptjs = require('bcryptjs');
const filterByCompany = require('../utils/filterByCompany');

// Get all users
router.get('/', async (req, res) => {
  const { company_name } = req.session.user

  try {
    const users = await User.find().select('-password').populate('tasks');

    const filteredUsers = await filterByCompany(users, company_name);
    res.json(filteredUsers); // Send back the filtered users
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific user
router.get('/:id', async (req, res) => {
  const { company_name } = req.session.user
  try {
    const user = await User.findById(req.params.id).select('-password').populate('tasks');
    if (user == null) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(filterByCompany(user, company_name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).json({ success: false, message: 'Failed to log out' });
      }
      res.clearCookie('connect.sid'); // Clear the cookie
      res.json({ success: true, message: 'Logged out successfully' });
  });
});


// Create multiple users with tasks
router.post('/', async (req, res) => {
  try {
    const usersData = req.body;

    const createdUsers = await Promise.all(usersData.map(async (userData) => {
      const {
        first_name,
        last_name,
        username,
        password,
        company_name,
        company_email,
        image,
        role,
        skill,
        notification,
        tasks
      } = userData;

        // Check if any user already exists with the same company_name
        const existingCompanyUsers = await User.findOne({ company_name });

        // Set role to 'admin' if no users exist for this company, otherwise keep the role from userData
        const userRole = existingCompanyUsers ? role : 'admin';
  

      // Create user first
      const user = new User({
        first_name,
        last_name,
        username,
        password,
        company_name,
        company_email,
        image,
        role: userRole,
        skill,
        notification
      });

      const savedUser = await user.save();

      // Create tasks and assign them to the user
      const createdTasks = await Promise.all(tasks.map(async (taskData, index) => {
        // Generate a unique task number
        const task_number = `TASK-${savedUser._id}-${index + 1}`;

        // Create task
        const task = new Task({
          ...taskData,
          task_number,
          assigned_user: savedUser._id,
          description: taskData.description || `Task description for ${taskData.task_name}`,
          resources: [], // We'll need to handle resources separately
          amount: 0 // Set a default amount or calculate based on resources
        });

        const savedTask = await task.save();

        // Add task to user's tasks array
        savedUser.tasks.push(savedTask._id);

        return savedTask;
      }));

      // Save user again with updated tasks array
      await savedUser.save();

      return {
        user: savedUser,
        tasks: createdTasks
      };
    }));

    res.status(201).json({ message: "Users successfully created" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Update a user
router.patch('/:id', async (req, res) => {
  const { company_name } = req.session.user
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(filterByCompany(updatedUser, company_name));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Note: You might want to handle assigned tasks here
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;