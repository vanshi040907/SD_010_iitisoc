import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Home from './pages/home.jsx'
import Welcome from './pages/Welcome.jsx'
import Workspace from './pages/Workspace.jsx'
import { SocketProvider } from './context/Socket.jsx'
import { RoomProvider } from './context/RoomContext.jsx'
import { InfinityProvider } from './context/infinity.jsx'
const App = () => {
    return (
        <SocketProvider>
        <BrowserRouter>
        
          <InfinityProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/Welcome" element={<Welcome />} />
            <Route path="/Workspace/:roomID" element={<RoomProvider>
              <Workspace />
             </RoomProvider>} />
          </Routes>
          </InfinityProvider>
        
        </BrowserRouter>
        </SocketProvider>
        
    )
}

export default App