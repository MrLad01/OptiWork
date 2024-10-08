import { useEffect, useState } from 'react'
import { useAuth, UserTask } from '../../../context/AuthContext';
import { calculateResourceUtilizationRate, calculateTaskCompletionRate, calculateTaskEfficiency } from '../../../helper';

export const UsersReport = () => {

  const { users } = useAuth();
  const [userTask, setUserTask] = useState<UserTask[]>([]);


  // Metrics
  const taskCompletionRate = calculateTaskCompletionRate(userTask);
  const resourceUtilizationRate = calculateResourceUtilizationRate(userTask);
  const taskEfficiency = calculateTaskEfficiency(userTask);

  return (
    <div className="w-full h-full p-3 bg-white rounded-md">
      <h1 className="text-base font-semibold">All Users report</h1>

      <table className="w-full table-auto text-sm border-collapse mt-4">
        <thead>
          <tr>
            <th className="border text-sm px-4 py-2">Name</th>
            <th className="border text-sm px-4 py-2">Username</th>
            <th className="border text-sm px-4 py-2">Role</th>
            <th className="border text-sm px-4 py-2">Task Completion Rate</th>
            <th className="border text-sm px-4 py-2">Task Efficiency</th>
            <th className="border text-sm px-4 py-2">Resource Utilization Rate</th>
          </tr>
        </thead>
        <tbody>
          { users && users.map((user) => (
            <tr key={user._id}>
              <td className="border text-sm px-4 py-2">{user.first_name} {user.last_name}</td>
              <td className="border text-sm px-4 py-2">{user.username}</td>
              <td className="border text-sm px-4 py-2">{user.role}</td>
              <td className="border text-sm px-4 py-2">{ !isNaN(calculateTaskCompletionRate(user.tasks)) ?calculateTaskCompletionRate(user.tasks)  : 0 }% </td>
              <td className="border text-sm px-4 py-2">{ !isNaN(calculateTaskEfficiency(user.tasks)) ? calculateTaskEfficiency(user.tasks) : 0 }% </td>
              <td className="border text-sm px-4 py-2">{ !isNaN(calculateResourceUtilizationRate(user.tasks)) ? calculateResourceUtilizationRate(user.tasks) : 0 }% </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}
