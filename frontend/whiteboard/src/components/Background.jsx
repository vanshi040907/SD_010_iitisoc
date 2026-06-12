import React from 'react'
import { ThemeContext } from '../context/ThemeContext';
import { useState, useContext } from 'react'

const Background = () => {
    const {isDark}=useContext(ThemeContext);
  return (
    <div className="min-h-screen flex items-center justify-center"
               style={{
               background: isDark ? "radial-gradient(ellipse at 20% 50%, #1a0b2e 0%, #0d0d1a 50%, #0a0a14 100%)" :"radial-gradient(ellipse at 20% 50%, #f5f0ff 0%, #fdf4ff 50%, #fff9f5 100%)",
               }}
          >
    </div>
  )
}

export default Background
