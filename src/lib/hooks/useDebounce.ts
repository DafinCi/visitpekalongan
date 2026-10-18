"use client";

import { useEffect, useState } from "react";

/**
 * Menunda pembaruan nilai (debounce) selama `delayMs` milidetik saat pengguna mengetik,
 * namun langsung mengembalikan nilai secara instan (0ms) saat input dikosongkan.
 */
export function useDebounce<T>(value: T, delayMs = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  if (typeof value === "string" && value === "") {
    return value;
  }

  return debouncedValue;
}

