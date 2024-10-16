import {fetchData} from "@/firebase config/firebaseCRUD";
import {errorAlert} from "@/utils/SweetAlerts";
import React, {createContext, useContext, useEffect, useState} from "react";
import {ThemeContext} from "./ThemeContextProvider";

interface SensorLocationType {
  wasteLocationValues: {
    id: string;
    data: DocumentType;
  }[];
  getSubMenus: () => void;
  isLoading: boolean;
}

const initialContextValues: SensorLocationType = {
  wasteLocationValues: [
    {
      id: "",
      data: {
        Metal: 0,
        Paper: 0,
        Bottle: 0,
      },
    },
  ],
  getSubMenus: () => {},
  isLoading: false,
};

const initialWasteLocationValue = [
  {
    id: "",
    data: {
      Metal: 0,
      Paper: 0,
      Bottle: 0,
    },
  },
];

interface DocumentType {
  Metal: number;
  Paper: number;
  Bottle: number;
}

export const SensorLocationContext = createContext(initialContextValues);

export default function SensorLocationContextProvider({children}: Prop) {
  const [wasteLocationValues, setWasteLocationValues] = useState(
    initialWasteLocationValue
  );
  const [isLoading, setIsLoading] = useState(true);
  const {isDarkMode} = useContext(ThemeContext);

  async function getSubMenus() {
    try {
      setIsLoading(true);
      const subMenus = await fetchData<DocumentType>("sensor");
      setWasteLocationValues(subMenus);
    } catch (error) {
      errorAlert("Error in getting SubMenu Locations", isDarkMode);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const id = setTimeout(() => {
      getSubMenus();
    }, 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <SensorLocationContext.Provider
      value={{wasteLocationValues, getSubMenus, isLoading}}
    >
      {children}
    </SensorLocationContext.Provider>
  );
}

interface Prop {
  children: React.ReactNode;
}
