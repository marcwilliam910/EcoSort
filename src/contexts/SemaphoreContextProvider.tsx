import useFetchSemaphore from "@/custom/useFetchSemaphore";
import React, {createContext} from "react";

const defaultValue: SemaphoreContextType = {
  semaphoreCredits: 0,
  error: null,
  loading: false,
  getSemaphoreCredit: async () => {},
};

export const SemaphoreContext =
  createContext<SemaphoreContextType>(defaultValue);

export default function SemaphoreContextProvider({children}: Prop) {
  const {data, error, loading, getSemaphoreCredit} =
    useFetchSemaphore<Semaphore>("getSemaphoreAccountData");

  return (
    <SemaphoreContext.Provider
      value={{
        semaphoreCredits: data?.balance,
        error,
        loading,
        getSemaphoreCredit,
      }}
    >
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
  semaphoreCredits: number | undefined;
  error: string | null;
  loading: boolean;
  getSemaphoreCredit: () => Promise<void>;
}
