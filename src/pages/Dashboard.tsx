import {useState, useEffect} from "react";
import SideBar from "../components/Dashboard/SideBar";
import DashboardContent from "../components/Dashboard/DashboardContent/DashboardContent";
import {successToast} from "../utils/Toast";
import {ToastContainer} from "react-toastify";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase config/firebase";
import {useLocation, useNavigate} from "react-router-dom";
import {storeTokenToDB} from "@/firebase config/firebaseMessaging";
import ThemeContextProvider from "@/contexts/ThemeContextProvider";

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
        navigate("/login", {replace: true});
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    storeTokenToDB();
  }, []);

  return (
    <ThemeContextProvider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        theme="colored"
        hideProgressBar={true}
      />
      <div className="lg:flex">
        <SideBar onToggleNav={toggleNav} isNavOpen={isNavOpen} />
        <div className="relative w-full lg:flex-1">
          <DashboardContent onToggleNav={toggleNav} />
        </div>
      </div>
    </ThemeContextProvider>
  );
}
