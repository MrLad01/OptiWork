const User = require('../Models/User');


// Middleware to filter tasks based on the logged-in user's company_name
const filterTasksByCompany = async (data, companyName) => {

    // Use Promise.all to handle multiple asynchronous operations concurrently
    const tasksWithUsers = await Promise.all(
        data.map(async item => {
            // Find the user by the assigned_user ObjectId
            const user = await User.findById(item.assigned_user);
            return { ...item, assigned_user: user };
        })
    );

    
        tasksWithUsers.forEach(task => {
            console.log(task._doc); // Logs the core document without Mongoose metadata
            console.log(task.assigned_user); // Logs the assigned user's details
        });
        

     // Now that we have the full user details, filter based on company name
     return tasksWithUsers.filter(item => item.assigned_user?.company_name === companyName);
   
};

module.exports = filterTasksByCompany;
