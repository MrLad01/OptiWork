const User = require('../Models/User');


// Middleware to filter tasks based on the logged-in user's company_name
const filterTasksByCompany = async (data, companyName) => {
    // Use Promise.all to handle multiple asynchronous operations concurrently
    const tasksWithUsers = await Promise.all(
        data.map(async (item) => {
            // Find the user by the assigned_user ObjectId
            const user = await User.findById(item.assigned_user);
            return { ...item.toObject(), assigned_user: user }; // Convert mongoose document to plain object
        })
    );
    // Now that we have the full user details, filter based on company name
    const filteredTasks = tasksWithUsers.filter((item) => item.assigned_user?.company_name === companyName);

    // console.log(`Filtered Tasks: ${JSON.stringify(filteredTasks)}`); // Log filtered tasks for debugging
    return filteredTasks;
};

module.exports = filterTasksByCompany;
