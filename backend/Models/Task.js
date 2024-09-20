const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task_number: { type: String, required: true, unique: true },
  task_name: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, required: true },
  due_time: { type: String, required: true },
  actual_time: { type: String, required: true },
  estimated_time: { type: String, required: true },  // Fixed typo here
  resources_used: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  status: { type: String, enum: ['New', 'In-Progress', 'Pending', 'Completed', 'Rejected'], required: true },
  assigned_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resources: [{
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
    quantity: { type: Number, required: true }
  }],
  amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
