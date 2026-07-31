import React from 'react'
import { ThemeContext } from '../context/ThemeContext';
import { useState, useContext } from 'react'
import {Sun, Moon } from 'lucide-react';

const ToggleBtn = () => {
    const {isDark, toggleTheme, theme }=useContext(ThemeContext);

  return (
      <div className={`relative lg:fixed lg:top-4 lg:right-95 w-8 h-8 lg:w-18 lg:h-18 rounded-lg lg:rounded-xl flex items-center justify-center ${theme.textSecondary} ${theme.iconButtonHover} transition-all duration-200 border ${theme.border}`}
          style={{
            ...theme.glass
          }}>
                 <button
                 className="h-full w-full flex items-center justify-center"
                 onClick={toggleTheme}>
                    {isDark ? <Sun className="w-4 h-4 lg:w-6 lg:h-6"/> : <Moon className="w-4 h-4 lg:w-6 lg:h-6"/>
                    }
                    {/* {console.log(isDark)} */}
                 </button>
                 
    </div>
  )
}

export default ToggleBtn
