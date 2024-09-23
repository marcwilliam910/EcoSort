import "react-circular-progressbar/dist/styles.css";
import metal from "../../../../assets/metal.png";
import paper from "../../../../assets/paper.png";
import bottle from "../../../../assets/bottle.png";
import {useEffect, useState} from "react";
import {fetchData} from "../../../../firebase config/firebaseCRUD";
import {BiLoader} from "react-icons/bi";
import Chart from "./Chart";

const displayNames: Names = {
  Metal: "Metal Can",
  Paper: "Paper",
  Bottle: "Plastic Bottle",
};

interface Names {
  Metal: string;
  Paper: string;
  Bottle: string;
}

const images = {
  Metal: metal,
  Paper: paper,
  Bottle: bottle,
};

export default function Monitor() {
  const [wasteValues, setWasteValues] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function readMonitor() {
    try {
      const result = await fetchData("sensor");
      setWasteValues(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Error in monitoring:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    readMonitor();
    const intervalID = setInterval(() => {
      readMonitor();
    }, 10000);
    return () => clearInterval(intervalID);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-16 p-10 xl:gap-x-14">
      {isLoading ? (
        <div className="grid place-items-center h-52">
          <BiLoader className="size-10 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-10 xl:gap-x-14">
            {wasteValues.map((value) => (
              <Chart
                image={images[value.id as keyof typeof images]}
                val={value.data.value}
                name={displayNames[value.id as keyof Names]}
                key={value.id}
              />
            ))}
          </div>
          <div>
            <ToggleButton isSmsEnable={true} />
          </div>
        </>
      )}
    </div>
  );
}

interface ToggleButtonProps {
  isSmsEnable: boolean;
}
function ToggleButton({isSmsEnable}: ToggleButtonProps) {
  const selectedStyle = "font-bold text-blue-600 border-2 border-blue-600";

  return (
    <div className="flex w-64 text-sm border rounded-lg border-zinc-500 text-zinc-500 sm:w-72 sm:text-base">
      <button
        className={`flex-1 p-1.5 rounded-l-lg hover:text-blue-500 ${
          !isSmsEnable ? selectedStyle : ""
        }`}
      >
        Manual
      </button>
      <button
        className={`flex-1 p-1.5 rounded-r-lg hover:text-blue-500 ${
          isSmsEnable ? selectedStyle : ""
        }`}
      >
        Text Message
      </button>
    </div>
  );
}
