// utils.js

// Function to filter data by company name
const filterByCompany = async (data, companyName) => {
    // Filter the data based on the user IDs
    return data.filter(item => 
        item.company_name === companyName
    );
};

module.exports = filterByCompany;
