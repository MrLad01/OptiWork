
import Skeleton from "react-loading-skeleton";
import { Task2, useAuth } from "../../context/AuthContext";
import {  formatDate, formatTime, getGreeting, getStatusClass } from "../../helper"
import { useEffect, useState } from "react";
import CustomProgressCircle from "../../components/CustomProgressCircle";

export const Addashboard = () => {
  const { user, latestProject } = useAuth();
  const task = latestProject !== null ? latestProject.tasks : [];
  const [ tasks, setTasks ] = useState<Task2[]>(task);
  const [ loading, setLoading ] = useState<boolean>();

  const [currentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  // const users = latestProject && latestProject.tasks.flatMap(task => task.assigned_user);
    // Extracting unique users using a Set
 // Ensure the 'assigned_user' is treated as an array
    const users = latestProject
    ? Array.from(
        new Set(
          latestProject.tasks.flatMap(task => 
            Array.isArray(task.assigned_user) ? task.assigned_user.map(user => user._id.$oid) : task.assigned_user._id
          ).filter(Boolean)
        )
      ).map(userId =>
        latestProject.tasks.flatMap(task => 
          Array.isArray(task.assigned_user) ? task.assigned_user : [task.assigned_user]
        ).find(user => user._id === userId)
      )
    : [];



  const pendingTasksCount = tasks.filter(task => task.status === 'Pending').length;
  const inprogressTasksCount = tasks.filter(task => task.status === 'In-Progress').length;
  const completedTasksCount = tasks.filter(task => task.status === 'Completed').length;
  const projectPercent = completedTasksCount / tasks.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full h-[90.2vh] bg-slate-200 rounded-s-2xl px-5 py-4 flex flex-col gap-2">
        <div className=" flex justify-between w-full text-gray-600">
          <div className="font-semibold text-[0.7rem]">
            {formatTime(currentTime)}
          </div>
          <div className="font-bold text-[0.8rem]">
            {formatDate(currentDate)}
          </div>
      </div>
      <div className=" w-full h-[83vh] flex justify-between" >
        <div className="w-[58%] h-full flex flex-col justify-between">
          <div className="w-full h-[8%] flex items-center justify-center border-y-4 border-white rounded-xl p-2">
            <h1 className="text-base font-semibold">{getGreeting(currentTime)}, {user?.first_name} {user?.last_name}</h1>
          </div>
          <div className="w-full h-[22%] flex justify-between">
            <div className="h-full w-[32%] bg-white rounded-md p-3 flex flex-col justify-between ">
              <h3 className="text-xs font-semibold">Number of Pending Tasks</h3>
              <div className="flex justify-end h-full items-center pr-4">
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-medium opacity-80">{ pendingTasksCount }</span>
                  <span className="text-2xl font-extralight opacity-15" >/ 10</span>
                </div>
              </div>
            </div>
            <div className="h-full w-[32%] bg-white rounded-md p-3 flex flex-col justify-between ">
              <h3 className="text-xs font-semibold">Number of Tasks in progress</h3>
              <div className="flex justify-end h-full items-center pr-4">
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-medium opacity-80"> { inprogressTasksCount } </span>
                  <span className="text-2xl font-extralight opacity-15" >/ 10</span>
                </div>
              </div>
            </div>
            <div className="h-full w-[32%] bg-white rounded-md p-3 flex flex-col justify-between ">
             <h3 className="text-xs font-semibold">Number of Tasks completed</h3>
              <div className="flex justify-end h-full items-center pr-4">
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-medium opacity-80"> { completedTasksCount } </span>
                  <span className="text-2xl font-extralight opacity-15" >/ 10</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[31%] bg-white rounded-md p-3 flex flex-col gap-2 justify-between">
            <h2 className="text-sm font-medium">Update on the Tasks so far</h2>
            <div className="w-full h-full border-x border-slate-200 overflow-y-scroll rounded-xl p-3">
            {loading ? (
                  <Skeleton count={5} height={20} width="90%" />
                ) : (
                  <table className="table-auto w-full text-[0.82rem] text-left border-white">
                    <thead>
                      <tr>
                        <th className="px-4 py-1">Task Name</th>
                        <th className="px-4 py-1">Due Date</th>
                        <th className="px-4 py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.slice(0, 20).map((task) => (
                        <tr key={task.task_number}>
                          <td className="border px-4 py-2">{task.task_name}</td>
                          <td className="border px-4 py-2">{formatDate(task.due_date)}</td>
                          <td className={`${getStatusClass(task.status)} font-medium border px-4 py-2`}>{task.status === 'Blocked' ? 'Rejected' : task.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          </div>
          <div className="w-full h-[31%] bg-white rounded-md p-3 flex flex-col gap-2 justify-between">
            <h2 className="text-sm font-medium">Users Summary</h2>
            <div className="w-full h-full border-x border-slate-200 overflow-y-scroll rounded-xl p-3">
            {loading ? (
                  <Skeleton count={5} height={20} width="90%" />
                ) : (
                  <table className="table-auto w-full text-[0.82rem] text-left border-white">
                    <thead>
                      <tr>
                        <th className="px-4 py-1">First Name</th>
                        <th className="px-4 py-1">Last Name</th>
                        <th className="px-4 py-1">Username</th>
                        <th className="px-4 py-1">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      { users && users.slice(0, 10).map((person) => (
                        <tr key={person && person._id.$oid} className="border-b">
                          <td className="px-4 py-1">{person && person.first_name}</td>
                          <td className="px-4 py-1">{person && person.last_name}</td>
                          <td className="px-4 py-1">{person && person.username}</td>
                          <td className="px-4 py-1">{person && person.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          </div>
        </div>
        <div className="w-[40%] h-full flex flex-col justify-between">
          <div className="w-full h-[49%] bg-white rounded-md p-3 flex flex-col gap-2 justify-between">
            <h2 className="text-[0.905rem] font-medium">Summary on Project target of the week</h2>
            <div className="w-full h-full flex flex-col items-center justify-between pt-2">
              <CustomProgressCircle percent={projectPercent} width={120} height={120} />
              <span className="text-pretty text-center text-xs w-[60%]">Target: {latestProject?.description}</span>
            </div>
          </div>
          <div className="w-full h-[49%] bg-white rounded-md p-3 flex flex-col gap-2 justify-between">
          <h2 className="text-[0.905rem] font-medium">Summary of the resources for the week </h2>
            <div className="w-full h-full flex items-center justify-center p-2 border-x border-slate-200 rounded-xl">
              Table
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
