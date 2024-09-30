import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {RouterProvider} from "react-router-dom";
import {router} from "./router";
import LocationModalContextProvider from "./contexts/LocationModalContextProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <LocationModalContextProvider>
    <RouterProvider router={router} />
  </LocationModalContextProvider>
  // </React.StrictMode>
);
