import React from 'react'
import { ThemeContext } from '../context/ThemeContext';
import { useState, useContext } from 'react'
import {Sun, Moon } from 'lucide-react';

const ToggleBtn = () => {
    const {isDark, toggleTheme, theme }=useContext(ThemeContext);

  return (
    <div>
      <div className={`fixed top-4 right-78 w-18 h-18 rounded-xl flex items-center justify-center ${theme.textSecondary} ${theme.iconButtonHover} transition-all duration-200 border ${theme.border}`}
          style={{
            ...theme.glass
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
