import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import metal from "../assets/metal.png";
import paper from "../assets/paper.png";
import bottle from "../assets/bottle.png";
import { CgDanger } from "react-icons/cg";
import { useEffect, useState } from "react";
import { fetchData } from "../config/firebase";

export default function Monitor() {
  const [wasteValues, setWasteValues] = useState<Array<any>>([]);

  const images = {
    "Metal Can": metal,
    Paper: paper,
    "Plastic Bottle": bottle,
  };

  async function readMonitor() {
    try {
      const result = await fetchData("sensor");
      setWasteValues(result);
    } catch (error) {}
  }

  useEffect(() => {
    readMonitor();
    const intervalID = setInterval(() => {
      readMonitor();
    }, 10000);

    return () => clearInterval(intervalID);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-10 p-10 xl:gap-x-14">
      {wasteValues.map((value) => (
        <Chart
          image={images[value.id as keyof typeof images]}
          val={value.value}
          name={value.id}
          key={value.id}
        />
      ))}
    </div>
  );
}

interface ChartProps {
  val: number;
  image: string;
  name: string;
}

function Chart({ image, val, name }: ChartProps) {
  let style;
  if (val > 75) style = "#FF0000";
  else if (val > 50) style = "#FFFF00";
  else style = "#00FF00";

  return (
    <div className="relative flex flex-col items-center w-56 gap-6 p-6 duration-150 shadow-2xl lg:w-60 xl:w-64 hover:scale-105">
      {val > 75 && (
        <CgDanger className="absolute text-red-500 right-2 top-2 size-5 animate-ping" />
      )}
      <CircularProgressbarWithChildren
        value={val}
        styles={buildStyles({
          pathColor: style,
        })}
      >
        <img className="size-20 xl:size-24" src={image} alt="trash bin" />
        <div>
          <strong>{val > 100 ? "100" : val}%</strong> full
        </div>
      </CircularProgressbarWithChildren>
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-500">
          {val > 75 ? "High" : val > 50 ? "Medium" : "Low"} waste level
        </p>
        <h1 className="text-xl font-extrabold">{name}</h1>
      </div>
    </div>
  );
}
