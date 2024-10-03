const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Task = require('../Models/Task');
const User = require('../Models/User');
const ProjectTarget = require('../Models/ProjectTarget');
const Counter = require('../Models/Counter');
const TaskStatusChange = require('../Models/TaskStatusChange');
const filterTasksByCompany = require('../utils/filterTasksByCompany');
const assignUsersBasedOnKeywords = require('../helper')


// Function to log task status changes
const logStatusChange = async (task, oldStatus, newStatus, changedBy) => {
  try {
    await TaskStatusChange.create({
      task: task._id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: changedBy,  // User who triggered the status change
    });
  } catch (error) {
    console.error('Error logging task status change:', error.message);
  }
};



// Helper function to convert $oid to ObjectId
const convertOidToObjectId = (user) => {
  if (typeof user === 'object' && user.$oid) {
    return new mongoose.Types.ObjectId(user.$oid); // Convert $oid to ObjectId
  }
  return new mongoose.Types.ObjectId(user); // In case it's already a string
};


// Function to get the next task number from the Counter and ensure it's 6 digits
const getNextTaskNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'task_number' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // Create if it doesn't exist
  );

  // Pad the task number with leading zeros to make it 6 digits
  const paddedTaskNumber = String(counter.seq).padStart(6, '0');
  
  return `TASK-${paddedTaskNumber}`;
};

// Middleware to find a single task by ID and verify company
const getTaskByIdAndCompany = async (taskId, companyName) => {
  // Find the task by its ID and populate necessary fields
  const task = await Task.findById(taskId)
    .populate('assigned_user', 'first_name last_name company_name')  // Populate with company_name
    .populate('resources.material');

  // Check if the task exists and if it belongs to the correct company
  if (task && task.assigned_user?.company_name === companyName) {
    return task; // Task belongs to the correct company
  }

  return null; // Either task not found or doesn't belong to the company
  };


