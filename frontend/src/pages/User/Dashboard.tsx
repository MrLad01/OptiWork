import { ArrangeHorizontalCircle, Chart, Layer, Task, TickCircle } from "iconsax-react";
import { useEffect, useState } from "react";
// import axios from "axios";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { useAuth, UserTask } from "../../context/AuthContext";
import { formatDate, formatDueDate, formattedNumber, formatTime, generateRatingFeedback, getGreeting, getStatusClass } from "../../helper";
import UserCharts from "../../components/UserCharts";


export const Dashboard = () => {
  const { user, KPI } = useAuth();
  const [currentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // const tasks = tasks.filter(task => task.assigned_user.$oid === user?._id.$oid);
  const currentTasks = user?.tasks.filter(task => task.status === "In-Progress");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (user?.tasks && user.tasks.length > 0) {
      const sortedTasks = user.tasks.sort((a: UserTask, b: UserTask) => {
        const [monthA, dayA, yearA] = a.due_date.split('/').map(Number);
        const [monthB, dayB, yearB] = b.due_date.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        
        return dateB.getTime() - dateA.getTime(); // Return the comparison result for sorting
      });
  
      setTasks(sortedTasks);  // Set the sorted tasks after sorting
      setLoading(false);      // Set loading to false once tasks are set
    }
  }, [user]);



  const inProgressTasks = tasks.filter(task => task.status === 'In-Progress');
  const inProgressResourcesCount = inProgressTasks.filter(task => task.resources).length;
  const newTasks = tasks.filter(task => task.status === 'New');
  const newTasksResourcesCount = newTasks.filter(task => task.resources).length;
  const resourceCount = inProgressResourcesCount + newTasksResourcesCount;
  const newTasksCount = tasks.filter(task => task.status === 'New').length;
  const pendingTasksCount = tasks.filter(task => task.status === 'Pending').length;
  const inprogressTasksCount = tasks.filter(task => task.status === 'In-Progress').length;
  const activeTasksCount = newTasksCount + pendingTasksCount + inprogressTasksCount;
  const completedTasksCount = tasks.filter(task => task.status === 'Completed').length;

  return (
    <div className="w-full h-[89vh] bg-slate-200 rounded-s-2xl px-5 py-4">
      <div className="text-[0.7rem] flex justify-between w-full text-gray-600">
          <div className="font-semibold">
            {formatDate(currentDate)}
          </div>
          <div className="font-semibold">
            {formatTime(currentTime)}
          </div>
      </div>
      <h2 className="text-lg font-semibold mt-0.5 mb-4">{getGreeting(currentTime)}, {user?.first_name}</h2>
      <div className="w-full h-[75vh] border-4 flex items-center justify-between">
        <div className="justify-between flex flex-col h-full w-[56%]">
            <div className="w-full h-[20%] flex justify-around rounded-xl gap-4 ">
              <div className="w-full h-full bg-white rounded-xl p-3 flex flex-col justify-around">
                <div className="flex gap-1 items-center">
                  <div>
                   <Task size="16" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-800">Total Active Tasks</h3>
                </div>
                <div className="flex items-center pl-2">
                  <h2 className="text-3xl text-center font-semibold">
                    {loading ? <Skeleton width={50} /> : formattedNumber(activeTasksCount)}
                  </h2>
                </div>
              </div>
              <div className="w-full h-full bg-white rounded-xl p-3 flex flex-col justify-around">
                <div className="flex gap-1 items-center">
                  <div>
                    <Layer size="16" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-800">Total Resources left</h3>
                </div>
                <div className="flex items-center pl-2">
                  <h2 className="text-3xl text-center font-semibold">
                   {loading ? <Skeleton width={50} /> : formattedNumber(resourceCount)}
                  </h2>
                </div>
              </div>
              <div className="w-full h-full bg-white rounded-xl p-3 flex flex-col justify-around">
                <div className="flex gap-1 items-center">
                  <div>
                    <TickCircle size="16" />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-800">Tasks Completed</h3>
                </div>
                <div className="flex items-center pl-2 ">
                  <h2 className="text-3xl text-center font-semibold">
                    {loading ? <Skeleton width={50} /> : formattedNumber(completedTasksCount)}
                  </h2>
                </div>
              </div>
            </div>
            <div className="w-full h-[76%] bg-white rounded-xl p-3 scrollbar">
              <h2 className="text-base pl-2 font-semibold text-gray-800 mb-2">Previous Tasks</h2>
              <div className="w-full h-[90%] border overflow-y-auto">
                {loading ? (
                  <Skeleton count={5} height={20} width="90%" />
                ) : (
                  <table className="table-auto w-full text-[0.82rem] text-left border-white">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Task Name</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.slice(0, 20).map((task) => (
                        <tr key={task.task_number}>
                          <td className="border px-4 py-2">{task.task_name}</td>
                          <td className={`${getStatusClass(task.status)} font-medium border px-4 py-2`}>{task.status === 'Blocked' ? 'Rejected' : task.status}</td>
                          <td className="border px-4 py-2">{formatDate(task.due_date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
        </div>
        <div className="h-full justify-between flex flex-col w-[40%]">
            <div className="w-full h-[30%] bg-white rounded-xl p-3 scrollbar">
                <div className="flex gap-1 items-center mb-2">
                  <div>
                    <ArrangeHorizontalCircle size="19" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">Current Tasks</h3>
                </div>
                <div className="w-full h-[75%] border overflow-y-auto">
                  {loading ? (
                    <Skeleton count={5} height={20} width="90%" />
                  ) : (
                    <table className="table-auto w-full text-xs text-left">
                      <thead>
                        <tr>
                          <th className="px-4 py-2">Task Name</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2">Due Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        { currentTasks && currentTasks.slice(0, 5).map((task) => (
                          <tr key={task.task_number}>
                            <td className="border px-4 py-2">{task.task_name}</td>
                            <td className={`${getStatusClass(task.status)} font-medium border px-4 py-2`}>{task.status}</td>
                            <td className="border px-4 py-2">{formatDueDate(task.due_date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
            </div>
            <div className="w-full h-[66%] bg-white rounded-xl p-3 scrollbar">
                <div className="flex gap-2 items-center mb-2">
                  <div>
                    <Chart size="19" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Personal Overview</h3>
                </div>
                <div className="w-full h-[88%] flex items-center justify-center">
                  <div className="w-[60%] h-[85%] rounded-full flex flex-col gap-2 items-center justify-center"> 
                    <UserCharts series={[KPI?.userRating || 0]} />
                    <p className="text-center font-medium text-gray-600 ">{ generateRatingFeedback(KPI?.userRating || 0) }</p> 
                  </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
