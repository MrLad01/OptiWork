import { useState } from 'react';
import { Nav } from 'rsuite';
import { ProjectDetails } from './Admin Project/ProjectDetails';
import { TaskStatus } from './Admin Project/TaskStatus';
import { CreateProject } from './Admin Project/CreateProject';
import { ProjectHistory } from './Admin Project/ProjectHistory';


export const AdminProject = () => {

  const [activeKey, setActiveKey] = useState('Project Details');

  // The content you want to display for each tab
  const renderContent = () => {
    switch (activeKey) {
      case 'Project Details':
        return <ProjectDetails />;
      case 'Tasks Status':
        return <TaskStatus />;
      case 'Create Project Target':
        return <CreateProject />;
      case 'History':
        return <ProjectHistory />;
      default:
        return <ProjectDetails />;
    }
  };

  return (
    <div className="w-full h-[90.2vh] bg-slate-200 rounded-s-2xl px-5 py-4">
       <div className="p-2">
        <Nav
          activeKey={activeKey}
          onSelect={setActiveKey}
          className="flex border-b"
        >
          {/* Project Details Tab */}
          <Nav.Item
            eventKey="Project Details"
            className={`py-2 px-3 text-[0.78rem]  rounded-s-xl  ${
              activeKey === 'Project Details'
                ? 'bg-white bg-opacity-90 shadow-md font-semibold border-spacing-1'
                : 'bg-slate-200 border-y border-slate-100 hover:font-semibold'
            }`}
          >
            Project Details
          </Nav.Item>

          {/* Divider */}
          <div className="border-r h-auto my-auto"></div>

          {/* Tasks Status Tab */}
          <Nav.Item
            eventKey="Tasks Status"
            className={`py-2 px-3 text-[0.78rem]  ${
              activeKey === 'Tasks Status'
                ? 'bg-white bg-opacity-90 shadow-md font-semibold '
                : 'bg-gray-200 border-y border-slate-100 hover:font-semibold'
            }`}
          >
            Tasks Status
          </Nav.Item>

          {/* Divider */}
          <div className="border-r h-auto my-auto"></div>

          {/* Contact Tab */}
          <Nav.Item
            eventKey="Create Project Target"
            className={`py-2 px-3 text-[0.78rem]   ${
              activeKey === 'Create Project Target'
                ? 'bg-white bg-opacity-90 shadow-md font-semibold'
                : 'bg-gray-200 border-y border-slate-100 hover:font-semibold'
            }`}
          >
            Create Project Target
          </Nav.Item>
          {/* Contact Tab */}
          <Nav.Item
            eventKey="History"
            className={`py-2 px-3 text-[0.78rem]  rounded-e-xl  ${
              activeKey === 'History'
                ? 'bg-white bg-opacity-90 shadow-md font-semibold'
                : 'bg-gray-200 border-y border-slate-100 hover:font-semibold'
            }`}
          >
            History
          </Nav.Item>
        </Nav>

        {/* Render the content for the selected tab */}
        <div className="mt-3 p-3 border rounded-lg h-[77vh] bg-white bg-opacity-30">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
