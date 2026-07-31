import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Home from './pages/home.jsx'
import Welcome from './pages/Welcome.jsx'
import Workspace from './pages/Workspace.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Hello from './pages/Hello.jsx'
import { SocketProvider } from './context/Socket.jsx'
import { RoomProvider } from './context/RoomContext.jsx'
import { InfinityProvider } from './context/infinity.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const App = () => {
  return (
    <SocketProvider>
      <BrowserRouter>

        <InfinityProvider>
          <Routes>
            <Route path="/" element={<Hello />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/Welcome" element={<Welcome />} />
            <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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
