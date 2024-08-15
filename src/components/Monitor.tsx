import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import metal from "../assets/metal.png";
import paper from "../assets/paper.png";
import plastic from "../assets/plastic.png";
import { CgDanger } from "react-icons/cg";

export default function Monitor() {
  return (
    <div className="flex flex-wrap justify-center gap-10 p-10 xl:gap-x-14">
      <Chart image={metal} val={70} name="Metal Can" />
      <Chart image={paper} val={33} name="Paper" />
      <Chart image={plastic} val={85} name="Plastic Bottle" />
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
