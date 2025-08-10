import { useState, useEffect } from "react";

// حفظ واسترجاع التقدم من Local Storage
export default function useLocalProgress(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialValue;
    }
  });

  // تحديث القيمة في Local Storage عند التغيير
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  }, [key, value]);

  return [value, setValue];
}

