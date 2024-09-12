import React, { useState } from 'react';

interface SubmitTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onSubmitTask: (taskId: string) => void;
}

const SubmitTaskModal: React.FC<SubmitTaskModalProps> = ({ isOpen, onClose, task, onSubmitTask }) => {
  const [endTime, setEndTime] = useState('');

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitTask(task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Submit Task: {task.task_name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
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