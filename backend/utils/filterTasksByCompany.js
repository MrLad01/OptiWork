const User = require('../Models/User');


// Middleware to filter tasks based on the logged-in user's company_name
const filterTasksByCompany = async (data, companyName) => {

    const mappedUsers = data.map(item => User.findById(item.assigned_user._id).company_name)

    console.log(mappedUsers);
    
        
   return data.filter(
        item => User.findById(item.assigned_user._id).company_name === companyName
    )
   
};

module.exports = filterTasksByCompany;
