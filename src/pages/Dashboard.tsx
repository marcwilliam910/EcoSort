import { useState, useEffect } from "react";
import SideBar from "../components/Dashboard/SideBar";
import DashboardContent from "../components/Dashboard/DashboardContent";
import { successToast } from "../utils/Toast";
import { ToastContainer } from "react-toastify";

export default function Dashboard() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  function toggleNav() {
    setIsNavOpen(!isNavOpen);
  }

  useEffect(() => {
    successToast("Sign In Success");
  }, []);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        theme="colored"
        hideProgressBar={true}
      />
      <div className="lg:flex">
        <SideBar onToggle={toggleNav} isNavOpen={isNavOpen} />
        <div className="relative w-full lg:flex-1">
          <DashboardContent onToggle={toggleNav} />
        </div>
      </div>
    </>
  );
}
