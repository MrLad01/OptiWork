const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Task = require('../Models/Task');
const bcryptjs = require('bcryptjs');

// Endpoint to check for admins in each company
router.post('/check-admins', async (req, res) => {
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
      
      // Find the user in the database
      const user = await User.findOne({ username }).populate('tasks');
  
      if (!user) {
        console.log('User not found with username:', username);
        return res.status(400).json({ success: false, message: 'Invalid username' });
      }
  
      const isMatch = await bcryptjs.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
  
      // Format the user session data to match the `User` interface
      req.session.user = {
        _id: { $oid: user._id.toString() },  // ObjectId format
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        password: user.password,  // Be cautious storing password, but if you must, you can encrypt or hash it
        company_name: user.company_name,
        company_email: user.company_email,
        image: user.image,
        role: user.role,
        skill: user.skill,
        notification: user.notification,
        tasks: user.tasks
      };
  
      // Respond with the user object (excluding password)
      const userResponse = { ...req.session.user };
      delete userResponse.password;  // Avoid sending password to the client
  
      res.json({ success: true, user: userResponse });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  router.patch('/make-admin/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Change role to admin
      user.role = 'admin';
  
      // Save updated user
      await user.save();
  
      res.status(200).json({ message: `User ${user.username} is now an admin`, user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

module.exports = router;