import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import { Task2, useAuth } from '../../../context/AuthContext';
import { calculateTaskCompletionRate2, calculateResourceUtilizationRate2, calculateTaskEfficiency2 } from '../../../helper';

export const MonthlyBreakdown = () => {
  const [allTasks, setAllTasks] = useState<Task2[]>([]);
  const { Projects } = useAuth();

  useEffect(() => {
    // Fetch all tasks from projects
    const tasks = Projects && Projects.flatMap(target => target.tasks);
    setAllTasks(tasks || []);
  }, [Projects]);

  // Metrics
  const taskCompletionRate = calculateTaskCompletionRate2(allTasks);
  const resourceUtilizationRate = calculateResourceUtilizationRate2(allTasks);
  const taskEfficiency = calculateTaskEfficiency2(allTasks);

  // Data for the charts
  const completionRateChart = {
    series: [taskCompletionRate],
    options: {
      chart: {
        type: 'radialBar' as const,  // Ensure it's a specific type
      },
      labels: ['Task Completion Rate'],
    },
  };

  const resourceUtilizationChart = {
    series: [resourceUtilizationRate],
    options: {
      chart: {
        type: 'radialBar' as const,  // Ensure it's a specific type
      },
      labels: ['Resource Utilization Rate'],
    },
  };

  const taskEfficiencyChart = {
    series: [taskEfficiency],
    options: {
      chart: {
        type: 'radialBar' as const,  // Ensure it's a specific type
      },
      labels: ['Task Efficiency'],
    },
  };

  return (
    <div className="w-full h-full p-3 bg-white rounded-md">
      <h1 className="text-base font-semibold">Project Performance Overview</h1>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <h3>Task Completion Rate</h3>
          <ApexCharts options={completionRateChart.options} series={completionRateChart.series} type="radialBar" height={350} />
        </div>
        
        <div>
          <h3>Resource Utilization Rate</h3>
          <ApexCharts options={resourceUtilizationChart.options} series={resourceUtilizationChart.series} type="radialBar" height={350} />
        </div>
        
        <div>
          <h3>Task Efficiency</h3>
          <ApexCharts options={taskEfficiencyChart.options} series={taskEfficiencyChart.series} type="radialBar" height={350} />
        </div>
      </div>
    </div>
  );
};
