const mongoose = require('mongoose');

const projectTargetSchema = new mongoose.Schema({
  target_name: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  description: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]  // Reference to tasks
}, { timestamps: true });

module.exports = mongoose.model('ProjectTarget', projectTargetSchema);
