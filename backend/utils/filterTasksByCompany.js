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
    

    console.log(tasksWithUsers);
    
        
   return data.filter(
        item => User.findById(item.assigned_user._id).company_name === companyName
    )
   
};

module.exports = filterTasksByCompany;
