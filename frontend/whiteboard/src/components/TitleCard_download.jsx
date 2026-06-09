import React from 'react'
import {Download} from "lucide-react";

const TitleCard_download = (RoomName) => {
  const handleDownload = () => {
    alert("Download triggered");
  };

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-3">
        <div className="flex flex-col justify-center px-4 py-2.5 rounded-xl border border-white/10"
        style={{
          background: "rgba(15, 12, 30, 0.85)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        >
           <span className="text-white text-2xl font-semibold leading-tight">Web Whiteboard</span>
        <span className="text-purple-400 text-m leading-tight mt-0.5">Room Name</span> 
        </div>

          <div className="w-px h-16 bg-white/10 rounded-full" />

          <div className="relative group">
            <button
          onClick={handleDownload}
          className="w-18 h-18 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/10"
          style={{
            background: "rgba(15, 12, 30, 0.85)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <Download size={30} strokeWidth={1.8} />
        </button>

        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[#1a1a2e] border border-white/10 text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl">
          Download
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#1a1a2e]" />
        </div>
          </div>
    </div>
  )
}

export default TitleCard_download
