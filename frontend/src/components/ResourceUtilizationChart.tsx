import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface Task {
  task_name: string;
  due_date: string;
  status: string;
  due_time: string;
  priority: string;
  completion_date: string;
  resources_used: string;  
  estimated_time: number;
  actual_time: number;
}

interface User {
  first_name: string;
  last_name: string;
  tasks: Task[];
}

interface UtilizationProps {
    user: User;
}

const ResourceUtilizationChart:React.FC<UtilizationProps> = ({ user }) => {
    const chartData = useMemo(() => {
        return user.tasks.map(task => ({
            x: task.task_name,
            y: !isNaN(parseFloat(task.resources_used)) ? parseFloat(task.resources_used) : 0, 
            z: !isNaN(task.actual_time) ? task.actual_time : 0,       
            estimatedTime: !isNaN(task.estimated_time) ? task.estimated_time : 0 
        }));
        }, [user.tasks]);
      
  const options: ApexOptions = {
    chart: {
      height: 200,
      type: 'bubble',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'gradient',
    },
    title: {
      text: 'Resource Utilization by Task'
    },
    xaxis: {
      tickAmount: 2,
      type: 'category',
      labels: {
        show: false
      },
    },
    yaxis: {
      max: 100,
      title: {
        text: 'Resources Used (%)'
      }
    },
    tooltip: {
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        return `
          <div class="p-2">
            <div><b>${data.x}</b></div>
            <div>Resources Used: ${data.y}%</div>
            <div>Actual Time: ${data.z} hours</div>
            <div>Estimated Time: ${data.estimatedTime} hours</div>
          </div>
        `;
      }
    }
  };

  const series = [{
    name: 'Tasks',
    data: chartData
  }];

  return (
    <div className="w-full h-full">
      <ReactApexChart options={options} series={series} type="bubble" height={200} />
    </div>
  );
};

export default ResourceUtilizationChart;