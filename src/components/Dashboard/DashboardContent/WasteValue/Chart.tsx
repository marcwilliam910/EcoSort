import {
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import {CgDanger} from "react-icons/cg";

export default function Chart({image, val, name}: ChartProps) {
  let style;
  if (val > 75) style = "#FF0000";
  else if (val > 50) style = "#FFFF00";
  else style = "#00FF00";

  return (
    <div className="relative flex flex-col items-center w-56 gap-6 p-6 transition-all duration-150 rounded-lg shadow-2xl bg-light-card dark:bg-dark-card dark:text-dark-text lg:w-60 xl:w-64">
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

interface ChartProps {
  val: number;
  image: string;
  name: string;
}
