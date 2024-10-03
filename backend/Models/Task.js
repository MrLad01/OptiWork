const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task_number: { type: String, required: true, unique: true }, // This will be auto-generated and unique
  task_name: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true }, // Deadline for task completion
  due_time: { type: String, required: true }, // Time of the day when the task is due

  // Task times
  start_time: { type: Date, required: false }, // When the user starts the task
  actual_time: { type: Number, required: true }, // The time expected by admin for task completion (in hours, etc.)
  estimated_time: { type: Number, default: null }, // The time taken by the user to complete the task (in hours)
  
  time_sent_for_approval: { type: Date, required: false }, // When the user submits the task for approval
  approval_time: { type: Date, required: false }, // When the admin approves or declines the task
  restart_time: { type: Date, required: false }, // When the user restarts the task after being declined
  final_completion_time: { type: Date, required: false }, // When the user completes the task after restart

  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  status: { 
    type: String, 
    enum: ['New', 'In-Progress', 'Pending Approval', 'Approved', 'Declined', 'Restarted', 'Completed'], 
    required: true 
  },

  // Assigned user reference
  assigned_user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],

  // Resource details
  resources: {
    type: [{
      material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true }, 
      quantity: { type: Number, required: true }
    }],
    required: true,
    validate: [array => array.length > 0, 'Task must have at least one resource']
  },

  // Optional task resources used
  resources_used: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
