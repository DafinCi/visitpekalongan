"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "vp_bookmarked_spots";
const EVENT_NAME = "vp-bookmarks-changed";
const EMPTY_BOOKMARKS: string[] = [];

let cachedRaw: string | null = null;
let cachedParsed: string[] = EMPTY_BOOKMARKS;

function getSnapshot(): string[] {
  if (typeof window === "undefined") {
    return EMPTY_BOOKMARKS;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedParsed;
    }
    cachedRaw = raw;
    if (!raw) {
      cachedParsed = EMPTY_BOOKMARKS;
      return cachedParsed;
    }
    const parsed = JSON.parse(raw);
    cachedParsed = Array.isArray(parsed) ? parsed : EMPTY_BOOKMARKS;
    return cachedParsed;
  } catch {
    return EMPTY_BOOKMARKS;
  }
}

function getServerSnapshot(): string[] {
  return EMPTY_BOOKMARKS;
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

export function useBookmarks() {
  const bookmarks = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const isBookmarked = useCallback(
    (slug: string) => bookmarks.includes(slug),
    [bookmarks]
  );

  const toggleBookmark = useCallback((slug: string) => {
    if (typeof window === "undefined") return;
    try {
      const current = getSnapshot();
      const exists = current.includes(slug);
      const next = exists
        ? current.filter((item) => item !== slug)
        : [slug, ...current];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch {
      // Abaikan jika penyimpanan penuh atau diblokir
    }
  }, []);

  const clearBookmarks = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    } catch {
      // Abaikan error penyimpanan
    }
  }, []);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    clearBookmarks,
    bookmarkCount: bookmarks.length,
  };
}

