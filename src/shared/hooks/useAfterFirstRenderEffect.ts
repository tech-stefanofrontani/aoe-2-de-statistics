import { useRef, useEffect } from 'react';

const useAfterFirstRenderEffect = (func: any, deps: any[]) => {
  const didMount = useRef(false);

  useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
  }, deps);
}

export { useAfterFirstRenderEffect };