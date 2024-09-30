import {auth, functions} from "@/firebase config/firebase";
import {onAuthStateChanged} from "firebase/auth";
import {httpsCallable} from "firebase/functions";
import {useEffect, useState} from "react";

export default function useFetchSemaphore<T>(functionName: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const CACHE_KEY = "semaphoreCache";
  const CACHE_EXPIRY = 60 * 1000; // 1 minute cache expiry

  async function getSemaphoreData() {
    setLoading(true);
    setError(null);

    try {
      const semaphoreData = httpsCallable(functions, functionName);
      const result = await semaphoreData();
      setData(result.data as T);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: new Date().getTime(),
          data: result.data as T,
        })
      );
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const cachedDataString = localStorage.getItem(CACHE_KEY);

    if (cachedDataString) {
      // Check if data exists in localStorage
      const cachedData = JSON.parse(cachedDataString);
      const now = new Date().getTime();

      if (now - cachedData.timestamp < CACHE_EXPIRY) {
        // Use cached data if it's not expired
        setData(cachedData.data);
        return; // Return early if cached data is used
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Delay the token storage slightly to ensure Firebase is fully initialized
        setTimeout(() => {
          getSemaphoreData();
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, []);

  return {data, error, loading};
}
