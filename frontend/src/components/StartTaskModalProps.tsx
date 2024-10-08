import axios from 'axios';
import React from 'react';

interface StartTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onStartTask: (taskId: string) => void;
}

const StartTaskModal: React.FC<StartTaskModalProps> = ({ isOpen, onClose, task, onStartTask }) => {

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onStartTask(task.id);
    
    
    try{
      // Assuming task.id is the task ID or user ID, depending on your API structure
      const response = await axios.patch(`/api/tasks/${task._id}/start`);

      // Handle the success response
      console.log('Task started successfully:', response.data);

      // Optionally, update the task status in your local state or perform other actions
    } catch (error) {
      console.error('Error starting the task:', (error as Error).message);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Start Task: {task.task_name}</h2>
        <form onSubmit={handleSubmit}>
          {/* <div className="mb-4">
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div> */}
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
              Start Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartTaskModal;