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
async function assignUsersBasedOnKeywords(taskDescription, companyName) {
  const extractedKeywords = extractKeywords(taskDescription);
  let assignedUsers = [];

  for (const keyword of extractedKeywords) {
      // Get the roles associated with the extracted keyword
      const roles = keywordRoleMapping[keyword];

      // Find users from the company with matching role based on keywords
      const users = await User.find({
          company_name: companyName,
          role: { $in: roles } // Modify as per your keyword matching logic
      });

      // Add found users to the assignedUsers array
      assignedUsers = assignedUsers.concat(users); // Merge arrays
  }

  // Remove duplicates from the assignedUsers array
  assignedUsers = [...new Set(assignedUsers.map(user => user._id.toString()))]
      .map(id => assignedUsers.find(user => user._id.toString() === id));

  return assignedUsers;
};

module.exports = assignUsersBasedOnKeywords;
