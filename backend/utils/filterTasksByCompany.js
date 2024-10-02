const User = require('../Models/User');


// Middleware to filter tasks based on the logged-in user's company_name
const filterTasksByCompany = async (data, companyName) => {
    console.log(data);
    console.log(companyName);
    
    
   return data.filter(
        item => User.findById(item.assigned_user).company_name === companyName
    )
   
};

module.exports = filterTasksByCompany;
