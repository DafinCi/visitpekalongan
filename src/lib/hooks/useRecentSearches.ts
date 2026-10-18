"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "vp_recent_searches";
const EVENT_NAME = "vp-recent-searches-changed";
const MAX_ITEMS = 5;
const EMPTY_RECENT: string[] = [];

let cachedRaw: string | null = null;
let cachedParsed: string[] = EMPTY_RECENT;

function getSnapshot(): string[] {
  if (typeof window === "undefined") {
    return EMPTY_RECENT;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedParsed;
    }
    cachedRaw = raw;
    if (!raw) {
      cachedParsed = EMPTY_RECENT;
      return cachedParsed;
    }
    const parsed = JSON.parse(raw);
    cachedParsed = Array.isArray(parsed) ? parsed : EMPTY_RECENT;
    return cachedParsed;
  } catch {
    return EMPTY_RECENT;
  }
}

function getServerSnapshot(): string[] {
  return EMPTY_RECENT;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(EVENT_NAME, callback);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

export function useRecentSearches() {
  const recentSearches = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const addRecentSearch = useCallback((query: string) => {
    if (typeof window === "undefined") return;
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    try {
      const current = getSnapshot();
      const filtered = current.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      const next = [trimmed, ...filtered].slice(0, MAX_ITEMS);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch {
      // Abaikan error penyimpanan
    }
  }, []);

  const removeRecentSearch = useCallback((query: string) => {
    if (typeof window === "undefined") return;
    try {
      const current = getSnapshot();
      const next = current.filter((item) => item !== query);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch {
      // Abaikan error penyimpanan
    }
  }, []);

  const clearRecentSearches = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch {
      // Abaikan error penyimpanan
    }
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
}

