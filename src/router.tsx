import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import ErrorSkeleton from "./components/Skeleton/ErrorSkeleton";
import {BiLoader} from "react-icons/bi";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Monitor = lazy(
  () => import("./components/Dashboard/DashboardContent/Monitoring/Monitor")
);
const RecordKeeping = lazy(
  () =>
    import(
      "./components/Dashboard/DashboardContent/RecordKeeping/RecordKeeping"
    )
);
const Notification = lazy(
  () =>
    import("./components/Dashboard/DashboardContent/Notification/Notification")
);
const Error = lazy(() => import("./pages/Error"));
const WasteValue = lazy(
  () =>
    import(
      "./components/Dashboard/DashboardContent/Monitoring/WasteValue/WasteValue"
    )
);

function Loader() {
  return (
    <div className="grid h-72 place-items-center dark:text-dark-text ">
      <BiLoader className="size-10 animate-spin md:size-16" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <Dashboard />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<ErrorSkeleton />}>
        <Error />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Monitor />
          </Suspense>
        ),
      },
      {
        path: "monitor",
        children: [
          {
            path: ":location",
            element: (
              <Suspense fallback={<Loader />}>
                <WasteValue />
              </Suspense>
            ),
            errorElement: (
              <Suspense fallback={<ErrorSkeleton />}>
                <Error />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "records",
        element: (
          <Suspense fallback={<Loader />}>
            <RecordKeeping />
          </Suspense>
        ),
      },
      {
        path: "notification",
        element: (
          <Suspense fallback={<Loader />}>
            <Notification />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<ErrorSkeleton />}>
        <Error />
      </Suspense>
    ),
  },
]);
