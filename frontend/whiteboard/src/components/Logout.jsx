import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import { LogOut } from 'lucide-react';

const Logout = ({onCustomClick}) => {
    const {theme} = useContext(ThemeContext);
    
  return (
    <div className={` group p-3 rounded-xl flex z-50 items-center justify-center ${theme.textSecondary} ${theme.iconButtonHover} transition-all duration-200 z-50`}
          style={{
            ...theme.glass
          }}>
      <button
      onClick={onCustomClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme.leaveBtn} hover:bg-red-500/25 hover:border-red-500/40 hover:text-red-300 transition-all duration-200`}>
        <LogOut size={15} strokeWidth={1.8} />
        <span className="text-xs font-medium">Logout</span>
      </button>
    </div>
  )
}

export default Logout
