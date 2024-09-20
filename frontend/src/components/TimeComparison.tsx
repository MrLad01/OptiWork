import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface Task {
  task_name: string;
  estimated_time: string;
  actual_time: string;
}

interface User {
  first_name: string;
  last_name: string;
  tasks: Task[];
}

interface ChartData {
  estimatedTime: number[];
  actualTime: number[];
  taskNames: string[];
}

interface ComparisonProps {
    user: User
}

const TimeComparisonChart: React.FC<ComparisonProps> = ({ user }) => {
  const [chartData, setChartData] = useState<ChartData>({
    estimatedTime: [],
    actualTime: [],
    taskNames: [],
  });

  useEffect(() => {
    if (user && user.tasks) {
      const processedData: ChartData = {
        estimatedTime: [],
        actualTime: [],
        taskNames: [],
      };

      user.tasks.forEach((task) => {
        const estimatedHours = parseFloat(task.estimated_time.split(' ')[0]);
        const actualHours = parseFloat(task.actual_time.split(' ')[0]);

        processedData.estimatedTime.push(estimatedHours);
        processedData.actualTime.push(actualHours);
        processedData.taskNames.push(task.task_name);
      });

      setChartData(processedData);
    }
  }, [user]);

  const options: ApexOptions = {
    chart: {
      height: 180,
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'category',
      categories: chartData.taskNames,
      labels: {
        show: false
      },
    },
    yaxis: {
      title: {
        text: 'Time (hours)'
      }
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toFixed(2) + " hours";
        }
      }
    },
    title: {
      text: `Time Comparison for ${user?.first_name}`,
      align: 'left'
    }
  };

  const series = [
    {
      name: 'Estimated Time',
      data: chartData.estimatedTime,
    },
    {
      name: 'Actual Time',
      data: chartData.actualTime,
    },
  ];

  if (!user) {
    return <div>Please log in to view your task time comparison.</div>;
  }

  return (
    <div className="w-full -mb-20">
      <ReactApexChart options={options} series={series} type="area" height={180} />
    </div>
  );
};

export default TimeComparisonChart;