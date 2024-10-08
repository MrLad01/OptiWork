import { Task2 } from "./context/AuthContext";

interface UserTask {
    task_name: string;
    due_date: string;
    due_time: string;
    priority: string;
    status: string;
    completion_date: string;
    resources_used: string;  
    estimated_time: number | null;
    actual_time: number | null;
  }

export const formattedNumber = (number: Number) => {
    if (number == 0){
        return '--';
    }
    
    return number.toString().padStart(2, '0');
}

export const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString); // This is okay if you pass a valid date string
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

 export const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true 
    });
  };

 export const getGreeting = (date: Date) => {
    const hour = date.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

 export const formatDueDate = (date: string) => {
    const [month, day, year] = date.split('/').map(Number);
    const parsedDate = new Date(year, month - 1, day);
    return isNaN(parsedDate.getTime()) ? 'Invalid Date' : parsedDate.toLocaleDateString('en-US');
  };
  

 export const getStatusClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'status-new';
      case 'In-Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  };

  export const percentageToNumber = (percentage: string | number): number => {
    // Ensure percentage is a valid string or number before proceeding
    if (typeof percentage !== 'string' && typeof percentage !== 'number') {
      console.error('Invalid input to percentageToNumber:', percentage);
      return 0; // Return a default value if the input is invalid
    }
  
    // If percentage is a string, trim it and remove the '%' sign
    if (typeof percentage === 'string') {
      const trimmedPercentage = percentage.trim().replace('%', '');
      // Convert the trimmed string to a number
      const numberValue = parseFloat(trimmedPercentage);
      return isNaN(numberValue) ? 0 : numberValue; // Return 0 if NaN
    }
  
    // If percentage is already a number, just return it (ensure it's a valid number)
    return isNaN(percentage) ? 0 : percentage;
  };
  


  export const hourToNumber = (hours: string | number): number => {
    if (typeof hours !== 'string' && typeof hours !== 'number') {
      console.error('Invalid input to hourToNumber:', hours);
      return 0; // Return default value for invalid input
    }
  
    // If hours is a string, clean and convert it
    if (typeof hours === 'string') {
      const cleanedHours = hours.trim();
      const numberValue = parseFloat(cleanedHours);
      return isNaN(numberValue) ? 0 : numberValue; // Ensure valid number
    }
  
    // If hours is already a number, return it directly (ensuring it's valid)
    return isNaN(hours) ? 0 : hours;
  };
  

export function generateRatingFeedback(rating: number): string {
    if (rating < 0 || rating > 100) {
        throw new Error("Rating must be between 0 and 100");
    }

    const feedbackTexts = [
        "Needs significant improvement. Focus on core skills and seek guidance for better results.",
        "Shows potential but requires substantial work. Identify key areas for focused skill development.",
        "Making progress, but consistency is key. Keep working on improving your performance.",
        "Demonstrating good effort. Continue to build on your strengths and address weaknesses.",
        "Solid performance overall. Look for opportunities to excel and stand out further.",
        "Very good work demonstrated. Push yourself to reach even higher levels of achievement.",
        "Excellent job! Your dedication and skill are clearly evident. Keep up the momentum.",
        "Outstanding performance! You're setting a high standard. Maintain this impressive level consistently.",
        "Exceptional work! You're among the top performers. Share your expertise with others.",
        "Phenomenal achievement! You've mastered this area. Consider mentoring others to spread excellence.",
        "Perfect score! Your performance is truly remarkable. You're an inspiration to others."
    ];

    const index = Math.min(Math.floor(rating / 10), 10);
    return feedbackTexts[index];
}

export const calculateTaskCompletionRate = (tasks: UserTask[]) => {
    const completedTasks = tasks.filter(task => task.status === "Completed");
    const totalTasks = tasks.length;
    return ( Math.round(( completedTasks.length / totalTasks ) * 100) );
}
export const calculateTaskCompletionRate2 = (tasks: Task2[]) => {
    const completedTasks = tasks.filter(task => task.status === "Completed");
    const totalTasks = tasks.length;
    return ( Math.round(( completedTasks.length / totalTasks ) * 100) );
}

export const calculateResourceUtilizationRate = (tasks: UserTask[]) => {
    const totalResourcesUsed = tasks.reduce((sum, task) => sum + (percentageToNumber(task.resources_used.length) || 0), 0);
    const totalTasks = tasks.length;
    return ( Math.round( totalResourcesUsed / totalTasks ) );
}
export const calculateResourceUtilizationRate2 = (tasks: Task2[]) => {
    const totalResourcesUsed = tasks.reduce((sum, task) => sum + (percentageToNumber(task.resources_used.length) || 0), 0);
    const totalTasks = tasks.length;
    return ( Math.round( totalResourcesUsed / totalTasks ) );
}

export const calculateTaskEfficiency = (tasks: UserTask[]) => {
  // Filter out tasks where estimated_time is null, undefined, or 0 to avoid invalid calculations
  const validTasks = tasks.filter(
    task => task.status === "Completed" && typeof task.estimated_time === 'number' && task.estimated_time > 0
  );

  if (validTasks.length === 0) {
    console.log("No valid tasks with estimated_time available.");
    return 0;  // Return 0 if there are no valid tasks
  }

  // Calculate efficiency rates only for tasks with valid estimated_time
  const efficiencyRates = validTasks.map(task => {
    const actualTime = typeof task.actual_time === 'number' ? task.actual_time : 0;
    const estimatedTime = typeof task.estimated_time === 'number' ? task.estimated_time : 1; // Avoid division by 0
    return actualTime / actualTime;
  });

  // Sum up the efficiency rates and calculate the average
  const averageEfficiency = efficiencyRates.reduce((sum, rate) => sum + rate, 0);

  // Calculate the final efficiency rate and return it as a percentage
  const taskEfficiency = Math.round((averageEfficiency / efficiencyRates.length) * 100);

  console.log(taskEfficiency);  // Log the calculated efficiency rate

  return taskEfficiency;
};
export const calculateTaskEfficiency2 = (tasks: Task2[]) => {
  // Filter out tasks where estimated_time is null, undefined, or 0 to avoid invalid calculations
  const validTasks = tasks.filter(
    task => task.status === "Completed" && typeof task.estimated_time === 'number' && task.estimated_time > 0
  );

  if (validTasks.length === 0) {
    console.log("No valid tasks with estimated_time available.");
    return 0;  // Return 0 if there are no valid tasks
  }

  // Calculate efficiency rates only for tasks with valid estimated_time
  const efficiencyRates = validTasks.map(task => {
    const actualTime = typeof task.actual_time === 'number' ? task.actual_time : 0;
    const estimatedTime = typeof task.estimated_time === 'number' ? task.estimated_time : 1; // Avoid division by 0
    return actualTime / estimatedTime;
  });

  // Sum up the efficiency rates and calculate the average
  const averageEfficiency = efficiencyRates.reduce((sum, rate) => sum + rate, 0);

  // Calculate the final efficiency rate and return it as a percentage
  const taskEfficiency = Math.round((averageEfficiency / efficiencyRates.length) * 100);

  console.log(taskEfficiency);  // Log the calculated efficiency rate

  return taskEfficiency;
};

export const calculateTaskOverdueRate = (tasks: UserTask[]) => {
    const overdueTasks = tasks.filter(task => new Date(task.completion_date) > new Date(task.due_date));
    const totalTasks = tasks.length;
    return ( Math.round( overdueTasks.length / totalTasks ) * 100 );
}
// export const calculateTaskOverdueRate2 = (tasks: Task2[]) => {
//     const overdueTasks = tasks.filter(task => new Date(task.completion_date) > new Date(task.due_date));
//     const totalTasks = tasks.length;
//     return ( Math.round( overdueTasks.length / totalTasks ) * 100 );
// }
