import {useContext, useEffect, useState} from "react";
import {SemaphoreContext} from "@/contexts/SemaphoreContextProvider";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {CgDanger} from "react-icons/cg";

export default function Chart({image, val, name, max, min}: ChartProps) {
  const {getSemaphoreCredit} = useContext(SemaphoreContext);
  // Add hydration state
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const basedZeroVal = val - min;
  const percentage = Math.floor((basedZeroVal / (max - min)) * 100);

  useEffect(() => {
    if (percentage > 90) {
      getSemaphoreCredit();
    }
  }, [percentage, getSemaphoreCredit]);

  let style;
  if (percentage > 75) style = "#FF0000";
  else if (percentage > 50) style = "#FFFF00";
  else style = "#00FF00";

  let displayValue;
  if (percentage > 100) displayValue = 100;
  else if (percentage < 0) displayValue = 0;
  else displayValue = percentage;

  // Return null or a loading state before hydration is complete
  if (!isMounted) {
    return (
      <div className="relative flex flex-col items-center w-56 gap-6 p-6 transition-all duration-150 rounded-lg shadow-2xl bg-light-card dark:bg-dark-card dark:text-dark-text lg:w-60 xl:w-64">
        <div className="w-full h-[200px] flex items-center justify-center">
          <div className="w-40 h-40 border-4 border-gray-200 rounded-full border-t-gray-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-56 gap-6 p-6 transition-all duration-150 rounded-lg shadow-2xl bg-light-card dark:bg-dark-card dark:text-dark-text lg:w-60 xl:w-64">
      {percentage > 75 && (
        <CgDanger className="absolute text-red-500 right-2 top-2 size-5 animate-ping" />
      )}
      <div style={{width: "100%", maxWidth: "200px"}}>
        <CircularProgressbarWithChildren
          value={val}
          maxValue={max}
          minValue={min}
          styles={buildStyles({
            pathColor: style,
          })}
        >
          <picture>
            <source srcSet={image.webp} type="image/webp" />
            <source srcSet={image.png} type="image/png" />
            <img
              className="size-20 xl:size-24"
              src={image.png}
              alt={name}
              loading="eager"
            />
          </picture>
          <div>
            <strong>{displayValue}%</strong> full
          </div>
        </CircularProgressbarWithChildren>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-500">
          {percentage > 75 ? "High" : percentage > 50 ? "Medium" : "Low"} waste
          level
        </p>
        <h1 className="text-xl font-extrabold">{name}</h1>
      </div>
    </div>
  );
}

interface ChartProps {
  val: number;
  image: {
    webp: string;
    png: string;
  };
  name: string;
  max: number;
  min: number;
}
