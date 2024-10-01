import { Outlet } from "react-router-dom"
import { useState } from "react"
import { AdminNavbar } from "./AdminNavbar";
import { AdminSidebar } from "./AdminSidebar";


export const AdminLayout = () => {
    const [showSidebar, setShowSidebar] = useState<boolean>(true);
  return (
    <div className="w-[100vw] h-[100vh] relative">
        <AdminNavbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <div className="flex">
        { showSidebar && <AdminSidebar />}
            <Outlet />
        </div>
    </div>
  )
}
