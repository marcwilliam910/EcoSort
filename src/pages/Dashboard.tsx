import {useState, useEffect, useContext} from "react";
import {successToast} from "../utils/Toast";
import {ToastContainer} from "react-toastify";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase config/firebase";
import {useLocation, useNavigate} from "react-router-dom";
import {storeTokenToDB} from "@/firebase config/firebaseMessaging";
import ThemeContextProvider from "@/contexts/ThemeContextProvider";
import SensorLocationContextProvider from "@/contexts/SensorLocationContextProvider";
import {LocationModalContext} from "@/contexts/LocationModalContextProvider";
import SideBar from "../components/Dashboard/SideBar";
import DashboardContent from "../components/Dashboard/DashboardContent/DashboardContent";
import Modal from "@/components/shared/Modal";
import Label from "@/components/shared/Label";
import Input from "@/components/shared/Input";
import {BiLoader} from "react-icons/bi";

const defaultField = {
  Paper: 0,
  PaperValid: true,
  Metal: 0,
  MetalValid: true,
  Bottle: 0,
  BottleValid: true,
};

export default function Dashboard() {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const fromLogin = location.state?.fromLogin;

  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    newLocation,
    handleLocationChange,
    setNewLocation,
  } = useContext(LocationModalContext);

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
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setTimeout(() => {
          storeTokenToDB().catch((error) => {
            console.error("Error in storeTokenToDB:", error);
          });
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="grid h-screen place-items-center dark:text-dark-text ">
        <BiLoader className="size-10 animate-spin md:size-16" />
      </div>
    );
  }

  return (
    <SensorLocationContextProvider>
      <ThemeContextProvider>
        <ToastContainer
          position="top-center"
          autoClose={4000}
          theme="colored"
          hideProgressBar={true}
        ></ToastContainer>
        <main className="relative lg:flex">
          {isLocationModalOpen && (
            <Modal
              formData={{id: "", data: defaultField}}
              isEditing={false}
              setIsModalOpen={setIsLocationModalOpen}
              readRecord={() => null}
              title="Location"
              collectionName="sensor"
              documentName={newLocation}
            >
              <div>
                <Label html="location" value="Location" />
                <Input
                  type="text"
                  id="location"
                  onChange={handleLocationChange}
                  value={newLocation}
                />
              </div>
            </Modal>
          )}
          <SideBar
            onToggleNav={toggleNav}
            isNavOpen={isNavOpen}
            setIsLocationModalOpen={setIsLocationModalOpen}
            setNewLocation={setNewLocation}
          />

          <div className="relative w-full lg:flex-1">
            <DashboardContent onToggleNav={toggleNav} />
          </div>
        </main>
      </ThemeContextProvider>
    </SensorLocationContextProvider>
  );
}
