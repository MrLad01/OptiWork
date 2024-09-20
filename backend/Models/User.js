const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  company_name: { type: String, required: true },
  company_email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  role: { type: String, required: true },
  skill: [String],
  notification: [{
    from: { type: String, required: true },
    msg: { type: String, required: true },
    date: { type: Date, default: Date.now },
    time: { type: String, required: true }
  }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
}, { timestamps: true });

// Password hashing before saving the user
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
