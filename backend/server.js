require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo'); // If using MongoDB for sessions
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173/', // Replace with your frontend URL
  credentials: true // Allow cookies to be sent
}));
app.use(bodyParser.json());
app.use(cookieParser()); // Parse cookies

// Middleware for session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey', // Use a strong secret key in production
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true, // Helps to prevent XSS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
  // ,
  // store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }) // Use MongoDB to store sessions
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

  
const tester = router.get('/test-auth', isAuthenticated, (req, res) => {
  console.log(req.session); // Check the session contents
  res.json({ message: 'You are authenticated!', user: req.session.user });
});
    
app.use('/api/user', user2Routes);
app.use('/api/users', isAuthenticated, userRoutes);
app.use('/api/tasks', isAuthenticated, taskRoutes);
app.use('/api/tasksUpdate', isAuthenticated, taskStatusChange);
app.use('/api/materials', isAuthenticated, materialRoutes);
app.use('/api/', tester);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});