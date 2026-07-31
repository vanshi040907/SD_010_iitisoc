import React from 'react'
import TitleCard_download from './TitleCard_download'
import ToggleBtn from './ToggleBtn'
import MemberList from './MemberList'
import { ThemeContext } from '../context/ThemeContext'
import { useContext } from 'react'


const Header = () => {

    const {theme} = useContext(ThemeContext);
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 h-13 flex items-center justify-between px-3 backdrop-blur-md border-b ${theme.headerBorder} lg:static lg:h-0 lg:p-0 lg:border-none lg:backdrop-blur-none`}
      style={{ background: theme.headerBg }}
    >
      <TitleCard_download />
      <div className="flex items-center gap-2">
        <ToggleBtn />
        <MemberList />
      </div>
    </div>
  )
}

export default Header