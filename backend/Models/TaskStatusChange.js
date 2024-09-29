const mongoose = require('mongoose');

const taskStatusChangeSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  old_status: { type: String, required: true },
  new_status: { type: String, required: true },
  changed_at: { type: Date, default: Date.now },
  changed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional: store the user who made the change
}, { timestamps: true });

module.exports = mongoose.model('TaskStatusChange', taskStatusChangeSchema);
