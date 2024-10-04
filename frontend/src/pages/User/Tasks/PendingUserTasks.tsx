// import axios from "axios";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useAuth, UserTask } from "../../../context/AuthContext";
import { Menu } from '@headlessui/react';
import TaskDetailsModal from "../../../components/TaskDetailsModalProps";
import { formatDate } from "../../../helper";

export const PendingUserTasks = () => {

  const { user } = useAuth();


  const [tasks, setTasks] = useState<UserTask[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // const usersTasks = tasks.filter(task => task.assigned_user.$oid === user?._id.$oid);

  const handleViewDetails = (task: any) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  useEffect(() => {
      setTasks(user?.tasks);
      setLoading(false);
  }, []);

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 24-hour to 12-hour format
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const getStatusClass = (status: string) => {
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


  return (
    <div className='w-full flex  border'>
      {loading ? (
                <Skeleton count={5} height={20} width="100%" />
              ) : (
        <>{ tasks && tasks.filter(task => task.status === 'Pending').length > 0 ?
      <table className="table-auto w-full text-xs">
          <thead className="">
            <tr>
              <th className="px-2 py-1">Task Number</th>
              <th className="px-2 py-1">Task Name</th>
              <th className="px-2 py-1">Priority</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Due Date</th>
              <th className="px-2 py-1">Due Time</th>
              <th className="px-3 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {tasks && tasks.filter(task => task.status === 'Pending').map((task) => (
              <tr key={task._id}>
                <td className="border px-2 py-1">{task.task_number}</td>
                <td className="border px-2 py-1">{task.task_name}</td>
                <td className="border px-2 py-1">{task.priority}</td>
                <td className={`${getStatusClass(task.status)} font-medium border px-4 py-2`}>{task.status}</td>
                <td className="border px-2 py-1">{formatDate(task.due_date)}</td>
                <td className="border px-2 py-1">{formatTime(task.due_time)}</td>
                <td className="border px-3 py-1">
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-center items-center w-full px-2 py-1 text-sm font-medium rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        ...
                        {/* <span className="ml-2 text-xs">▼</span> */}
                      </Menu.Button>
                    </div>
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-violet-500 text-white' : 'text-gray-900 bg-white'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                              onClick={() => handleViewDetails(task)}
                            >
                              View Details
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table> :
        <div className="flex justify-center items-center text-lg opacity-30 w-full h-[56vh]"> You have no pending tasks </div>
        }
        </>
              )}
        <TaskDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          task={selectedTask}
        />
    </div>
  )
}
