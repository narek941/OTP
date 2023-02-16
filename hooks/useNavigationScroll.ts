import { INavItem } from '@type/general';
import { observeElement } from '@utils/observing';
import { useEffect, useRef } from 'react';

const TIMEOUT_DELAY = 500;

export const useNavigationScroll = (
  nav: INavItem[],
  callback: (id: string) => void,
  isOff: boolean = false
) => {
  const oldScrollYRef = useRef(window.scrollY);
  let timeOut;

  const getNextId = (index: number) => {
    const isLastItem = index === nav.length - 1;
    if (isLastItem) return nav[index].id;
    return nav[index + 1].id;
  };

  const getPrevId = (index: number) => {
    const isFirstItem = index === 0;
    if (isFirstItem) return nav[0].id;
    return nav[index - 1].id;
  };

  const setupCallback = (id: string) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => callback(id), TIMEOUT_DELAY);
  };

  useEffect(() => {
    if (isOff) return;
    nav.forEach((setting, index) => {
      observeElement(setting.linkTo, (isIntersecting) => {
        const newScrollYPos = window.scrollY;
        if (newScrollYPos == oldScrollYRef.current) return;
        const goDown = newScrollYPos > oldScrollYRef.current;
        oldScrollYRef.current = newScrollYPos;
        if (isIntersecting) {
          setupCallback(setting.id);
          return;
        }
        if (goDown) {
          setupCallback(getNextId(index));
          return;
        }
        setupCallback(getPrevId(index));
      });
    });
  }, []);
};
