import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './index.css'
import Login from './login.jsx'
import Signup from './signup.jsx'
import Home from './home.jsx'
import Welcome from './Welcome.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route path="/App" element ={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
