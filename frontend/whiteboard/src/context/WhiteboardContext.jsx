import { createContext, useContext, useRef, useState, useCallback } from "react";

export const WhiteboardContext = createContext();

export function WhiteboardProvider({ children }) {

  const [activeTool, setActiveTool] = useState("pen");
  const [activeColor, setActiveColor] = useState("#a855f7");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [activeShape, setActiveShape] = useState("rect");

  //for the undo and redo functions
  const engineRef = useRef(null);

  const [, forceUpdate] = useState(0);
  const bump = useCallback(() =>
    forceUpdate((n) => n + 1), []
  );

  const registerEngine = useCallback((engine) => {
    engineRef.current = engine;
    bump();
  }, []);

  const downloadCanvas = useCallback(()=>{
    engineRef.current?.downloadCanvas?.();
  }, []);

  const undo = useCallback(() => {
    engineRef.current?.undo();
    bump();
  }, [bump]);

  const redo = useCallback(() => {
    engineRef.current?.redo();
    bump();
  }, [bump]);

  const notifyHistoryChange = useCallback(() => {
  bump();
  }, [bump]);

  const canUndo = engineRef.current?.canUndo?.() ?? false;
  const canRedo = engineRef.current?.canRedo?.() ?? false;

  return (
    <WhiteboardContext.Provider
      value={{
        activeTool, setActiveTool,
        activeColor, setActiveColor,
        strokeWidth, setStrokeWidth,
        registerEngine,
        undo, redo,
        canUndo, canRedo,
        notifyHistoryChange,
        activeShape,
        setActiveShape, bump,
        downloadCanvas,

      }}
    >
      {children}
    </WhiteboardContext.Provider>
  );
}