import {RiMenu3Line} from "react-icons/ri";
import {Outlet} from "react-router-dom";
import {FaRegMoon} from "react-icons/fa";
import {MdOutlineLightMode} from "react-icons/md";

import SemaphoreContextProvider from "@/contexts/SemaphoreContextProvider";
import {ThemeContext} from "@/contexts/ThemeContextProvider";
import {useContext} from "react";

interface DashboardContentProps {
  onToggleNav: () => void;
}

export default function DashboardContent({onToggleNav}: DashboardContentProps) {
  const {isDarkMode, toggleTheme} = useContext(ThemeContext);

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-10 flex items-center px-3 py-3.5 dark:bg-dark-card dark:border-none dark:shadow-lg sm:px-4 lg:p-5 bg-light-card shadow-md dark:text-dark-text text-light-text transition-all duration-150">
        <div className="w-8">
          <RiMenu3Line
            onClick={onToggleNav}
            className="cursor-pointer lg:hidden size-6"
          />
        </div>
        <h1 className="flex-1 text-lg font-bold text-center sm:text-xl md:text-2xl lg:text-2xl dark:text-dark-primary text-light-primary">
          SmartSeg
        </h1>
        <div
          className="p-2.5 rounded-full cursor-pointer hover:bg-[#d6d7dbe2] dark:hover:bg-[#343A46] text-light-text dark:text-dark-text duration-150"
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <MdOutlineLightMode className="size-5" />
          ) : (
            <FaRegMoon className="size-5" />
          )}
        </div>
      </header>

      <SemaphoreContextProvider>
        <Outlet />
      </SemaphoreContextProvider>
    </>
  );
}
