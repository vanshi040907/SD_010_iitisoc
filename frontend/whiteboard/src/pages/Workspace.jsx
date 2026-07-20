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
import Btn_clearCanvas from '../components/ClearCanvas'
import Btn_coordinates from '../components/cordinates'

import { WhiteboardProvider } from '../context/WhiteboardContext'
import LaserWhiteboard from '../components/LaserWHITEboard'
import Zoom from '../components/zoom'
import AlertPopup from '../components/Hostpermission'
import { Play } from 'lucide-react'
import Playback from '../components/playback'
import { LaserProvider } from '../context/laser'
import Btn_grid from '../components/gridcontrol'
import { GridProvider } from '../context/GridContext'


const Workspace = () => {


  return (
    <>
      <ThemeProvider>
        <WhiteboardProvider>
          <LaserProvider>
            <GridProvider>
              <Background />
              <TitleCard_download />
              <Toolbar />
              <MemberList />
              <SessionStatus />
              <Invite_help />
              <Zoom />
              <AlertPopup />
              <Playback />
              <ToggleBtn />
              <Whiteboard />
              <LaserWhiteboard />
              <Btn_clearCanvas />
              <Btn_coordinates />
              <Btn_grid />
            </GridProvider>
          </LaserProvider>
        </WhiteboardProvider>
      </ThemeProvider>
    </>

  )
}

export default Workspace
