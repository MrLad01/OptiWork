const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      // The session object is in the format of the `User` interface
      next();
    } else {
      res.status(401).json({ message: 'You must be logged in to access this resource' });
    }
  };

  module.exports = { isAuthenticated }