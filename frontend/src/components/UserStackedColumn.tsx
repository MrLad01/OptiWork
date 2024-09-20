import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface Task {
  task_name: string;
  due_date: string;
  status: string;
}

interface User {
  first_name: string;
  last_name: string;
  tasks: Task[];
}

interface UserStackedColumnProps {
  user: User;
  selectedYear: number | undefined;
}

const UserStackedColumn: React.FC<UserStackedColumnProps> = ({ user, selectedYear }) => {
  const { series, categories } = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const statusTypes = ["New", "In-Progress", "Completed", "Pending", "Rejected"];
    
    const monthlyCounts = monthNames.map(() => ({
      New: 0,
      "In-Progress": 0,
      Completed: 0,
      Pending: 0,
      Rejected: 0
    }));

    // Only filter by year if selectedYear is defined
    const filteredTasks = selectedYear
      ? user.tasks.filter(task => new Date(task.due_date).getFullYear() === selectedYear)
      : user.tasks;
    
    filteredTasks.forEach(task => {
      const date = new Date(task.due_date);
      const monthIndex = date.getMonth();
      if (monthlyCounts[monthIndex].hasOwnProperty(task.status)) {
        monthlyCounts[monthIndex][task.status as keyof typeof monthlyCounts[0]]++;
      }
    });

    return {
      series: statusTypes.map(status => ({
        name: status,
        data: monthlyCounts.map(month => month[status as keyof typeof month])
      })),
      categories: monthNames
    };
  }, [user, selectedYear]);  // Include selectedYear in the dependency array

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      }},
    title: {
      text: `Monthly Task Report for ${user.first_name} ${selectedYear ? `(${selectedYear})` : ''}`,
      align: 'left',
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " tasks"
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      type: 'category',
      categories: categories,
    },
    yaxis: {
      title: {
        text: 'Number of Tasks'
      },
    },
    // ... (rest of the options remain the same)
  };

  return (
    <div className="chart-container">
      <ReactApexChart 
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default UserStackedColumn;