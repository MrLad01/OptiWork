import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom"
import Welcome from "./pages/Welcome"
import UserAccess from "./pages/UserAccess"
import { UserLayout } from "./layout/User/UserLayout"
import { Dashboard } from "./pages/User/Dashboard"
import {  UserTask1 } from "./pages/User/UserTask"
// import { UserReport } from "./pages/User/UserReport"
import { UserSetting } from "./pages/User/UserSetting"
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { AllUserTasks } from "./pages/User/Tasks/AllUserTasks"
import { PendingUserTasks } from "./pages/User/Tasks/PendingUserTasks"
import { ProgressUserTasks } from "./pages/User/Tasks/ProgressUserTasks"
import { BlockedUserTasks } from "./pages/User/Tasks/BlockedUserTasks"
import { NewUserTasks } from "./pages/User/Tasks/NewUserTasks"
import { CompletedUserTasks } from "./pages/User/Tasks/CompletedUserTasks"
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from "./context/PrivateRoute"
import UserReport from "./pages/User/UserReport"
import { AdminLayout } from "./layout/Admin/AdminLayout"
import { Addashboard } from "./pages/Admin/Addashboard"
import { AdminProject } from "./pages/Admin/AdminProject"
import { AdminReport } from "./pages/Admin/AdminReport"
import { AdminSetting } from "./pages/Admin/AdminSetting"
import axios from "axios"


library.add(fas, fab, far);
axios.defaults.withCredentials = true;

function App() {

  
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
          <Route index element={<Welcome />} />
          <Route 
            path="useraccess"
            element={<UserAccess />} 
          />
          <Route 
            path="user"
            element={
              <PrivateRoute>
                <UserLayout />
              </PrivateRoute>
            } 
          >
            <Route 
              index
              path="dashboard"
              element={<Dashboard />} 
            />
            <Route 
              path="task"
              element={<UserTask1 />} 
            >
             <Route 
              index
              element={<AllUserTasks />} 
              /> 
             <Route 
              path="new"
              element={<NewUserTasks />} 
              /> 
             <Route 
              path="pending"
              element={<PendingUserTasks />} 
              /> 
             <Route 
              path="in-progress"
              element={<ProgressUserTasks />} 
              /> 
             <Route 
              path="completed"
              element={<CompletedUserTasks />} 
              /> 
             <Route 
              path="rejected"
              element={<BlockedUserTasks />} 
              /> 
            </Route>
            <Route 
              path="report"
              element={<UserReport />} 
            />
            <Route 
              path="settings"
              element={<UserSetting />} 
            />
          </Route>
          <Route 
            path="admin"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            } 
          >
            <Route 
              path="dashboard"
              element={<Addashboard />} 
            >
            </Route>
            <Route 
              path="project"
              element={<AdminProject />} 
            />
            <Route 
              path="report"
              element={<AdminReport />} 
            />
            <Route 
              path="settings"
              element={<AdminSetting />} 
            />        
          </Route>
        </Route>
      )
    )

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
