import { useState } from "react";
import { Nav } from "rsuite";
import { MonthlyBreakdown } from "./Admin Reports/MonthlyBreakdown";
import { UsersReport } from "./Admin Reports/UsersReport";


export const AdminReport = () => {
  const [activeKey, setActiveKey] = useState('Monthly Breakdown');

  // The content you want to display for each tab
  const renderContent = () => {
    switch (activeKey) {
      case 'Monthly Breakdown':
        return <MonthlyBreakdown />;
      case 'Users Report':
        return <UsersReport />;
      default:
        return <MonthlyBreakdown />;
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
            eventKey="Monthly Breakdown"
            className={`py-2 px-3 text-[0.78rem]  rounded-s-xl  ${
              activeKey === 'Monthly Breakdown'
                ? 'bg-white bg-opacity-90 shadow-md font-semibold border-spacing-1'
                : 'bg-slate-200 border-y border-slate-100 hover:font-semibold'
            }`}
          >
            Monthly Breakdown
          </Nav.Item>

          {/* Divider */}
          <div className="border-r h-auto my-auto"></div>

          {/* Users Report Tab */}
          <Nav.Item
            eventKey="Users Report"
            className={`py-2 px-3 text-[0.78rem]  rounded-e-xl   ${
              activeKey === 'Users Report'
                ? 'bg-white bg-opacity-90 shadow-md font-semibold '
                : 'bg-gray-200 border-y border-slate-100 hover:font-semibold'
            }`}
          >
            Users Report
          </Nav.Item>

        </Nav>

        {/* Render the content for the selected tab */}
        <div className="mt-3 p-1 border rounded-lg h-[77vh] bg-white bg-opacity-30">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
