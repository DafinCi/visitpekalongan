"use client";

import { useSyncExternalStore } from "react";

let currentNow: Date | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function emitNow() {
  currentNow = new Date();
  listeners.forEach((listener) => listener());
}

function scheduleNextTick() {
  const delay = 60_000 - (Date.now() % 60_000) + 50;
  timer = setTimeout(() => {
    if (listeners.size === 0) return;
    emitNow();
    scheduleNextTick();
  }, delay);
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible") {
    emitNow();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (listeners.size === 1) {
    currentNow = new Date();
    scheduleNextTick();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", emitNow);
    window.addEventListener("pageshow", emitNow);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      if (timer) clearTimeout(timer);
      timer = null;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", emitNow);
      window.removeEventListener("pageshow", emitNow);
      currentNow = null;
    }
  };
}

function getSnapshot() {
  return currentNow;
}

function getServerSnapshot() {
  return null;
}

export function useNow(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
