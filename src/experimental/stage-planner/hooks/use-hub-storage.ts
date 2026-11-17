import { useCallback, useEffect, useRef, useState } from "react";
import { STORAGE_KEY, defaultState, isHubState, type HubState } from "../lib/hub";

export const AUTO_SAVE_DELAY = 1000;

export function useHubStorage() {
  const [state, setState] = useState<HubState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapshot = JSON.stringify(state);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const restored: unknown = JSON.parse(raw);
        if (isHubState(restored)) {
          setState(restored);
          setSavedSnapshot(JSON.stringify(restored));
        }
      }
    } catch {
      setError("Gespeichertes Layout konnte nicht geladen werden.");
    }
    setLoaded(true);
  }, []);

  const saveSnapshot = useCallback((value: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      setSavedSnapshot(value);
      setError(null);
      return true;
    } catch {
      setError("Speichern fehlgeschlagen. Bitte Browserspeicher prüfen und erneut versuchen.");
      return false;
    }
  }, []);

  const save = useCallback(() => {
    if (!loaded) return false;
    if (timer.current !== null) clearTimeout(timer.current);
    return saveSnapshot(snapshot);
  }, [loaded, snapshot, saveSnapshot]);

  useEffect(() => {
    if (!loaded || snapshot === savedSnapshot) return;
    timer.current = setTimeout(() => saveSnapshot(snapshot), AUTO_SAVE_DELAY);
    // Preserve pending changes if the page closes before the debounce expires.
    const flush = () => saveSnapshot(snapshot);
    window.addEventListener("pagehide", flush);
    return () => {
      if (timer.current !== null) clearTimeout(timer.current);
      window.removeEventListener("pagehide", flush);
    };
  }, [loaded, snapshot, savedSnapshot, saveSnapshot]);

  const status = !loaded ? "loading" : snapshot === savedSnapshot ? "saved" : error ? "error" : "dirty";
  return { state, setState, loaded, status, error, save };
}