import useFetchSemaphore from "@/custom/useFetchSemaphore";
import React, {createContext} from "react";

const defaultValue: SemaphoreContextType = {
  semaphoreData: null,
  error: null,
  loading: false,
};

export const SemaphoreContext =
  createContext<SemaphoreContextType>(defaultValue);

export default function SemaphoreContextProvider({children}: Prop) {
  const {data, error, loading} = useFetchSemaphore<Semaphore>(
    "getSemaphoreAccountData"
  );

  return (
    <SemaphoreContext.Provider value={{semaphoreData: data, error, loading}}>
      {children}
    </SemaphoreContext.Provider>
  );
}

interface Prop {
  children: React.ReactNode;
}

interface Semaphore {
  balance: number;
}

interface SemaphoreContextType {
  semaphoreData: Semaphore | null;
  error: string | null;
  loading: boolean;
}
