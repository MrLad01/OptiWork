import React, { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Task } from '../context/AuthContext';


interface SubmitTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onSubmitTask: (taskId: string) => void;
}

const SubmitTaskModal: React.FC<SubmitTaskModalProps> = ({ isOpen, onClose, task, onSubmitTask }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // const [endTime, setEndTime] = useState('');

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitTask(task._id);
    onClose();
  };

  const addMaterialToTask = (taskIndex: number) => {
    const updatedTasks = [...task];
    if (updatedTasks[taskIndex].resources.length < 10) {
      updatedTasks[taskIndex].resources.push({
        material: '',
        quantity: 0,
      });
      setTasks(updatedTasks);
    }
  };

  const removeMaterialFromTask = (taskIndex: number, materialIndex: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].resources = updatedTasks[taskIndex].resources.filter((_, i) => i !== materialIndex);
    setTasks(updatedTasks);
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Submit Task: {task.task_name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
            {/* <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            /> */}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit for Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitTaskModal;