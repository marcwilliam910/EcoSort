import {useContext, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import metal from "@/assets/png/metal.png";
import paper from "@/assets/png/paper.png";
import bottle from "@/assets/png/bottle.png";
import metalWebp from "@/assets/webp/metal.webp";
import paperWebp from "@/assets/webp/paper.webp";
import bottleWebp from "@/assets/webp/bottle.webp";
import Chart from "./Chart";
import {SensorLocationContext} from "@/contexts/SensorLocationContextProvider";
import {IoChevronBackOutline} from "react-icons/io5";
import {fetchSingleDocument} from "@/firebase config/firebaseCRUD";
import {errorAlert} from "@/utils/SweetAlerts";
import {ThemeContext} from "@/contexts/ThemeContextProvider";
import {BiLoader} from "react-icons/bi";

interface Names {
  Metal: string;
  Paper: string;
  Bottle: string;
}
const displayNames: Names = {
  Metal: "Metal Can",
  Paper: "Paper",
  Bottle: "Plastic Bottle",
};
const images = {
  Metal: {png: metal, webp: metalWebp},
  Paper: {png: paper, webp: paperWebp},
  Bottle: {png: bottle, webp: bottleWebp},
};

interface WasteValue extends GenericValue {
  id: string;
}

interface GenericValue {
  Paper: number;
  Bottle: number;
  Metal: number;
}

export default function WasteValue() {
  const [wasteValues, setWasteValues] = useState<WasteValue>({
    id: "",
    Paper: 0,
    Bottle: 0,
    Metal: 0,
  });
  const {location} = useParams();
  const navigate = useNavigate();
  const {isDarkMode} = useContext(ThemeContext);
  const {isLoading, wasteLocationValues} = useContext(SensorLocationContext);

  const wasteTypes = [
    {
      image: images["Paper"],
      val: wasteValues.Paper,
      name: displayNames["Paper"],
      max: 180,
      min: 138,
    },
    {
      image: images["Metal"],
      val: wasteValues.Metal,
      name: displayNames["Metal"],
      max: 230,
      min: 103,
    },
    {
      image: images["Bottle"],
      val: wasteValues.Bottle,
      name: displayNames["Bottle"],
      max: 105,
      min: 73,
    },
  ];

  async function getWasteValues() {
    try {
      if (location) {
        const values = await fetchSingleDocument<GenericValue>(
          "sensor",
          location
        );
        setWasteValues(values);
      }
    } catch (e) {
      errorAlert("Error fetching waste location values", isDarkMode);
    }
  }

  const wasteValue = wasteLocationValues.find(
    (waste) => waste.id.toLocaleLowerCase() === location?.toLocaleLowerCase()
  );

  useEffect(() => {
    if (!wasteValue) return;

    getWasteValues();

    const id = setInterval(() => {
      getWasteValues();
    }, 15000);

    return () => clearInterval(id);
  }, [location, wasteValue]);

  useEffect(() => {
    if (!wasteValue && !isLoading) {
      navigate("/error");
    }
  }, [wasteValue, location, navigate, isLoading]);

  return (
    <div className="relative flex flex-col justify-center p-10 gap-7 md:gap-y-14">
      {isLoading ? (
        <div className="grid place-items-center h-52 dark:text-dark-text">
          <BiLoader className="size-10 animate-spin md:size-16" />
        </div>
      ) : (
        <>
          <Link
            to={`/`}
            className="absolute top-4 left-3 sm:top-5 sm:left-5 md:top-10 md:left-10"
          >
            <IoChevronBackOutline className="duration-150 cursor-pointer size-5 text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary sm:size-6 md:size-7" />
          </Link>

          <h1 className="text-4xl font-extrabold text-center text-transparent bg-gradient-to-r from-[#3B8230] to-[#1e90ff] bg-clip-text md:text-5xl md:mt-6 font-sans dark:from-[#4ca340] dark:to-[#40a0ff] mt-2">
            {location?.toLocaleUpperCase()}
          </h1>

          <div className="flex flex-wrap justify-center gap-10 xl:gap-x-14">
            {wasteTypes.map((waste) => (
              <Chart {...waste} key={waste.name} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
