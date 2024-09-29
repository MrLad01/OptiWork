const mongoose = require('mongoose');

// Counter schema for generating task numbers
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the counter (e.g., 'task_number')
  seq: { type: Number, default: 0 }, // The sequence number
});

// Export Counter model
const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
