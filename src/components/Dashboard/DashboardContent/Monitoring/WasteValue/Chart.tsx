import {SemaphoreContext} from "@/contexts/SemaphoreContextProvider";
import {useContext, useEffect} from "react";
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import {CgDanger} from "react-icons/cg";

export default function Chart({image, val, name, max, min}: ChartProps) {
  const {getSemaphoreCredit} = useContext(SemaphoreContext);

  const basedZeroVal = val - min;
  const percentage = Math.floor((basedZeroVal / (max - min)) * 100);

  useEffect(() => {
    let percentage = Math.floor((basedZeroVal / (max - min)) * 100);

    if (percentage > 90) getSemaphoreCredit();
  }, [val, max]);

  let style;
  if (percentage > 75) style = "#FF0000";
  else if (percentage > 50) style = "#FFFF00";
  else style = "#00FF00";

  // for chart max value text
  let displayValue;
  if (percentage > 100) displayValue = 100;
  else if (percentage < 0) displayValue = 0;
  else displayValue = percentage;

  return (
    <div className="relative flex flex-col items-center w-56 gap-6 p-6 transition-all duration-150 rounded-lg shadow-2xl bg-light-card dark:bg-dark-card dark:text-dark-text lg:w-60 xl:w-64">
      {percentage > 75 && (
        <CgDanger className="absolute text-red-500 right-2 top-2 size-5 animate-ping" />
      )}
      <CircularProgressbarWithChildren
        maxValue={max}
        minValue={min}
        value={min > val ? 0 : val}
        styles={buildStyles({
          pathColor: style,
        })}
      >
        <picture>
          <source srcSet={image.webp} type="image/webp" />
          <img className="size-20 xl:size-24" src={image.png} alt={name} />
        </picture>
        <div>
          <strong>{displayValue}%</strong> full
        </div>
      </CircularProgressbarWithChildren>
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
