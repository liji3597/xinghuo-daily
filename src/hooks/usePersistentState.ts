import { useEffect, useState } from 'react';

export function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, fallback));
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [key, value]);

  return [value, setValue, storageError] as const;
}
