import React from 'react'
import { ThemeContext } from '../context/ThemeContext';
import { useState, useContext } from 'react'
import {Sun, Moon } from 'lucide-react';

const ToggleBtn = () => {
    const {isDark, toggleTheme }=useContext(ThemeContext);

  return (
    <div>
      <div className="fixed top-4 right-78 w-18 h-18 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 border border-white/10"
          style={{
            background: "rgba(15, 12, 30, 0.85)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}>
                 <button
                 onClick={toggleTheme}>
                    {isDark ? <Sun /> : <Moon />
                    }
                    {/* {console.log(isDark)} */}
                 </button>
                </div>
    </div>
  )
}

export default ToggleBtn
