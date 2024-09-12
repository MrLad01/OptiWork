import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: any[];
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, tasks }) => {
  if (!isOpen) return null;

  const events = tasks.map(task => ({
    title: task.task_name,
    start: new Date(task.due_date),
    end: new Date(task.due_date),
    allDay: true,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg text-sm w-3/4 h-3/4">
        <h2 className="text-xl font-bold mb-4">Task Schedule</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100% - 80px)' }}
        />
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

export default CalendarModal;