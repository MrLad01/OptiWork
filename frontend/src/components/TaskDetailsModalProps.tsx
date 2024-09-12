import React from 'react';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">{task.task_name}</h2>
        <p><strong>Task Number:</strong> {task.task_number}</p>
        <p><strong>Priority:</strong> {task.priority}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Due Date:</strong> {task.due_date}</p>
        <p><strong>Due Time:</strong> {task.due_time}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <button 
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsModal;