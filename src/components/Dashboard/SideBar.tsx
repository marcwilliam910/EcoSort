import React, {useContext, useState} from "react";
import {MdMenuOpen, MdSaveAs, MdLogout} from "react-icons/md";
import {IoMdNotifications} from "react-icons/io";
import {NavLink, useNavigate} from "react-router-dom";
import {TbHeartRateMonitor} from "react-icons/tb";
import {auth} from "../../firebase config/firebase";
import {signOut} from "firebase/auth";
import {FaCaretDown, FaCaretUp} from "react-icons/fa";
import {IoIosAddCircle} from "react-icons/io";
import {SensorLocationContext} from "@/contexts/SensorLocationContextProvider";
import {deleteData} from "@/firebase config/firebaseCRUD";
import {deleteAlert, errorAlert} from "@/utils/SweetAlerts";
import {ThemeContext} from "@/contexts/ThemeContextProvider";
import {IoMdRemove} from "react-icons/io";
import smartseg_logo from "@/assets/png/smartseg_logo.png";

interface SideBarProps {
  onToggleNav: () => void;
  isNavOpen: boolean;
  setIsLocationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewLocation: React.Dispatch<React.SetStateAction<string>>;
}
export default function Sidebar({
  onToggleNav,
  isNavOpen,
  setIsLocationModalOpen,
  setNewLocation,
}: SideBarProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/login", {replace: true});
    } catch (error) {
      console.error(error);
    }
  }

  const {wasteLocationValues} = useContext(SensorLocationContext);

  return (
    <>
      <nav
        className={`fixed top-0 flex flex-col pt-12 p-3 lg:pt-0 items-center w-5/6 h-dvh lg:h-screen  gap-2 md:gap-5 lg:gap-2 transition-all duration-150 ease-in-out z-50 sm:w-2/4 md:w-72 lg:sticky bg-light-card dark:bg-dark-card dark:border-none ${
          isNavOpen ? "left-0" : "-left-full"
        }`}
      >
        <div className="absolute cursor-pointer top-4 left-3 lg:hidden">
          <MdMenuOpen className="size-7" onClick={onToggleNav} />
        </div>

        <img src={smartseg_logo} alt="smartseg logo" className="w-40" />

        <div className="w-5/6 border-t-2 border-zinc-300 dark:border-zinc-600"></div>

        <ul className="flex flex-col w-full h-full gap-1 text-lg mt-11 text-light-text dark:text-dark-text">
          <List
            loc="/"
            name="Monitor"
            onToggle={onToggleNav}
            submenu={wasteLocationValues}
            setIsLocationModalOpen={setIsLocationModalOpen}
            setNewLocation={setNewLocation}
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
      </nav>
    </>
  );
}

interface DocumentType {
  Metal: number;
  Paper: number;
  Bottle: number;
}

interface ListProps {
  loc: string;
  name: string;
  children: React.ReactNode;
  onToggle: () => void;
  submenu?:
    | {
        id: string;
        data: DocumentType;
      }[]
    | null;
  setIsLocationModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setNewLocation?: React.Dispatch<React.SetStateAction<string>>;
}
function List({
  loc,
  name,
  children,
  onToggle,
  submenu = null,
  setIsLocationModalOpen,
  setNewLocation,
}: ListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {getSubMenus} = useContext(SensorLocationContext);
  const {isDarkMode} = useContext(ThemeContext);
  const navigate = useNavigate();

  function handleSubmenuOpen(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  }

  async function handleDeleteLocation(location: string) {
    const permission = await deleteAlert(isDarkMode);
    if (permission) {
      try {
        await deleteData("sensor", location);
        getSubMenus();
        navigate("/");
      } catch (error) {
        errorAlert("Failed to delete location", isDarkMode);
      }
    }
  }

  return (
    <li className="flex flex-col">
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
          onClick={onToggle}
        >
          <div className="flex items-center gap-3 ">
            {children}
            {name}
          </div>
          {submenu &&
            (isOpen ? (
              <FaCaretUp
                onClick={handleSubmenuOpen}
                className="duration-150 size-5 hover:scale-125 hover:text-light-primary dark:hover:text-dark-primary"
              />
            ) : (
              <FaCaretDown
                onClick={handleSubmenuOpen}
                className="duration-150 size-5 hover:scale-125 hover:text-light-primary dark:hover:text-dark-primary"
              />
            ))}
        </div>
      </NavLink>

      {/* Submenu inside <li> */}
      <div
        className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-44 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="py-4 my-2">
          <ul className="pl-2 space-y-1 text-sm border-l-2 border-zinc-300 ml-11 dark:border-zinc-600">
            {submenu && submenu.length > 0 && (
              <>
                {submenu.map((subItem) => (
                  <NavLink
                    key={subItem.id}
                    to={`/monitor/${subItem.id}`}
                    className={({isActive}) =>
                      isActive
                        ? "bg-light-primaryFocusBG/30 px-2 rounded-lg text-light-primary font-semibold dark:bg-light-primaryFocusBG/30 dark:text-dark-primary flex justify-between items-center"
                        : "hover:bg-light-primaryHover px-2 duration-150 rounded-lg items-center dark:hover:bg-dark-primaryHover flex justify-between"
                    }
                  >
                    <li className="py-2.5 pl-1" onClick={onToggle}>
                      {subItem.id.toLocaleUpperCase()}
                    </li>
                    <IoMdRemove
                      className="hover:text-light-primaryFocusBG dark:hover:text-dark-primary md:text-xl"
                      onClick={() => handleDeleteLocation(subItem.id)}
                    />
                  </NavLink>
                ))}
              </>
            )}
            <li
              className="py-2.5 pl-2 flex items-center gap-4 cursor-pointer hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover rounded-lg group"
              onClick={
                setIsLocationModalOpen && setNewLocation
                  ? () => {
                      setNewLocation("");
                      setIsLocationModalOpen(true);
                    }
                  : undefined
              }
            >
              <p>Add Location</p>
              <IoIosAddCircle className="duration-150 size-4 group-hover:scale-125 group-hover:text-light-primary dark:group-hover:text-dark-primary" />
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
}
