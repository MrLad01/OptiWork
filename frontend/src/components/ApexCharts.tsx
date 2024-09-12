import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ChartData {
  series: { data: number[] }[];
  options: ApexOptions;
}

const ApexChart: React.FC<{ tasks: any[] }> = ({ tasks }) => {
  const [chartData, setChartData] = useState<ChartData>({
    series: [{ data: [] }],
    options: {
      chart: {
        type: 'bar',
        height: 160,
        width: '100%',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 3,
          barHeight: '86%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: 'bottom'
          },
        },
      },
      colors: ['#d1e7dd', '#00E396', '#FEB019', '#008FFB', '#FF4560'],
      dataLabels: {
        enabled: true,
        formatter: function(val: number) { return `${val}%`; },
        style: {
          colors: ['#fff']
        }
      },
      xaxis: {
        categories: ['New', 'In-Progress', 'Pending', 'Completed', 'Rejected'],
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: false
        }
      },
    },
  });

  useEffect(() => {
    const totalTasks = tasks.length;
    const taskCounts = {
      new: tasks.filter(task => task.status === 'New').length,
      inProgress: tasks.filter(task => task.status === 'In-Progress').length,
      pending: tasks.filter(task => task.status === 'Pending').length,
      completed: tasks.filter(task => task.status === 'Completed').length,
      rejected: tasks.filter(task => task.status === 'Blocked').length,
    };

    const percentages = Object.values(taskCounts).map(count => 
      Math.round((count / totalTasks) * 100)
    );

    setChartData(prevData => ({
      ...prevData,
      series: [{ data: percentages }],
    }));
  }, [tasks]);

  return (
    <div className="h-full w-full">
      <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={180} />
    </div>
  );
};

export default ApexChart;