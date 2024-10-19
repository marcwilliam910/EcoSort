import "react-circular-progressbar/dist/styles.css";
import {useContext, useEffect} from "react";
import {BiLoader} from "react-icons/bi";
import {SensorLocationContext} from "@/contexts/SensorLocationContextProvider";
import {Link} from "react-router-dom";
import location from "@/assets/png/location.png";
import locationWebp from "@/assets/webp/location.webp";
import add_location from "@/assets/png/add_location.png";
import add_locationWebp from "@/assets/webp/add_location.webp";
import {LocationModalContext} from "@/contexts/LocationModalContextProvider";
import {auth} from "@/firebase config/firebase";
import {storeTokenToDB} from "@/firebase config/firebaseMessaging";

export default function Monitor() {
  const {wasteLocationValues, isLoading} = useContext(SensorLocationContext);
  const {setIsLocationModalOpen, setNewLocation} =
    useContext(LocationModalContext);

  useEffect(() => {
    // Listen for changes in user authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If user is logged in, store FCM token to Firestore
        storeTokenToDB();
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-10 sm:gap-10 md:gap-12">
      {isLoading ? (
        <div className="grid place-items-center h-52">
          <BiLoader className="size-10 animate-spin" />
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-center text-transparent bg-gradient-to-r from-[#3B8230] to-[#1e90ff] bg-clip-text md:text-5xl md:mt-6 font-sans dark:from-[#4ca340] dark:to-[#40a0ff]">
            Locations
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-7 md:gap-10 ">
            {wasteLocationValues.map((value) => (
              <Link key={value.id} to={`/monitor/${value.id}`}>
                <div className="flex flex-col items-center gap-2 p-4 pt-0 duration-150 rounded-md cursor-pointer min-w-60 bg-light-card hover:scale-105 text-light-text sm:p-6 sm:pt-0 md:p-10 md:pt-0 md:gap-4 dark:bg-dark-card dark:text-dark-text">
                  <picture>
                    <source srcSet={locationWebp} type="image/webp" />
                    <source srcSet={location} type="image/png" />
                    <img
                      src={location}
                      alt="Location image"
                      className="size-40 sm:size-44 md:size-56 xl:size-64"
                    />
                  </picture>
                  <h2 className="text-xl font-bold sm:text-2xl">
                    {value.id.toLocaleUpperCase()}
                  </h2>
                </div>
              </Link>
            ))}
            <div
              onClick={() => {
                setNewLocation("");
                setIsLocationModalOpen(true);
              }}
            >
              <div className="flex flex-col items-center gap-2 p-4 pt-0 duration-150 rounded-md cursor-pointer min-w-60 bg-light-card hover:scale-105 text-light-text sm:p-6 sm:pt-0 md:p-10 md:pt-0 md:gap-4 dark:bg-dark-card dark:text-dark-text">
                <picture>
                  <source srcSet={add_locationWebp} type="image/webp" />
                  <source srcSet={add_location} type="image/png" />
                  <img
                    src={add_location}
                    alt="Add Location image"
                    className="size-40 sm:size-44 md:size-56 xl:size-64"
                  />
                </picture>
                <h2 className="text-xl font-bold uppercase sm:text-2xl">
                  Add location
                </h2>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
