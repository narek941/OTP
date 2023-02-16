import { useEffect, useRef } from 'react';

type UseIntervalCallback = () => void;

const useInterval = (callback: UseIntervalCallback, delay: number): void => {
  const savedCallback = useRef<UseIntervalCallback | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    if (delay !== null) {
      const id = setInterval(tick, delay);

      return () => clearInterval(id);
    }
  }, [delay]);
};

export default useInterval;
