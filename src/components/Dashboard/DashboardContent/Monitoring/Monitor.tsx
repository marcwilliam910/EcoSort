import "react-circular-progressbar/dist/styles.css";
import {useContext} from "react";
import {BiLoader} from "react-icons/bi";
import {SensorLocationContext} from "@/contexts/SensorLocationContextProvider";
import {Link} from "react-router-dom";
import location from "@/assets/location.png";
import add_location from "@/assets/add_location.png";
import {LocationModalContext} from "@/contexts/LocationModalContextProvider";

export default function Monitor() {
  const {wasteLocationValues, isLoading} = useContext(SensorLocationContext);
  const {setIsLocationModalOpen, setNewLocation} =
    useContext(LocationModalContext);

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
                  <img
                    src={location}
                    alt="Location image"
                    className="size-40 sm:size-44 md:size-56 xl:size-64"
                  />
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
                <img
                  src={add_location}
                  alt="Add Location image"
                  className="size-40 sm:size-44 md:size-56 xl:size-64"
                />
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
