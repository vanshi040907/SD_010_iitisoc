import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Home from './pages/home.jsx'
import Welcome from './pages/Welcome.jsx'
import Workspace from './pages/Workspace'


const App = () => {
    return (
        <>
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route path="/Workspace" element={<Workspace />} />
      </Routes>
        </BrowserRouter>
        </>
        
    )
}

export default App