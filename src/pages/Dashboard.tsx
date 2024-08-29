import { useState, useEffect } from "react";
import SideBar from "../components/Dashboard/SideBar";
import DashboardContent from "../components/Dashboard/DashboardContent/DashboardContent";
import { successToast, warningToast } from "../utils/Toast";
import { ToastContainer } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth, messaging, sendPushNotification } from "../config/firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { onMessage } from "firebase/messaging";

export default function Dashboard() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fromLogin = location.state?.fromLogin;

  function toggleNav() {
    setIsNavOpen(!isNavOpen);
  }

  useEffect(() => {
    if (fromLogin) {
      successToast("Sign In Success");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    sendPushNotification();
    onMessage(messaging, (payload) => {
      warningToast(payload.notification?.body);
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
