import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Monitor from "./components/Dashboard/DashboardContent/Monitoring/Monitor";
import RecordKeeping from "./components/Dashboard/DashboardContent/RecordKeeping/RecordKeeping";
import Notification from "./components/Notification/Notification";
import Error from "./pages/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Monitor />,
      },
      {
        path: "records",
        element: <RecordKeeping />,
      },
      {
        path: "notification",
        element: <Notification />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
]);
