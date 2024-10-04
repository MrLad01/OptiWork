import React from 'react';
import { Col, Grid, Row, Timeline } from 'rsuite';  // Import the Timeline component

// Define the types for tasks and users
interface User {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  role: string;
}

export interface Task1 {
  _id: string;
  task_number: string;
  task_name: string;
  description: string;
  due_date: string;
  due_time: string;
  actual_time: number | null;
  estimated_time: number | null;
  priority: string;
  status: string;
  assigned_user: User[];
  resources: any[];  // Adjust type as necessary
  resources_used: any[];
  createdAt: string;
  updatedAt: string;
}

interface TaskTimelineProps {
  tasks: Task1[];
}

interface Props {
  align: "left" | "right" | "alternate" | undefined;
  tasks: Task1[];
}

const AlignTimeline: React.FC<Props> = ({ align, tasks }) => (
  <Timeline className="mt-3" align={align}>
    {tasks && tasks.map((task) => (
      <Timeline.Item key={task._id} className='mt-4' time={new Date(task.due_date).toLocaleDateString()}>
        <div className="text-lg font-semibold">{task.task_name}</div>
        <div className="text-sm text-gray-500">Due Time: {task.due_time}</div>
        <div className="text-sm">Status: <span className={`font-semibold ${task.status === 'High' ? 'text-red-500' : task.status === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{task.status}</span></div>
        <div className="text-sm">
          Assigned to: {task.assigned_user.map(user => `${user.first_name} ${user.last_name}`).join(', ')}
        </div>
      </Timeline.Item>
    ))}
  </Timeline>
);

export const TaskTimeline: React.FC<TaskTimelineProps> = ({ tasks }) => {
  return (
    <div className="w-full bg-white rounded-md p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Project Task Timeline</h2>
      <Grid fluid className="mb-6">
        <Row className="space-y-6 md:space-y-0 md:space-x-4">
          <Col xs={24} md={8}>
            <div className="bg-slate-50 p-4 rounded-lg shadow-sm">
              <AlignTimeline align="left" tasks={tasks} />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="bg-slate-50 p-4 rounded-lg shadow-sm">
              <AlignTimeline align="alternate" tasks={tasks} />
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="bg-slate-50 p-4 rounded-lg shadow-sm">
              <AlignTimeline align="right" tasks={tasks} />
            </div>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};
