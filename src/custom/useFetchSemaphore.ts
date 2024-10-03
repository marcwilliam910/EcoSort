import {auth, functions} from "@/firebase config/firebase";
import {onAuthStateChanged} from "firebase/auth";
import {httpsCallable} from "firebase/functions";
import {useCallback, useEffect, useState} from "react";

export default function useFetchSemaphore<T>(functionName: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const CACHE_KEY = "semaphoreCache";
  const CACHE_EXPIRY = 60 * 1000; // 1 minute cache expiry

  const getSemaphoreCredit = useCallback(async () => {
    const cachedSemaphoreData = localStorage.getItem(CACHE_KEY);

    if (cachedSemaphoreData) {
      try {
        const cachedData = JSON.parse(cachedSemaphoreData);
        const now = new Date().getTime();

        if (now - cachedData.timestamp < CACHE_EXPIRY) {
          setData(cachedData.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Error parsing cached data:", err);
      }
    }

    try {
      setLoading(true);
      setError(null);

      const semaphoreData = httpsCallable(functions, functionName);
      const result = await semaphoreData();
      const newData = result.data as T;
      setData(newData);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: new Date().getTime(),
          data: newData,
        })
      );
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [functionName]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Delay the token storage slightly to ensure Firebase is fully initialized
        setTimeout(() => {
          getSemaphoreCredit();
        }, 1000);
      } else {
        // Clear data when user logs out
        setData(null);
        setError(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {data, error, loading, getSemaphoreCredit};
}
