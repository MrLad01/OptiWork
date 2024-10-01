require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware for session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey', // Use a strong secret key in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // In production, set this to `true` with HTTPS
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));



// Routes
const taskRoutes = require('./Routes/taskRoutes');
const taskStatusChange = require('./Routes/taskStatusChange');
const user2Routes = require('./Routes/freeUserRoute');
const userRoutes = require('./Routes/userRoutes');
const materialRoutes = require('./Routes/materialRoutes');
const { isAuthenticated } = require('./Middlewares/isAuthenticated');
const filterByCompany = require('./Middlewares/filterByCompany');

app.use('/api/tasks', isAuthenticated, filterByCompany, taskRoutes);
app.use('/api/tasksUpdate', isAuthenticated, filterByCompany, taskStatusChange);
app.use('/api/users', isAuthenticated, filterByCompany, userRoutes);
app.use('/api/user', user2Routes);
app.use('/api/materials', isAuthenticated, materialRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});