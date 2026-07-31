import React from 'react'
import { Sparkles, ArrowRight, RefreshCw, Home as HomeIcon, PenTool } from 'lucide-react';
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import Ferrofluid from "../animations/Ferrofluid";
import LetsCoSketh from '../animations/LetsCoSketh';
import TextPressure from '../animations/TextPressure';
import SplashCursor from '../animations/cursor';

const Hello = () => {
  return (
    <div className="relative min-h-screen w-full">
      <SplashCursor
        DENSITY_DISSIPATION={2}
        VELOCITY_DISSIPATION={1.5}
        PRESSURE={0.05}
        CURL={3}
        SPLAT_RADIUS={0.13}
        SPLAT_FORCE={3000}
        COLOR_UPDATE_SPEED={23}
        SHADING
        RAINBOW_MODE={false}
        COLOR="#7C3AED"
      />

      //background layer

      <div className="absolute inset-0 bg-[#0a0014]">
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

        <div className="relative z-10 w-full flex flex-col items-center px-5 py-10 font-[Nunito]">

                <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 -translate-x-1/2 -translate-y-1/2 blur-[200px]" />
                <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 translate-x-1/2 -translate-y-1/2 blur-[200px]" />
                <div className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 -translate-x-1/2 translate-y-1/2 blur-[200px]" />
                <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 blur-[200px] translate-x-1/2 translate-y-1/2" />

<br / >
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-12"
                >

                    <LetsCoSketh />

                    {/* <p className="text-violet-300/70 text-base">
                        Draw together, in real time.
                    </p> */}
                    <div style={{position: 'relative'}}>
                      <TextPressure
                        text="Draw  Together  in  Real  Time!"
                        flex
                        alpha={false}
                        stroke={false}
                        width
                        weight
                        italic
                        textColor="#c4b4ff"
                        strokeColor="#5227FF"
                        minFontSize={0.5}
                        
                     />
                    </div>
                </motion.div>

                <div className="flex flex-col gap-4">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                        {/* <div className="relative flex justify-center items-center p-8 bg-purple-950/20 border border-purple-800/30 rounded-3xl backdrop-blur-sm shadow-2xl"> */}
                        <img 
                        src="/whiteboard-imageneon.png"
                        alt="Collaborative Whiteboard Illustration"
                        className="w-full  object-contain filter drop-shadow-[0_0_25px_rgba(168,85,247,0.3)]"/>
                        {/* </div> */}
                        
                        <div className="flex flex-col items-start space-y-6">
                            <h1 className="text-2xl
                            min-[400px]:text-4xl
                             md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                            The Canvas, <br />
                            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                                Reinvented Together.
                            </span>
                            </h1>
                            <p className="text-gray-300 text-lg max-w-lg leading-relaxed">
                             Create, iterate, and share ideas instantly in a collaborative digital space designed for real-time teamwork.
                            </p>
                            <div className='flex items-center justify-center w-full'>
                                <Link to="/home">
                               <button className="mt-8 px-10 py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(124,58,237,0.35)]">
                                 <div className="flex items-center gap-2">
                                <span>Get Started!</span>
                                <ArrowRight />
                               </div>
                               </button>
                            </Link>
                            </div>
                        </div>
                    </div>

                
            </div>

            </div>
    </div>
  )
}

export default Hello
