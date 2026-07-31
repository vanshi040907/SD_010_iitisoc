import React, { useContext } from 'react'
import { Trash2 } from 'lucide-react'
import { ThemeContext } from '../context/ThemeContext'
import { WhiteboardContext } from '../context/WhiteboardContext'

const Btn_clearCanvas = () => {
  const { isDark, theme } = useContext(ThemeContext);
  const { drawingRefs, bump } = useContext(WhiteboardContext);

  const clearCanvas = () => {
    const confirmClear = window.confirm("Are you sure you want to clear the canvas? This action cannot be undone.");
    if (!confirmClear) return;

    const { ctxRef, canvasRef, historyStackRef, redrawAll } = drawingRefs.current;
    if (!ctxRef?.current || !canvasRef?.current || !redrawAll) return;

    historyStackRef.current = [];
    redrawAll();
    bump();
  }

  return (
    <div>
      <div className={` group fixed bottom-4 left-1/2 translate-x-30 w-14 max-[480px]:w-10 max-[480px]:h-10 max-[480px]:bottom-7 max-[480px]:rounded-full max-[480px]:translate-x-27 h-14 rounded-xl flex z-40 items-center justify-center ${theme.textSecondary} ${theme.iconButtonHover} transition-all duration-200 z-5`}
        style={{ ...theme.glass }}>
        <button className="h-18" onClick={clearCanvas}>
          <Trash2 />
        </button>
        <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md ${theme.border} ${theme.divider} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl`}
          style={{ background: theme.tooltipBg }}>
          Clear Canvas
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
        </div>
      </div>
    </div>
  )
}

export default Btn_clearCanvas