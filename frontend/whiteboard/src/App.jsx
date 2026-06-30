import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Home from './pages/home.jsx'
import Welcome from './pages/Welcome.jsx'
import Workspace from './pages/Workspace.jsx'
import { SocketProvider } from './context/Socket.jsx'
import { RoomProvider } from './context/RoomContext.jsx'
const App = () => {
    return (
        <SocketProvider>
        <BrowserRouter>
        <RoomProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/Welcome" element={<Welcome />} />
            <Route path="/Workspace/:roomID" element={<Workspace />} />
          </Routes>
        </RoomProvider>
        </BrowserRouter>
        </SocketProvider>
        
    )
}

export default App