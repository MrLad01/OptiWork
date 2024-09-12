import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom"
import Welcome from "./pages/Welcome"
import UserAccess from "./pages/UserAccess"
import { UserLayout } from "./layout/User/UserLayout"
import { Dashboard } from "./pages/User/Dashboard"
import { UserTask } from "./pages/User/UserTask"
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

library.add(fas, fab, far);

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
              element={<UserTask />} 
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
            element={<UserAccess />} 
          >
            <Route 
              path="dashboard"
              element={<UserAccess />} 
            >
            </Route>
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
