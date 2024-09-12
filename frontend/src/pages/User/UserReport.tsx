import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import axios from 'axios';
import { ArrowCircleDown2, Calendar } from 'iconsax-react';
import { ApexOptions } from 'apexcharts';
import { useAuth } from '../../context/AuthContext';

// Define types for Task and KPI calculations
interface Resource {
  material_name: string;
  quantity: number;
  unit_price: number;
}

interface Task {
  id: { $oid: string };
  task_number: string;
  task_name: string;
  description: string;
  due_date: string;
  due_time: string;
  priority: string;
  status: string;
  assigned_user: { $oid: string };
  resources: Resource[];
  amount: number;
}

const UserReport: React.FC = () => {
  const { user, KPI } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState<any>({});
  
  // Fetch tasks data
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks for the current user
  const usersTasks = tasks.filter(task => task.assigned_user.$oid === user?._id.$oid);

  // Calculate KPIs
  useEffect(() => {
    const calculateKPIs = () => {
      const kpi = {
        totalTasks: usersTasks.length,
        totalAmount: usersTasks.reduce((acc, task) => acc + task.amount, 0),
        taskStatus: {
          New: usersTasks.filter(task => task.status === 'New').length,
          'In-Progress': usersTasks.filter(task => task.status === 'In-Progress').length,
          Completed: usersTasks.filter(task => task.status === 'Completed').length,
          Blocked: usersTasks.filter(task => task.status === 'Blocked').length,
        }
      };

      setKpiData(kpi);
    };

    calculateKPIs();
  }, [tasks, user]);

  // Chart data
  const statusChartOptions: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: Object.keys(kpiData.taskStatus || {}),
    colors: ['#ff4560', '#00e396', '#008ffb', '#feb019'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  // Correctly type statusChartSeries
  const statusChartSeries: ApexNonAxisChartSeries = Object.values(kpiData.taskStatus || []);

  return (
    <div className="w-full h-[89vh] bg-slate-200 rounded-s-2xl px-5 py-4 flex flex-col gap-4">
      <div className="w-full flex justify-between">
        <h2 className="font-semibold">Showing previous data from {new Date().toLocaleDateString()}</h2>
        <div className="flex gap-5 text-sm">
          <button className="px-3 py-1 flex gap-2 border border-black rounded-md font-normal items-center">
            <span>Date - Date</span>
            <div>
              <Calendar size="16" />
            </div>
          </button>
          <button className="px-3 py-1 flex gap-1 items-center border border-black rounded-md font-normal">
            <div>
              <ArrowCircleDown2 size="16" />
            </div>
            <span>Download Reports</span>
          </button>
        </div>
      </div>
      <div className="w-full h-full flex flex-col gap-4">
        <div className="w-full h-[24%] flex gap-4 justify-around">
          <div className="w-full h-full bg-white rounded-md flex items-center justify-center">
            <div className=" flex flex-col gap-2">
              <h3 className="text-xs">Task Completion Rate</h3>
              <p className="text-3xl font-semibold text-center">{KPI?.taskCompletionRate}%</p>
            </div>
          </div>
          <div className="w-full h-full bg-white rounded-md flex items-center justify-center">
            <div className=" flex flex-col gap-2">
              <h3 className="text-xs">Resource Utilization Rate</h3>
              <p className="text-3xl font-semibold text-center">{KPI?.resourceUtilizationRate}%</p>
            </div>
          </div>
          <div className="w-full h-full bg-white rounded-md flex items-center justify-center">
            <div className=" flex flex-col gap-2">
              <h3 className="text-xs">Task Efficiency</h3>
              <p className="text-3xl font-semibold text-center"> { KPI?.taskEfficiency }%</p>
            </div>
          </div>
          <div className="w-full h-full bg-white rounded-md flex items-center justify-center">
            <div className=" flex flex-col gap-2">
              <h3 className="text-xs">Task Overdue Rate</h3>
              <p className="text-3xl font-semibold text-center">{KPI?.taskOverdueRate}%</p>
            </div>
          </div>
        </div>
        <div className="w-full h-full rounded-md flex justify-between">
          <div className="h-full w-[55%] bg-white rounded-md p-4">
            <h3 className="text-lg font-semibold">Task Status Distribution</h3>
            <ApexCharts
              options={statusChartOptions}
              series={statusChartSeries}
              type="donut"
              height={300}
            />
          </div>
          <div className="h-full w-[42%] rounded-md flex flex-col justify-between">
            <div className="h-[48%] w-full bg-white rounded-md p-4">
              {/* Add additional charts or content here if needed */}
              <h3 className="text-lg font-semibold">Additional Chart or Data</h3>
              {/* Example: Another ApexChart component or content */}
            </div>
            <div className="h-[48%] w-full bg-white rounded-md p-4">
              {/* Add additional charts or content here if needed */}
              <h3 className="text-lg font-semibold">Another Chart or Data</h3>
              {/* Example: Another ApexChart component or content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReport;
