import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard";
import Stock from "pages/Stock";
import StockDetail from "pages/Stock/stockDetails";
import TaskAllocation from "pages/TaskAllocation";
import TaskAllocationSteps from "pages/TaskAllocation/addTaskForm";

// //login
import Login from "../pages/Authentication/Login";
import MasterServices from "pages/Services/Services";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import EmailVerify from "pages/Authentication/EmailVerify";
import UpdatePassword from "pages/Authentication/UpdatePassword";
import Employee from "pages/Employee";
import Expanse from "pages/Expanse";
import Project from "pages/Project";
import Profile from "pages/Manager Profile/Profile";
import StockType from "pages/Stock Type/StockType";
import Report from "pages/Report/Report";
import Pdf from "pages/Report/Pdf";
import Contactus from "pages/Inquiry/ContactUs";
import StockReport from "pages/Report/StockReport";
import ExpanseReport from "pages/Report/ExpanseReport";
import ChannelPartner from "pages/Inquiry/ChannelPartner";
import Redevelopment from "pages/Inquiry/Redevelopment";
import PartnerWithUs from "pages/Inquiry/PartnerWithUs";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/index", component: <Dashboard /> },
  { path: "/stock", component: <Stock /> },
  { path: "/stock-detail/:id", component: <StockDetail /> },
  { path: "/task-allocation", component: <TaskAllocation /> },
  { path: "/master-services", component: <MasterServices /> },
  { path: "/stack-holder", component: <Employee /> },
  { path: "/expense", component: <Expanse /> },
  { path: "/add-task", component: <TaskAllocationSteps /> },
  { path: "/edit-task/:id", component: <TaskAllocationSteps /> },
  { path: "/project", component: <Project /> },
  { path: "/stocktype", component: <StockType /> },
  { path: "/report", component: <Report /> },
  { path: "/expenseReport", component: <ExpanseReport /> },
  { path: "/stockReport", component: <StockReport /> },
  { path: "/contactus", component: <Contactus /> },
  { path: "/channelpartner", component: <ChannelPartner /> },
  { path: "/redevelopment", component: <Redevelopment /> },
  { path: "/partnerwithus", component: <PartnerWithUs /> },
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
  { path: "/profile", component: <Profile /> }
];

const publicRoutes = [
  { path: "/pdf", component: <Pdf /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/email-verify", component: <EmailVerify /> },
  { path: "/update-password", component: <UpdatePassword /> },
];

export { authProtectedRoutes, publicRoutes };
