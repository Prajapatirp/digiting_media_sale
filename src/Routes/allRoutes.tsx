import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard";
import TaskAllocation from "pages/TaskAllocation";
import TaskAllocationSteps from "pages/TaskAllocation/addTaskForm";

// //login
import Login from "../pages/Authentication/Login";
import MasterServices from "pages/Services/Services";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import EmailVerify from "pages/Authentication/EmailVerify";
import UpdatePassword from "pages/Authentication/UpdatePassword";
import Employee from "pages/Employee";
import Project from "pages/Project";
import Profile from "pages/Manager Profile/Profile";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/index", component: <Dashboard /> },
  { path: "/task-allocation", component: <TaskAllocation /> },
  { path: "/master-services", component: <MasterServices /> },
  { path: "/stack-holder", component: <Employee /> },
  { path: "/add-task", component: <TaskAllocationSteps /> },
  { path: "/edit-task/:id", component: <TaskAllocationSteps /> },
  { path: "/project", component: <Project /> },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
  { path: "/profile", component: <Profile /> }
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/email-verify", component: <EmailVerify /> },
  { path: "/update-password", component: <UpdatePassword /> },
];

export { authProtectedRoutes, publicRoutes };
