import React from 'react'
import Toolbar from '../components/Toolbar'
import TitleCard_download from '../components/TitleCard_download'
import MemberList from '../components/MemberList'
import SessionStatus from '../components/SessionStatus'
import Invite_help from '../components/Invite_help'
import { ThemeProvider } from '../context/ThemeContext'
import ToggleBtn from '../components/ToggleBtn'
import Background from '../components/Background'
import Whiteboard from '../components/Whiteboard'
import { WhiteboardProvider } from '../context/WhiteboardContext'

const Workspace = () => {
  
  return (
     <>         
          <ThemeProvider>
            <WhiteboardProvider>
              <Background />
              <TitleCard_download/>
              <Toolbar/>
              <MemberList />
              <SessionStatus />
              <Invite_help />
              <ToggleBtn />
              <Whiteboard />
            </WhiteboardProvider>
          </ThemeProvider>
        </>
    
  )
}

export default Workspace
