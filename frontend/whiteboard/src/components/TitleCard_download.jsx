import React from 'react'
import {Download} from "lucide-react";
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { WhiteboardContext } from '../context/WhiteboardContext';

const TitleCard_download = () => {
  
  const {theme} = useContext(ThemeContext);
  const {downloadCanvas} = useContext(WhiteboardContext);

  const handleDownload = () => {
    alert("Download triggered");
    downloadCanvas();
  };

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
        <div className={`flex w-60 flex-col justify-center px-4 py-2.5 rounded-xl border ${theme.border}`}
        style={{
          ...theme.glass
        }}
        >
           <div>
            <span className={`${theme.textPrimary} text-4xl font-bold leading-tight`}>Co</span>
           <span className={`${theme.accent} text-4xl font-semibold leading-tight`}>Sketch</span>
           </div>
        <span className={`${theme.textPrimary} text-sm leading-tight mt-0.5`}>Room Name</span> 
        </div>

          <div className={`w-px h-16 ${theme.divider} rounded-full`} />

          <div className="relative group">
            <button
          onClick={handleDownload}
          className={`w-18 h-18 rounded-xl flex items-center justify-center text-slate-400 ${theme.iconButtonHover} transition-all duration-200 border ${theme.border}`}
          style={{
            ...theme.glass
          }}
        >
          <Download size={30} strokeWidth={1.8} />
        </button>

        <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md border ${theme.border} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl`}
        style={{background:theme.tooltipBg}}>
          Download
          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[${theme.tooltipBg}]`} />
        </div>
          </div>
    </div>
  )
}

export default TitleCard_download
