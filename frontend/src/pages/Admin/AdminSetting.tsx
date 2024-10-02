import { useState } from "react";
import { UsersSetting } from "./Admin Settings/UsersSetting";
import { Nav } from "rsuite";
import { AdminPersonalSetting } from "./Admin Settings/AdminPersonalSetting";

export const AdminSetting = () => {
  const [activeKey, setActiveKey] = useState('Users Setting');

  // The content you want to display for each tab
  const renderContent = () => {
    switch (activeKey) {
      case 'Users Setting':
        return <UsersSetting />;
      case 'Personal Setting':
        return <AdminPersonalSetting />;
      default:
        return <UsersSetting />;
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
            eventKey="Users Setting"
            className={`py-2 px-3 text-[0.78rem]  rounded-s-xl  ${
              activeKey === 'Users Setting'
                ? 'bg-white bg-opacity-90 shadow-md font-semibold border-spacing-1'
                : 'bg-slate-200 border-y border-slate-100 hover:font-semibold'
            }`}
          >
            Users Setting
          </Nav.Item>

          {/* Divider */}
          <div className="border-r h-auto my-auto"></div>

          {/* Personal Setting Tab */}
          <Nav.Item
            eventKey="Personal Setting"
            className={`py-2 px-3 text-[0.78rem]  rounded-e-xl   ${
              activeKey === 'Personal Setting'
                ? 'bg-white bg-opacity-90 shadow-md font-semibold '
                : 'bg-gray-200 border-y border-slate-100 hover:font-semibold'
            }`}
          >
            Personal Setting
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
 