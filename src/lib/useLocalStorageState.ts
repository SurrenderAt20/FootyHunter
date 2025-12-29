"use client";

import * as React from "react";

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>, { isHydrated: boolean }] {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [value, setValue] = React.useState<T>(initialValue);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore corrupted storage
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  React.useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota / serialization errors
    }
  }, [isHydrated, key, value]);

  return [value, setValue, { isHydrated }];
}
