import {functions} from "@/firebase config/firebase";
import {httpsCallable} from "firebase/functions";
import {useEffect, useState} from "react";

export default function useFetchSemaphore<T>(functionName: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function getSemaphoreData() {
    setLoading(true);
    setError(null);
    try {
      const semaphoreData = httpsCallable(functions, functionName);
      const result = await semaphoreData();
      setData(result.data as T);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = setTimeout(() => {
      getSemaphoreData();
    }, 1000);

    return () => clearTimeout(id);
  }, []);

  return {data, error, loading};
}
