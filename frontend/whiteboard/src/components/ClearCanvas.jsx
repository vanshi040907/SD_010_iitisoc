import React from 'react'
import { Trash2 } from 'lucide-react'
import { ThemeContext } from '../context/ThemeContext'
import { useState, useContext } from 'react'

const Btn_clearCanvas = () => {
    const {isDark, theme} = useContext(ThemeContext);

    const clearCanvas =()=>{
        alert("Canvas Cleared!");
    }

  return (
    <div>
      <div className={` group fixed bottom-4 left-1/2 translate-x-30 w-14 h-14 rounded-xl flex z-50 items-center justify-center ${theme.textSecondary} ${theme.iconButtonHover} transition-all duration-200 z-5`}
          style={{
            ...theme.glass
          }}>
            <button
            className=" h-18"
            onClick={clearCanvas}>
                <Trash2 />
            </button>
            <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md ${theme.border} ${theme.divider} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl`}
            style={{
              background: theme.tooltipBg
            }}>
              Clear Canvas
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
            </div>
      </div>
    </div>
  )
}

export default Btn_clearCanvas
