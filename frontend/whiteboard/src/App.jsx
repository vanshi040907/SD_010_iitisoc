import React from 'react'
import Ferrofluid from './Ferrofluid'
import { useState } from 'react'
import Workspace from './pages/Workspace'
import { ThemeProvider } from './context/ThemeContext'

const App = () => {
    return (
        <div className="relative h-[100vh] w-full ">
            {/* Background layer */}

            <Workspace />
        </div >
    )
}

export default App