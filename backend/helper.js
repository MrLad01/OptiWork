// Keywords mapped to roles
export const keywordRoleMapping = {
    'build': ['Builder', 'Bricklayer'],
    'building': ['Builder', 'Construction Worker'],
    'plumbing': ['Plumber'],
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
 export const assignUserBasedOnKeywords = async (taskDescription) => {
    const extractedKeywords = extractKeywords(taskDescription);
    let assignedUser = null;
  
    for (const keyword of extractedKeywords) {
      // Get the roles associated with the extracted keyword
      const roles = keywordRoleMapping[keyword];
  
      // Find a user with any of the associated roles
      assignedUser = await User.findOne({ role: { $in: roles } });
  
      if (assignedUser) break;  // Stop once we find an appropriate user
    }
  
    return assignedUser;
  };
  