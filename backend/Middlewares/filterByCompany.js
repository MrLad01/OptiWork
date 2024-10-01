const User = require('../Models/User'); // Adjust the path based on your project structure

// Middleware to filter users based on company_name
const filterByCompany = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    if (!req.session.user) {
      return res.status(401).json({ message: 'You must be logged in to access this resource.' });
    }

    const { company_name } = req.session.user;

    // Fetch only users belonging to the same company
    const users = await User.find({ company_name });

    // Attach the filtered users to the request object
    req.filteredUsers = users;
    next();
  } catch (error) {
    console.error('Error in filterByCompany middleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = filterByCompany;
