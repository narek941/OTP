import { useEffect, useState } from 'react';

export const useShowHideScroll = () => {
  const [scrollState, setScrollState] = useState('initial');
  const showScroll = () => {
    setScrollState('initial');
    document.body.style.overflow = 'initial';
    document.body.classList.remove('hidden');
  };

  const hideScroll = () => {
    setScrollState('hidden');
    document.body.classList.add('hidden');
  };

  useEffect(() => {
    document.body.style.overflow = scrollState;
  }, [scrollState]);

  return {
    showScroll,
    hideScroll,
    scrollState,
  };
};
