const User = require('./Models/User');  // Adjust the path as necessary

// Keywords mapped to roles
const keywordRoleMapping = {
    'build': ['Builder', 'Bricklayer'],
    'building': ['Builder', 'Construction Worker', 'Construction Expeditor'],
    'plumbing': ['Plumber', 'Subcontractor'],
    'design': ['Architect', 'Designer'],
    'supervising': ['Project Manager'],
    'assembly': ['Estimator'],
    'sewing': ['Project Manager'],
    'cutting': ['Engineer', 'Project Manager'],
    'drafting': ['Engineer', 'Project Manager'],
    'attaching branding': ['Project Manager'],
    // Add more mappings as needed
  };
  
  // Function to extract keywords from the task description
  const extractKeywords = (taskDescription) => {
    const keywords = Object.keys(keywordRoleMapping);
    const extractedKeywords = [];
  
    for (const keyword of keywords) {
      if (taskDescription.toLowerCase().includes(keyword)) {
        extractedKeywords.push(keyword);
      }
    }
  
    return extractedKeywords;
  };
  
  // Function to assign users based on extracted keywords
async function assignUserBasedOnKeywords(taskDescription, companyName) {
    const extractedKeywords = extractKeywords(taskDescription);
    let assignedUser = null;
  
    for (const keyword of extractedKeywords) {
      // Get the roles associated with the extracted keyword
      const roles = keywordRoleMapping[keyword];
  
       // Find a user from the company with matching role based on keywords
      const user = await User.findOne({
        company_name: companyName,
        role: { $in: roles } // Modify as per your keyword matching logic
      });
  
      if (assignedUser) break;  // Stop once we find an appropriate user
    }
  
    return assignedUser;
  };
  
module.exports = assignUserBasedOnKeywords;