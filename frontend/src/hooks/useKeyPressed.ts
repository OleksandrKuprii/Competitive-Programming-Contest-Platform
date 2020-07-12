// useKeyPressed.ts - check if specific key was pressed
import {useEffect, useState} from "react";

function useKeyPressed(key: string) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler(event: KeyboardEvent) {
    if (key === event.key) {
      setKeyPressed(true);
    }
  }

  const upHandler = (event: KeyboardEvent) => {
    if (key === event.key) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keyPressed;
}

export default useKeyPressed;
