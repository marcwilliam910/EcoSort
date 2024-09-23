import React, {createContext, useEffect, useState} from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const defaultContextValue: ThemeContextType = {
  isDarkMode: false,
  toggleTheme: () => {},
};

export const ThemeContext =
  createContext<ThemeContextType>(defaultContextValue);

export default function ThemeContextProvider({children}: Prop) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleTheme() {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }
  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

interface Prop {
  children: React.ReactNode;
}
