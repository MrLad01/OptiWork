// import React from 'react'

import { useAuth } from "../../../context/AuthContext";

export const ProjectHistory = () => {
  const { Projects } = useAuth();

  return (
    <div className="w-full h-full p-3 bg-white rounded-md overflow-y-scroll overflow-x-scroll">
      <h1 className="text-sm font-semibold">History</h1>

      {Projects && Projects.map((project) => (
        <div key={project._id} className="mb-8 border border-gray-200 p-4 rounded-md">
          <h3 className="text-sm font-semibold">{project.target_name}</h3>
          <p className="text-gray-600 text-sm">{project.description}</p>
          <p className="text-gray-600 text-sm"><strong>Company:</strong> {project.company_name}</p>
          <p className="text-gray-600 text-sm"><strong>Start Date:</strong> {new Date(project.start_date).toLocaleDateString()}</p>
          <p className="text-gray-600 text-sm"><strong>End Date:</strong> {new Date(project.end_date).toLocaleDateString()}</p>
          <p className="text-gray-600 text-sm"><strong>Created By:</strong> {project.created_by.first_name} {project.created_by.last_name} ({project.created_by.company_email})</p>

          <h4 className="text-sm font-semibold mt-4">Tasks</h4>
          <table className="w-full table-auto text-xs border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Task Number</th>
                <th className="border px-4 py-2">Task Name</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Due Date</th>
                <th className="border px-4 py-2">Priority</th>
                <th className="border px-4 py-2">Assigned Users</th>
                <th className="border px-4 py-2">Resources</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {project.tasks.map((task) => (
                <tr key={task._id}>
                  <td className="border px-4 py-2">{task.task_number}</td>
                  <td className="border px-4 py-2">{task.task_name}</td>
                  <td className="border px-4 py-2">{task.description}</td>
                  <td className="border px-4 py-2">{new Date(task.due_date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{task.priority}</td>
                  <td className="border px-4 py-2">
                    {task.assigned_user.map((user, index) => (
                      <span key={index} className="block">{user.toString()}</span>
                    ))}
                  </td>
                  <td className="border px-4 py-2">
                    {task.resources.map((resource) => (
                      <div key={resource._id}>
                        <strong>Material ID:</strong> {resource.material.toString()}, <strong>Quantity:</strong> {resource.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="border px-4 py-2">{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};