// Get all tasks
router.get('/', async (req, res) => {
  const {company_name} = req.session.user
  if (!company_name) {
    return res.status(400).json({ message: 'Company name not found in session.' });
  }

  try {
    const tasks = await Task.find()
      .populate('assigned_user', 'first_name last_name')
      .populate('resources.material');

    // Ensure we await the result of the filtering function
    const filteredTasks = await filterTasksByCompany(tasks, company_name);
    
    res.json({ tasks: filteredTasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get a single task by ID
router.get('/:id', async (req, res) => {
  const { company_name } = req.session.user; // Logged-in user's company_name
  const { id } = req.params; // Task ID from the request parameters

  try {
    // Call the function to get the task and validate company
    const task = await getTaskByIdAndCompany(id, company_name);

    if (task) {
      res.json({ task });
    } else {
      res.status(404).json({ message: 'Task not found or does not belong to your company' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware to create tasks only for users in the same company as the logged-in user
router.post('/', async (req, res) => {
  const { company_name } = req.session.user; // Get logged-in user's company name

  try {
    const tasksData = req.body;

    // Store created tasks and errors separately
    const createdTasks = [];
    const taskErrors = [];

    // Loop through each task in the request body (supporting multiple tasks)
    await Promise.all(tasksData.map(async (taskData) => {
      try {
        // Handle multiple or single assigned users with OID conversion
        let assignedUsers = [];
        if (Array.isArray(taskData.assigned_user)) {
          assignedUsers = taskData.assigned_user.map(user => convertOidToObjectId(user));
        } else {
          assignedUsers = [convertOidToObjectId(taskData.assigned_user)];
        }

        // Validate that all assigned users exist and are from the same company
        const existingUsers = await User.find({ _id: { $in: assignedUsers }, company_name: company_name });
        if (existingUsers.length !== assignedUsers.length) {
          taskErrors.push({
            message: `Assigned user(s) not found or not in your company for task: ${taskData.task_name}`,
            error: 'Invalid or unauthorized user ID(s) provided'
          });
          return; // Skip this task
        }

        // Validate that all resources (materials) exist in the Material database
        const materialIds = taskData.resources.map(resource => resource._id); // Extract material IDs from resources
        const materials = await Material.find({ _id: { $in: materialIds } });

        if (materials.length !== materialIds.length) {
          taskErrors.push({
            message: `Some materials for task ${taskData.task_name} do not exist in the Material database.`,
          });
          return; // Skip this task creation
        }

        // Automatically generate a task number
        const taskNumber = await getNextTaskNumber();
        taskData.task_number = taskNumber;
        taskData.status = 'New';  // Default status to 'New'

        // Check if a task with the same task_number already exists
        const existingTask = await Task.findOne({ task_number: taskData.task_number });
        if (existingTask) {
          taskErrors.push({
            message: `Task with task_number ${taskData.task_number} already exists, skipping.`,
          });
          return; // Skip to the next task
        }

        // Create and save the task
        const task = new Task(taskData);
        const newTask = await task.save();

        // Update assigned users' task arrays
        if (newTask.assigned_user) {
          await User.updateMany(
            { _id: { $in: newTask.assigned_user } },
            { $push: { tasks: newTask._id } }
          );
        }

        // Add the successfully created task to the array
        createdTasks.push(newTask);
      } catch (taskError) {
        if (taskError.code === 11000) {
          taskErrors.push({
            message: `Task with task_number ${taskData.task_number} already exists, skipping.`,
          });
        } else {
          taskErrors.push({
            message: `Error creating task: ${taskData.task_name}`,
            error: taskError.message,
          });
        }
      }
    }));

    // Check if any errors occurred during task creation
    if (taskErrors.length > 0) {
      return res.status(400).json({
        message: "Error creating one or more tasks",
        errors: taskErrors,
        createdTasks
      });
    }

    // If all tasks are created successfully, return a success response
    res.status(201).json({
      message: "Tasks successfully created",
      createdTasks
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a task
router.patch('/:id', async (req, res) => {
  const { company_name } = req.session.user; // Get the logged-in user's company name

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Record the old status before updating
    const oldStatus = task.status;

    // Handle assigned user change only if it has changed
    if (task.assigned_user.toString() !== req.body.assigned_user) {
      const newAssignedUserId = req.body.assigned_user;

      // Validate if the new assigned user exists and belongs to the same company
      const assignedUser = await User.findOne({ _id: newAssignedUserId, company_name: company_name });
      if (!assignedUser) {
        return res.status(400).json({ message: 'Assigned user not found or not in your company' });
      }

      // Remove task from the old user's tasks array
      if (task.assigned_user) {
        await User.findByIdAndUpdate(task.assigned_user, { $pull: { tasks: task._id } });
      }

      // Add task to the new user's tasks array
      await User.findByIdAndUpdate(newAssignedUserId, { $push: { tasks: task._id } });
    }

    // Update the task with the new data (other fields like status, description, etc.)
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Record the status change if the status has changed
    if (oldStatus !== updatedTask.status) {
      const statusChange = new TaskStatusChange({
        task: updatedTask._id,
        old_status: oldStatus,
        new_status: updatedTask.status,
        changed_by: req.user._id // Assuming req.user contains the logged-in user's details
      });
      await statusChange.save();
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start a task (automatically set status to 'In-Progress')
router.patch('/:id/start', async (req, res) => {
  const { company_name } = req.session.user; // Get the logged-in user's company name

  try {
    const task = await Task.findById(req.params.id)
      .populate('assigned_user'); // Populating assigned_user for further validation

    // Check if the task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure task status is 'New'
    if (task.status !== 'New') {
      return res.status(400).json({ message: 'Task cannot be started in its current status', status: task.status });
    }

    // Ensure the logged-in user belongs to the same company as the task's assigned user
    if (!task.assigned_user || task.assigned_user.company_name !== company_name) {
      return res.status(403).json({ message: 'You are not authorized to start this task' });
    }

    // Log the old status and change the status to 'In-Progress'
    const oldStatus = task.status;
    task.status = 'In-Progress';
    task.start_time = Date.now();
    await task.save();

    // Log the status change, assuming req.user._id exists for logging
    if (task.assigned_user && task.assigned_user._id) {
      await logStatusChange(task, oldStatus, 'In-Progress', task.assigned_user._id);
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: 'Error starting task',
      error: error.message
    });
  }
});



// Submit task for approval (automatically set status to 'Pending Approval')
router.patch('/:id/submit', async (req, res) => {
  const { resources_used } = req.body;
  const { company_name } = req.session.user; // Get the logged-in user's company name

  try {
    const task = await Task.findById(req.params.id)
      .populate('assigned_user'); // Populate assigned_user for company-level validation

    // Check if the task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure task is either 'In-Progress' or 'Restarted'
    if (task.status !== 'In-Progress' && task.status !== 'Restarted') {
      return res.status(400).json({ message: 'Task must be In-Progress or Restarted to submit for approval', status: task.status });
    }

    // Ensure the logged-in user belongs to the same company as the task's assigned user
    if (!task.assigned_user || task.assigned_user.company_name !== company_name) {
      return res.status(403).json({ message: 'You are not authorized to submit this task for approval' });
    }

    // Check if the user has provided resources used
    if (!resources_used || !resources_used.length) {
      return res.status(400).json({ message: 'You must provide the resources used before submitting for approval' });
    }

    // Update resources used in the task
    task.resources_used = resources_used;

    // Log old status and change to 'Pending Approval'
    const oldStatus = task.status;
    task.status = 'Pending Approval';
    task.time_sent_for_approval = Date.now();
    await task.save();

    // Log the status change, assuming task.assigned_user._id exists for logging
    if (task.assigned_user && task.assigned_user._id) {
      await logStatusChange(task, oldStatus, 'Pending Approval', task.assigned_user._id);
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: 'Error submitting task for approval',
      error: error.message
    });
  }
});


// Approve or Decline a task (admin only)
router.patch('/:id/approval', async (req, res) => {
  const { approval } = req.body; // 'approve' or 'decline'
  const { role } = req.session.user;

  // Check if the user is an admin
  if (role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  try {
    const task = await Task.findById(req.params.id);
    
    // Check if the task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure task status is 'Pending Approval'
    if (task.status !== 'Pending Approval') {
      return res.status(400).json({ message: 'Task must be pending approval to approve/decline', status: task.status });
    }

    // Log old status and change based on approval
    const oldStatus = task.status;

    if (approval === 'approve') {
      task.status = 'Approved';
      task.approval_time = Date.now();
    } else if (approval === 'decline') {
      task.status = 'Declined';
      task.decline_time = Date.now();
    } else {
      return res.status(400).json({ message: 'Invalid approval action' });
    }

    await task.save();

    // Ensure req.user._id exists for logging
    if (task.assigned_user && task.assigned_user._id) {
      await logStatusChange(task, oldStatus, task.status, task.assigned_user._id);
    } else {
      console.warn("User ID not found for logging the status change");
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating task approval status',
      error: error.message
    });
  }
});


// Restart task (if declined)
router.patch('/:id/restart', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    // Check if the task exists
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure task status is 'Declined'
    if (task.status !== 'Declined') {
      return res.status(400).json({ message: 'Task must be declined to restart', status: task.status });
    }

    // Log old status and change to 'Restarted'
    const oldStatus = task.status;
    task.status = 'Restarted';
    task.restart_time = Date.now();
    await task.save();

    // Ensure req.user._id exists for logging
    if (task.assigned_user && task.assigned_user._id) {
      await logStatusChange(task, oldStatus, 'Restarted', task.assigned_user._id);
    } else {
      console.warn("User ID not found for logging the status change");
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: 'Error restarting task',
      error: error.message
    });
  }
});



// Complete task
router.patch('/:id/complete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure task status is 'Approved'
    if (task.status !== 'Approved') {
      return res.status(400).json({ message: 'Task must be approved to complete', status: task.status });
    }

    // Calculate percentage of resources used
    const totalResources = task.resources.reduce((sum, resource) => sum + resource.quantity, 0);
    const usedResources = task.resources_used.reduce((sum, resource) => sum + resource.quantity, 0);
    
    let resourceUsagePercentage = 0;
    if (totalResources > 0) {
      resourceUsagePercentage = (usedResources / totalResources) * 100;
    }

    // Log old status and change to 'Completed'
    const oldStatus = task.status;
    task.status = 'Completed';
    task.final_completion_time = Date.now();
    await task.save();

    // Log the status change
    if (task.assigned_user && task.assigned_user._id) {
      await logStatusChange(task, oldStatus, 'Completed', task.assigned_user._id);
    } else {
      console.warn("User ID not found for logging the status change");
    }

    // Return the task and the resource usage percentage
    res.json({
      task,
      resourceUsagePercentage: `${resourceUsagePercentage.toFixed(2)}%`
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error completing task',
      error: error.message
    });
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


// Endpoint to create a new project target with tasks
router.post('/createProjectWithTasks', async (req, res) => {
  const { company_name, _id } = req.session.user;

  try {
    const { target_name, start_date, end_date, description, tasks } = req.body;

    // Create the project target
    const projectTarget = new ProjectTarget({
      target_name,
      start_date,
      end_date,
      description,
      company_name,   // Add company_name from the session
      created_by: _id.$oid // Add the user ID of the creator from session
    });

    const createdTasks = [];
    const taskErrors = [];

    // Loop through each task, assign users, and create tasks
    for (const taskData of tasks) {
      try {
        // Automatically generate a task number
        const taskNumber = await getNextTaskNumber();
        taskData.task_number = taskNumber;
        taskData.status = 'New';  // Default status to 'New'

        // Assign users based on keywords in the task description
        const assignedUsers = await assignUsersBasedOnKeywords(taskData.description, company_name);
        if (!assignedUsers.length) {
          taskErrors.push({
            message: `No users found for task: ${taskData.task_name}`,
            error: 'No suitable user role found for this task'
          });
          continue;  // Skip this task if no users found
        }

        // Store the IDs of assigned users
        taskData.assigned_user = assignedUsers.map(user => user._id);  // Assign all users to the task

        // Create the task
        const task = new Task(taskData);
        const newTask = await task.save();

        // Add the task to the project target
        projectTarget.tasks.push(newTask._id);

        // Update each assigned user's task array
        for (const user of assignedUsers) {
          await User.findByIdAndUpdate(user._id, { $push: { tasks: newTask._id } });
        }

        createdTasks.push(newTask);  // Add the created task to the array
      } catch (taskError) {
        taskErrors.push({
          message: `Error creating task: ${taskData.task_name}`,
          error: taskError.message,
        });
      }
    }

    // Save the project target after tasks are created
    await projectTarget.save();

    if (taskErrors.length > 0) {
      return res.status(400).json({
        message: "Error creating one or more tasks",
        errors: taskErrors,
        createdTasks
      });
    }

    // Success response with the project target and created tasks
    res.status(201).json({
      message: "Project target and tasks successfully created",
      projectTarget,
      createdTasks
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Endpoint to get the latest project target for a specific company
router.post('/latestProjectTarget', async (req, res) => {
  const { company_name } = req.session.user; // Assuming session has company_name
  
  try {
    // Find the latest project target for the user's company and populate associated tasks and assigned users
    const latestProject = await ProjectTarget.findOne({ company_name })
      .sort({ createdAt: -1 })  // Sort by creation date, latest first
      .populate({
        path: 'tasks',
        populate: { path: 'assigned_user', select: 'first_name last_name username role' } // Populating assigned user details in tasks
      })
      .exec();

    if (!latestProject) {
      return res.status(404).json({ message: "No project target found for the company" });
    }

    res.status(200).json({
      message: "Latest project target retrieved successfully",
      latestProject
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Endpoint to close a project target
router.patch('/closeProjectTarget/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    // Find the project target by ID
    const projectTarget = await ProjectTarget.findById(projectId);

    if (!projectTarget) {
      return res.status(404).json({ message: "Project target not found" });
    }

    // Update project target to mark it as closed (you can add other status fields if needed)
    projectTarget.isClosed = true;  // Assuming a field called 'isClosed' or modify based on your schema
    projectTarget.end_date = new Date(); // Set the end date to the current date when closing
    await projectTarget.save();

    res.status(200).json({ message: "Project target closed successfully", projectTarget });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Endpoint to get all project targets for a company
router.post('/getProjectTargets', async (req, res) => {
  const { company_name } = req.session.user;  // Assuming session stores the user's company_name

  try {
    // Find all project targets that match the company_name
    const projectTargets = await ProjectTarget.find({ company_name }).populate('tasks').populate('created_by');

    // If no project targets are found, return a 404
    if (!projectTargets || projectTargets.length === 0) {
      return res.status(404).json({ message: "No project targets found for this company" });
    }

    // Return the found project targets
    res.status(200).json({
      message: "Project targets retrieved successfully",
      projectTargets
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});






module.exports = router;