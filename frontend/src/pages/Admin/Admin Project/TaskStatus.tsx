// import React from 'react'

import { useState } from "react";
import { Nav, Sidenav } from "rsuite";
import { AdPendingTasks } from "./Admin Tasks/AdPendingTasks";
import { AdInProgressTasks } from "./Admin Tasks/AdInProgressTasks";
import { AdCompletedTasks } from "./Admin Tasks/AdCompletedTasks";
import { AdNewTasks } from "./Admin Tasks/AdNewTasks";

export const TaskStatus = () => {

  const [activeMenu, setActiveMenu] = useState('Pending Tasks');

   // The content you want to display for each tab
   const renderContent = () => {
    switch (activeMenu) {
      case 'Pending Tasks':
        return <AdPendingTasks />;
      case 'In-Progress Tasks':
        return <AdInProgressTasks />;
      case 'Completed Tasks':
        return <AdCompletedTasks />;
      case 'New Tasks':
        return <AdNewTasks />;
      default:
        return <AdPendingTasks />;
    }
  };


  return (
    <div className="w-full h-full flex justify-between items-center">
        <div className="h-full w-[20%] relative bg-white bg-opacity-25 p-3 flex flex-col items-center justify-center rounded-md ">
          <Sidenav>
            <Sidenav.Body>
              <Nav 
                activeKey={activeMenu}
                onSelect={setActiveMenu}
                className="flex flex-col border-b gap-4"
              >
                <Nav.Item
                  eventKey="Pending Tasks"
                  className={`py-3 px-4 border text-[0.86rem]  rounded-xl  ${
                    activeMenu === 'Pending Tasks'
                      ? 'bg-white bg-opacity-90 shadow-md font-semibold border-spacing-1'
                      : 'bg-slate-200 border-y border-slate-100 hover:font-semibold'
                  }`}
                >Pending Tasks</Nav.Item>
                <Nav.Item
                  eventKey="In-Progress Tasks"
                  className={`py-3 px-4 border  text-[0.86rem]  rounded-xl  ${
                    activeMenu === 'In-Progress Tasks'
                      ? 'bg-white bg-opacity-90 shadow-md font-semibold border-spacing-1'
                      : 'bg-slate-200 border-y border-slate-100 hover:font-semibold'
                  }`}
                >In-Progress Tasks</Nav.Item>
                <Nav.Item
                  eventKey="Completed Tasks"
                  className={`py-3 px-4 border  text-[0.86rem]  rounded-xl  ${
                    activeMenu === 'Completed Tasks'
                      ? 'bg-white bg-opacity-90 shadow-md font-semibold border-spacing-1'
                      : 'bg-slate-200 border-y border-slate-100 hover:font-semibold'
                  }`}
                >Completed Tasks</Nav.Item>
                <Nav.Item
                  eventKey="New Tasks"
                  className={`py-3 px-4 border  text-[0.86rem]  rounded-xl  ${
                    activeMenu === 'New Tasks'
                      ? 'bg-white bg-opacity-90 shadow-md font-semibold border-spacing-1'
                      : 'bg-slate-200 border-y border-slate-100 hover:font-semibold'
                  }`}
                >New Tasks</Nav.Item>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </div>
        <div className="h-full w-[78%] relative bg-white p-3 flex  rounded-md ">
          {renderContent()}
        </div>
    </div>
  )
}
