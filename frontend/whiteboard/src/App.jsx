import React from 'react'
import Ferrofluid from './Ferrofluid'
import { useState } from 'react'
import './App.css'
import Workspace from './pages/Workspace'
import { ThemeProvider } from './context/ThemeContext'

const App = () => {
    return (
        <div className="relative h-[100vh] w-full ">
            {/* Background layer */}
            <div className=" absolute inset-0 bg-[#0a0014]">
                <Ferrofluid
                    colors={["#4f1b69", "#7C3AED", "#ffffff"]}
                    speed={0.5}
                    scale={1.6}
                    turbulence={1}
                    fluidity={0.1}
                    rimWidth={0.2}
                    sharpness={2.5}
                    shimmer={1.5}
                    glow={2}
                    flowDirection="down"
                    opacity={1}
                    mouseInteraction
                    mouseStrength={1}
                    mouseRadius={0.35}
                />
            </div>

            {/* Content layer — sits on top */}
            <div className="relative z-10">
                Hello world
            </div>

            <Workspace />
        </div >
    )
}

export default App