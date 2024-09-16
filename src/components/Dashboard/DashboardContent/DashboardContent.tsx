import { RiMenu3Line } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import yesLogo from "../../../../src/assets/yes_o_logo.png";
import iba from "../../../assets/iba-logo.png";

interface DashboardContentProps {
  onToggle: () => void;
}

export default function DashboardContent({ onToggle }: DashboardContentProps) {
  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-10 flex items-center px-3 py-4 text-white shadow-lg bg-[#0A0A0A] sm:px-4 lg:p-5">
        <div className="w-10">
          <RiMenu3Line
            onClick={onToggle}
            className="cursor-pointer lg:hidden size-6"
          />
        </div>
        <h1 className="flex-1 text-lg font-bold text-center sm:text-xl md:text-2xl lg:text-[1.7rem] ">
          EcoSort
        </h1>
        <div className="flex gap-1">
          <img
            src={yesLogo}
            alt="Yes-O logo"
            className="object-cover size-6 sm:size-8"
          />

          <img
            src={iba}
            alt="iba highschool logo"
            className="object-cover bg-white rounded-full size-6 sm:size-8"
          />
        </div>
      </div>

      <Outlet />
    </>
  );
}
