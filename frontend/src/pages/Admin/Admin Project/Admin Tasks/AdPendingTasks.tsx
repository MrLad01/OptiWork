// import React from 'react'
import Skeleton from "react-loading-skeleton";
import { Task, useAuth } from "../../../../context/AuthContext";
import { formatDate, getStatusClass } from "../../../../helper"
import { useEffect, useState } from "react";

export const AdPendingTasks = () => {
  const [loading, setLoading] = useState<boolean>()
  const { companyTasks } = useAuth();
  const raw = companyTasks !== null && companyTasks.filter(task => task.status === 'Pending');
  const [tasks, setTasks] = useState<Task[]>();

  useEffect(() => {
    if (raw && raw.length > 0) {
      const sortedTasks = raw.sort((a: Task, b: Task) => {
        const [monthA, dayA, yearA] = a.due_date.split('/').map(Number);
        const [monthB, dayB, yearB] = b.due_date.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        
        return dateB.getTime() - dateA.getTime(); // Return the comparison result for sorting
      });
      setTasks(sortedTasks);
      setLoading(false);      // Set loading to false once tasks are set
    }
  }, []);

  return (
    <div className="w-full h-full flex overflow-y-scroll">
          {loading ? (
        <Skeleton count={5} height={20} width="100%" />
      ) : (
        <>
        { tasks && tasks.length > 0 ?
        <table className="table-auto w-full text-xs">
          <thead className="">
            <tr>
              <th className="px-2 py-1">Task Number</th>
              <th className="px-2 py-1">Task Name</th>
              <th className="px-2 py-1">Priority</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Due Date</th>
              <th className="px-2 py-1">Due Time</th>
              <th className="px-3 py-1">Approval</th>
            </tr>
          </thead>
          <tbody>
            {tasks && tasks.map((task) => (
              <tr key={task._id}>
                <td className="border px-2 py-1">{task.task_number}</td>
                <td className="border px-2 py-1">{task.task_name}</td>
                <td className="border px-2 py-1">{task.priority}</td>
                <td className={`${getStatusClass(task.status)} font-medium border px-4 py-2`}>
                  {task.status === 'Blocked' ? 'Rejected' : task.status}
                </td>
                <td className="border px-2 py-1">{formatDate(task.due_date)}</td>
                <td className="border px-2 py-1">{(task.due_time)}</td>
                <td className="border px-3 py-1 flex items-center">
                  <button className="px-3 py-1 text-white bg-blue-600 shadow-sm">Approve</button>
                  <button className="px-3 py-1 text-white bg-red-500 shadow-sm">Decline</button>
                </td>
              </tr>
              )) 
              }
              </tbody>
              </table>
      : 
      <div className="w-full h-full flex items-center justify-center text-xl opacity-30" >
        No Pending tasks currently
      </div>}
      </>
      )}
    </div>
  )
}
