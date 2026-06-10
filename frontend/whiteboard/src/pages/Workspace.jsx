import React from 'react'
import Toolbar from '../components/Toolbar'
import TitleCard_download from '../components/TitleCard_download'
import MemberList from '../components/MemberList'
import SessionStatus from '../components/SessionStatus'
const Workspace = () => {
  return (
     <div className="min-h-screen flex items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at 20% 50%, #1a0b2e 0%, #0d0d1a 50%, #0a0a14 100%)",
      }}
    >
        <TitleCard_download/>
        <Toolbar/>
        <MemberList />
        <SessionStatus />
    </div>
  )
}

export default Workspace
