import React from "react";

export default function useLocalProgress() {
  const [state, setState] = React.useState(() => {
    try {
      const raw = localStorage.getItem("woerterreise_progress_v1");
      return raw ? JSON.parse(raw) : { unlocked: 0, stars: 0, completed: {} };
    } catch {
      return { unlocked: 0, stars: 0, completed: {} };
    }
  });

  React.useEffect(() => {
    localStorage.setItem("woerterreise_progress_v1", JSON.stringify(state));
  }, [state]);

  return [state, setState];
}
