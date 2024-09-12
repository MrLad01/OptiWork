import { Outlet } from "react-router-dom"
import { UserNavbar } from "./UserNavbar"
import { UserSidebar } from "./UserSidebar"
import { useState } from "react"

export const UserLayout = () => {
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  return (
    <div className="w-[100vw] h-[100vh] relative">
      <UserNavbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="flex">
        { showSidebar && <UserSidebar />}
        <Outlet />
      </div>
    </div>
  )
}
