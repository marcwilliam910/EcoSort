import React from "react";
import { MdMenuOpen, MdSaveAs, MdLogout } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { TbHeartRateMonitor } from "react-icons/tb";
import { auth } from "../../firebase config/firebase";
import { signOut } from "firebase/auth";
import { FaRecycle } from "react-icons/fa";

interface SideBarProps {
  onToggle: () => void;
  isNavOpen: boolean;
}
export default function Sidebar({ onToggle, isNavOpen }: SideBarProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div
        className={`fixed top-0 flex flex-col shadow-2xl pt-12 lg:pt-0 shadow-slate-500 items-center w-5/6 h-screen h-dvh bg-[#0A0A0A] text-white gap-8 transition-all duration-500 ease-in-out z-50 sm:w-2/4 md:w-72 lg:sticky lg:shadow ${
          isNavOpen ? "left-0" : "-left-full"
        }`}
      >
        <div className="absolute cursor-pointer top-4 left-3 lg:hidden">
          <MdMenuOpen className="size-7" onClick={onToggle} />
        </div>
        <h1 className="flex flex-col items-center gap-3 px-3 py-5 text-2xl font-bold text-green-500 font-title lg:text-3xl">
          Project ROBERT
          <FaRecycle />
        </h1>
        <ul className="flex flex-col w-full h-full text-lg mt-11">
          <List loc="/" name="Monitor" onToggle={onToggle}>
            <TbHeartRateMonitor />
          </List>
          <List loc="records" name="Record Keeping" onToggle={onToggle}>
            <MdSaveAs />
          </List>
          <List loc="notification" name="Notification" onToggle={onToggle}>
            <IoMdNotifications />
          </List>
          <div
            className="flex items-center gap-3 px-5 py-3 mt-auto duration-150 cursor-pointer hover:bg-secondaryHover"
            onClick={handleLogout}
          >
            <MdLogout className="rotate-180" />
            <p>Logout</p>
          </div>
        </ul>
      </div>
    </>
  );
}

interface ListProps {
  loc: string;
  name: string;
  children: React.ReactNode;
  onToggle: () => void;
}
function List({ loc, name, children, onToggle }: ListProps) {
  return (
    <NavLink
      to={loc}
      end
      className={({ isActive }) =>
        isActive ? "bg-secondaryHover" : "hover:bg-secondaryHover duration-150"
      }
    >
      <li className="flex items-center gap-3 px-5 py-3 " onClick={onToggle}>
        <div className="">{children}</div>
        {name}
      </li>
    </NavLink>
  );
}
