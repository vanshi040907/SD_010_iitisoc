import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Home from './pages/home.jsx'
import Welcome from './pages/Welcome.jsx'
import Workspace from './pages/Workspace.jsx'
import Dashboard from './pages/Dashboard.jsx'
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/Welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
            <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/Workspace/:roomID" element={<ProtectedRoute><RoomProvider>
              <Workspace />
            </RoomProvider></ProtectedRoute>} />
          </Routes>
        </InfinityProvider>

      </BrowserRouter>
    </SocketProvider>

  )
}

export default App
