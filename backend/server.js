require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));



// Routes
const taskRoutes = require('./Routes/taskRoutes');
const taskStatusChange = require('./Routes/taskStatusChange');
const userRoutes = require('./Routes/userRoutes');
const materialRoutes = require('./Routes/materialRoutes');

app.use('/api/tasks', taskRoutes);
app.use('/api/tasksUpdate', taskStatusChange);
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});