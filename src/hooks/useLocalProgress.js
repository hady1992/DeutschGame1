// src/hooks/useLocalProgress.js
import { useState, useEffect } from "react";

export default function useLocalProgress(
  initialValue = { unlocked: 0, stars: 0, completed: {} },
  key = "woerterreise_progress_v1"
) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}
