import { Diagram, Element2, Filter, SearchNormal, Setting2, TaskSquare } from "iconsax-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAuth } from "../../context/AuthContext";
import ApexChart from "../../components/ApexCharts";
import CalendarModal from "../../components/CalendarModal";

export const UserTask = () => {
  const { user } = useAuth();

  const [activeTaskMenu, setActiveTaskMenu] = useState<string>('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksCloseToDeadline, setTasksCloseToDeadline] = useState(0);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);  // New state for modal
  const location = useLocation();

  const usersTasks = tasks.filter(task => task.assigned_user.$oid === user?._id.$oid);


  useEffect(() => {
    const pathname = location.pathname;
    const segments = pathname.split('/').filter(segment => segment !== '');
    const lastSegment = segments[segments.length - 1] || 'task';
    setActiveTaskMenu(lastSegment.toLowerCase());
  }, [location]);

  useEffect(() => {
    axios.get('https://optiwork.onrender.com/api/tasks')
      .then(response => {
        const sortedTasks = response.data.sort((a: any, b: any) => {
          const [monthA, dayA, yearA] = a.due_date.split('/').map(Number);
          const [monthB, dayB, yearB] = b.due_date.split('/').map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateB.getTime() - dateA.getTime(); // Sort from recent to oldest
        });
        setTasks(sortedTasks);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const closeToDeadline = usersTasks.filter(task => 
      task.status === 'New' && isCloseToDeadline(task.due_date)
    ).length;
    setTasksCloseToDeadline(closeToDeadline);
  }, [usersTasks]);

  const isCloseToDeadline = (dueDate: string) => {
    const [month, day, year] = dueDate.split('/').map(Number);
    const taskDueDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    const timeDiff = taskDueDate.getTime() - currentDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff <= 3 && daysDiff >= 0;
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 24-hour to 12-hour format
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const openCalendarModal = () => {
    setIsCalendarModalOpen(true);
  };

  const closeCalendarModal = () => {
    setIsCalendarModalOpen(false);
  };

  const menuItems = [
    { name: 'All', icon: <Element2 size="12" />, link: '/user/task/' },
    { name: 'New', icon: <TaskSquare size="12" />, link: '/user/task/new' },
    { name: 'In-Progress', icon: <Diagram size="12" />, link: '/user/task/in-progress' },
    { name: 'Pending', icon: <TaskSquare size="12" />, link: '/user/task/pending' },
    { name: 'Completed', icon: <TaskSquare size="12" />, link: '/user/task/completed' },
    { name: 'Rejected', icon: <Setting2 size="12" />, link: '/user/task/rejected' },
  ];

  return (
    <div className="w-full h-[89vh] bg-slate-200 rounded-s-2xl px-5 py-4 flex flex-col gap-2">
      <h1 className="text-xl font-semibold">Tasks</h1>
      <div className="w-full h-[97%] flex items-center justify-between">
        <div className="h-[90%] w-[58%] bg-white rounded-lg p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 border-b px-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.name}
                  to={item.link} 
                  className={`flex cursor-pointer items-center gap-1 p-2 ${activeTaskMenu === item.name.toLowerCase() ? 'border-b-2 border-slate-400 font-semibold' : 'text-slate-800'}`}
                >
                  <h2 className=' text-[0.8em]'>{item.name}</h2>
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-evenly text-xs gap-4">
              <button title="Search Tasks" className="p-1">
                 <SearchNormal size="16" />
              </button>
              <button title="Filter Tasks" className="p-1">
                <Filter size="16" />
              </button>
            </div>
          </div>
          <div className="h-[84%] w-full  overflow-y-scroll">
            <Outlet />
          </div>
        </div>
        <div className="h-[90%] w-[40%] flex flex-col items-center justify-between">
          <div className="w-full h-[40%] bg-white rounded-lg flex flex-col justify-between p-3 gap-2 scrollbar">
            <h2 className="font-semibold">Upcoming Tasks</h2>
            <div className="border-x h-full flex flex-col p-1 items-start justify-evenly text-sm overflow-y-auto">
              {loading ? (
                <Skeleton count={5} height={20} width="100%" />
              ) : (
                <table className="table-auto w-full text-xs">
                  <thead>
                    <tr>
                      <th className="px-2 py-1">Task Name</th>
                      <th className="px-2 py-1">Priority</th>
                      <th className="px-2 py-1">Due Date</th>
                      <th className="px-2 py-1">Due Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersTasks.filter(task => task.status === 'New').slice(0, 5).map((task) => (
                      <tr key={task.id}>
                        <td className="border px-2 py-1">{task.task_name}</td>
                        <td className="border px-2 py-1">{task.priority}</td>
                        <td className="border px-2 py-1">{task.due_date}</td>
                        <td className="border px-2 py-1">{formatTime(task.due_time)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <button 
              className="border text-sm py-1"
              onClick={openCalendarModal}  // Add onClick handler
            >View full schedule</button>
          </div>
          <div className="w-full h-[55%] bg-white rounded-lg flex flex-col p-3">
            <h2 className="font-semibold">Task Track</h2>
            <div className="h-full flex flex-col p-1 gap-2 items-center justify-evenly text-sm">
              <div className="border h-[90%] w-full flex">
                <ApexChart tasks={usersTasks} />
              </div>
              <div className="font-medium">Tasks close to deadline: {tasksCloseToDeadline}</div> </div>
          </div>
        </div>
      </div>
      <CalendarModal 
        isOpen={isCalendarModalOpen}
        onClose={closeCalendarModal}
        tasks={usersTasks}
      />
    </div>
  );
};
