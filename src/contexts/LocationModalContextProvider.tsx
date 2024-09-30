import React, {createContext, useState} from "react";

const defaultContextValue = {
  isLocationModalOpen: false,
  setIsLocationModalOpen: () => {},
  handleLocationChange: () => {},
  setNewLocation: () => {},
  newLocation: "",
};

interface LocationModalType {
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLocationChange: (e: any) => void;
  setNewLocation: React.Dispatch<React.SetStateAction<string>>;
  newLocation: string;
}

export const LocationModalContext =
  createContext<LocationModalType>(defaultContextValue);

export default function LocationModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [newLocation, setNewLocation] = useState("");

  function handleLocationChange(e: any) {
    setNewLocation(e.target.value);
  }

  return (
    <LocationModalContext.Provider
      value={{
        isLocationModalOpen,
        setIsLocationModalOpen,
        setNewLocation,
        handleLocationChange,
        newLocation,
      }}
    >
      {children}
    </LocationModalContext.Provider>
  );
}
