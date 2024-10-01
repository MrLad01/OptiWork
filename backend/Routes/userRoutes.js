const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Task = require('../Models/Task');
const bcryptjs = require('bcryptjs');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('tasks');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('tasks');
    if (user == null) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint to check for admins in each company
router.get('/check-admins', async (req, res) => {
  try {
    // Aggregate users by company_name and check for admins
    const companies = await User.aggregate([
      {
        $group: {
          _id: '$company_name',
          admins: { $push: { $cond: [{ $eq: ['$role', 'Admin'] }, '$username', null] } }
        }
      }
    ]);

    // Filter out companies without admins
    const companiesWithoutAdmins = companies.filter(company => 
      !company.admins.some(admin => admin !== null)
    );

    if (companiesWithoutAdmins.length > 0) {
      return res.status(200).json({
        message: 'The following companies do not have an admin:',
        companies: companiesWithoutAdmins.map(company => company._id)
      });
    } else {
      return res.status(200).json({
        message: 'All companies have at least one admin.'
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while checking for admins.' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
      const { username, password } = req.body;
    
      // Check if the user exists in the database
      const user = await User.findOne({ username }).populate('tasks');

      if (!user) {
        console.log('User not found with username:', username);
        return res.status(400).json({ success: false, message: 'Invalid username' });
      }

      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      // Don't send the password back to the client
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({ success: true, user: userResponse });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
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

      // Create user first
      const user = new User({
        first_name,
        last_name,
        username,
        password,
        company_name,
        company_email,
        image,
        role,
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
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updatedUser);
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