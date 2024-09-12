interface UserTask {
    task_name: string;
    due_date: string;
    due_time: string;
    priority: string;
    status: string;
    completion_date: string;
    resources_used: string;  
    estimated_time: string;
    actual_time: string;
  }

export const formattedNumber = (number: Number) => {
    if (number == 0){
        return '--';
    }
    
    return number.toString().padStart(2, '0');
}

export const formatDate = (date: Date) => {
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

function percentageToNumber(percentageString: string): number {
    // Remove any whitespace and the '%' symbol if present
    const cleanedString = percentageString.trim().replace('%', '');
    
    // Parse the string to a float
    const number = parseFloat(cleanedString);
    
    // Check if the result is a valid number
    if (isNaN(number)) {
        throw new Error('Invalid percentage string');
    }
    
    // Convert percentage to decimal (e.g., 50% becomes 0.5)
    return number;
}

function hourToNumber(percentageString: string): number {
    // Remove any whitespace and the '%' symbol if present
    const cleanedString = percentageString.trim().replace('hours', '');
    
    // Parse the string to a float
    const number = parseFloat(cleanedString);
    
    // Check if the result is a valid number
    if (isNaN(number)) {
        throw new Error('Invalid percentage string');
    }
    
    // Convert percentage to decimal (e.g., 50% becomes 0.5)
    return number;
}

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

export const calculateResourceUtilizationRate = (tasks: UserTask[]) => {
    const totalResourcesUsed = tasks.reduce((sum, task) => sum + (percentageToNumber(task.resources_used) || 0), 0);
    const totalTasks = tasks.length;
    return ( Math.round( totalResourcesUsed / totalTasks ) );
}

export const calculateTaskEfficiency = (tasks: UserTask[]) => {
    const efficiencyRates = tasks.filter(task => task.status === "Completed").map(task => hourToNumber(task.actual_time) / hourToNumber(task.estimated_time));
    const averageEfficiency = efficiencyRates.reduce((sum, rate) => (sum + rate) , 0);
    console.log(averageEfficiency / efficiencyRates.length );
    return ( Math.round( (averageEfficiency / efficiencyRates.length ) * 100 ) );
}

export const calculateTaskOverdueRate = (tasks: UserTask[]) => {
    const overdueTasks = tasks.filter(task => new Date(task.completion_date) > new Date(task.due_date));
    const totalTasks = tasks.length;
    return ( Math.round( overdueTasks.length / totalTasks ) * 100 );
}
