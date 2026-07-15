import { createContext, useContext, useRef, useState, useCallback } from "react";

export const LaserContext = createContext();

export function LaserProvider({ children }) {

  const laserengineRef = useRef(null);

  const [, forceUpdate] = useState(0);
  const bump = useCallback(() =>
    forceUpdate((n) => n + 1), []
  );

  const registerLaser = useCallback((laser) => {
    laserengineRef.current = laser;
    bump();
  }, []);

  const laserLeave = useCallback(() => {
    laserengineRef.current?.laserLeave?.();
  }, []);
   const laserMove = useCallback((e)=>{
    laserengineRef.current?.laserMove?.(e);
  }, []);
  const laserUp = useCallback(()=>{
   laserengineRef.current?.laserUp?.();
  }, []);

  return (
    <LaserContext.Provider
      value={{
        registerLaser,
        laserLeave,
        laserMove,
        laserUp,
        

      }}
    >
      {children}
    </LaserContext.Provider>
  );
}