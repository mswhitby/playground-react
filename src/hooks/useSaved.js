import { useEffect, useState } from "react";

/**
 * useState that persists to localStorage as JSON.
 * Falls back to `initial` when storage is empty, blocked or unparsable.
 */
export function useSaved(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}
