import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import DashboardContent from "../components/DashboardContent";
import { toast, ToastContainer } from "react-toastify";

export default function Dashboard() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  function toggleNav() {
    setIsNavOpen(!isNavOpen);
  }

  useEffect(() => {
    toast.success("Sign In Success", {
      position: "top-center",
      autoClose: 5000,
      closeOnClick: true,
    });
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
