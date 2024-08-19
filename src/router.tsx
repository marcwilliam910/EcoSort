import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Monitor from "./components/Dashboard/DashboardContent/Monitoring/Monitor";
import RecordKeeping from "./components/Dashboard/DashboardContent/RecordKeeping/RecordKeeping";
import Settings from "./components/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <Monitor />,
      },
      {
        path: "monitor",
        element: <Monitor />,
      },
      {
        path: "records",
        element: <RecordKeeping />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);
