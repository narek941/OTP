import { useEffect, useLayoutEffect, useRef } from 'react';

export const useNoInitialEffect = (func: () => void, deps: any[]) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};

export const useNoInitialLayoutEffect = (func: () => void, deps: any[]) => {
  const didMount = useRef(false);

  useLayoutEffect(() => {
    if (didMount.current) {
      func();
    } else {
      didMount.current = true;
    }
  }, deps);
};
