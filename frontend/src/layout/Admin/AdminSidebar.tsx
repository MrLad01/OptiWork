import { Diagram, Element2, LogoutCurve, Setting2, TaskSquare } from 'iconsax-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = () => {
    const { logout } = useAuth();
    const [activeMenu, setActiveMenu] = useState<string>('');
    const location = useLocation();
  
    useEffect(() => {
      const pathname = location.pathname;
      const segments = pathname.split('/').filter(segment => segment !== '');
      const lastSegment = segments[segments.length - 1] || 'dashboard';
      setActiveMenu(lastSegment.toLowerCase());
    }, [location]);
  
    const menuItems = [
      { name: 'Dashboard', icon: <Element2 size="20" />, link: '/admin/dashboard' },
      { name: 'Project', icon: <TaskSquare size="22" />, link: '/admin/project' },
      { name: 'Report', icon: <Diagram size="20" />, link: '/admin/report' },
      { name: 'Settings', icon: <Setting2 size="20" />, link: '/admin/settings' },
    ];
  
    const handleLogout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      // Perform login logic (e.g., validate credentials)
      e.preventDefault();
      logout();
    };
  
    return (
      <div className="left-0 h-[89vh] px-5 py-6 flex flex-col items-center justify-between ">
        <div className="flex flex-col w-[11rem]">
          <div className="flex flex-col gap-1 mt-5">
            <h1 className="left-0 text-xs ml-2">Menu</h1>
            {menuItems.map((item) => (
              <Link 
                key={item.name}
                to={item.link} 
                className={`flex cursor-pointer items-center gap-3 py-2 pl-4 rounded-2xl ${activeMenu === item.name.toLowerCase() ? 'bg-gray-200 text-slate-700 font-semibold' : 'text-slate-800'}`}
              >
                <div>{item.icon}</div>
                <h2 className=' text-[0.9rem]'>{item.name}</h2>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <button className="px-4 py-2"  onClick={(e) => handleLogout(e)}>
            <div className="flex items-center gap-2">
              <LogoutCurve size="20" /> 
              Logout
            </div>
          </button>
        </div>
      </div>
    );
}
