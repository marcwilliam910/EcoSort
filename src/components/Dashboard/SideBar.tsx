import React, {useState} from "react";
import {MdMenuOpen, MdSaveAs, MdLogout} from "react-icons/md";
import {IoMdNotifications} from "react-icons/io";
import {NavLink, useNavigate} from "react-router-dom";
import {TbHeartRateMonitor} from "react-icons/tb";
import {auth} from "../../firebase config/firebase";
import {signOut} from "firebase/auth";
import {FaRecycle} from "react-icons/fa";
import {FaCaretDown, FaCaretUp} from "react-icons/fa";
import {IoIosAddCircle} from "react-icons/io";

interface SideBarProps {
  onToggleNav: () => void;
  isNavOpen: boolean;
}
export default function Sidebar({onToggleNav, isNavOpen}: SideBarProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login", {replace: true});
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div
        className={`fixed top-0 flex flex-col pt-12 p-3 lg:pt-0  items-center w-5/6 h-screen h-dvh gap-2 md:gap-5 lg:gap-8 transition-all duration-150 ease-in-out z-50 sm:w-2/4 md:w-72 lg:sticky bg-light-card dark:bg-dark-card dark:border-none ${
          isNavOpen ? "left-0" : "-left-full"
        }`}
      >
        <div className="absolute cursor-pointer top-4 left-3 lg:hidden">
          <MdMenuOpen className="size-7" onClick={onToggleNav} />
        </div>
        <h1 className="flex flex-col items-center gap-3 px-3 py-5 text-2xl font-bold text-center text-light-primary font-title lg:text-2xl dark:text-dark-primary">
          Project ROBERT
          <FaRecycle />
        </h1>

        <div className="w-5/6 border-t-2 border-zinc-300 dark:border-zinc-600"></div>

        <ul className="flex flex-col w-full h-full gap-1 text-lg mt-11 text-light-text dark:text-dark-text">
          <List
            loc="/"
            name="Monitor"
            onToggle={onToggleNav}
            submenu={[
              {loc: "/monitor/canteen", name: "Canteen"},
              {loc: "/monitor/he-building", name: "HE Building"},
            ]}
          >
            <TbHeartRateMonitor />
          </List>
          <List loc="records" name="Record Keeping" onToggle={onToggleNav}>
            <MdSaveAs />
          </List>
          <List loc="notification" name="Notification" onToggle={onToggleNav}>
            <IoMdNotifications />
          </List>
          <div
            className="flex items-center gap-3 px-5 py-2.5 mt-auto duration-150 rounded-lg cursor-pointer hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover"
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
  submenu?: {
    loc: string;
    name: string;
  }[];
}
function List({loc, name, children, onToggle, submenu = []}: ListProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmenuOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <li
      className="flex flex-col"
      onClick={submenu.length > 0 ? handleSubmenuOpen : undefined}
    >
      <NavLink
        to={loc}
        end
        className={({isActive}) =>
          isActive
            ? "bg-light-primaryFocusBG/30 rounded-lg text-light-primary font-semibold dark:bg-light-primaryFocusBG/30 dark:text-dark-primary"
            : "hover:bg-light-primaryHover rounded-lg duration-150 dark:hover:bg-dark-primaryHover"
        }
      >
        <div
          className="flex items-center justify-between px-5 py-2.5 cursor-pointer"
          onClick={submenu.length > 0 ? undefined : onToggle}
        >
          <div className="flex items-center gap-3 ">
            {children}
            {name}
          </div>
          {submenu.length > 0 && (isOpen ? <FaCaretUp /> : <FaCaretDown />)}
        </div>
      </NavLink>

      <div
        className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-44 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Submenu inside <li> */}
        {submenu.length > 0 && (
          <div className="my-4">
            <ul className="pl-2 space-y-1 text-sm border-l-2 border-zinc-300 ml-11 dark:border-zinc-600">
              {submenu.map((subItem) => (
                <NavLink
                  key={subItem.name}
                  to={subItem.loc}
                  className={({isActive}) =>
                    isActive
                      ? "bg-light-primaryFocusBG/30 pl-2 block rounded-lg text-light-primary font-semibold dark:bg-light-primaryFocusBG/30 dark:text-dark-primary"
                      : "hover:bg-light-primaryHover pl-2 duration-150 block rounded-lg dark:hover:bg-dark-primaryHover"
                  }
                >
                  <li className="py-2.5 pl-1">{subItem.name}</li>
                </NavLink>
              ))}
              <li className="py-2.5 pl-2 flex items-center gap-5">
                <p>Add Location</p>
                <IoIosAddCircle className="size-4" />
              </li>
            </ul>
          </div>
        )}
      </div>
    </li>
  );
}
