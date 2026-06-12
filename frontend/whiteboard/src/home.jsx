import React from 'react'
import Ferrofluid from './Ferrofluid'
import { motion } from 'framer-motion'
import { Link } from 'react-router'

function Home() {
    return (


        <div className="relative min-h-screen w-full">
            {/* Background layer */}
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

            {/* Content layer */}
            <div className="relative z-10 w-full flex flex-col items-center px-5 py-10 font-[Nunito]">

                <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 -translate-x-1/2 -translate-y-1/2 blur-[200px]" />
                <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 translate-x-1/2 -translate-y-1/2 blur-[200px]" />
                <div className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 -translate-x-1/2 translate-y-1/2 blur-[200px]" />
                <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 blur-[200px] translate-x-1/2 translate-y-1/2" />

                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-black text-white tracking-tight font-[Clash_Display] mb-2">
                        ✏️ Whiteboard
                    </h1>
                    <p className="text-violet-300/70 text-base">
                        Draw together, in real time.
                    </p>
                </motion.div>

                <div className="grid grid-cols-3 gap-3 w-full max-w-7xl">
                    <div className="col-span-2 min-h-[190px] rounded-2xl p-7 bg-white/[0.05] border border-white/[0.08] backdrop-blur-md">
                        <h2 className="text-xl font-bold text-white font-[Clash_Display]">Feature 1</h2>
                    </div>
                    <div className="min-h-[190px] rounded-2xl p-7 bg-white/[0.05] border border-white/[0.08] backdrop-blur-md">
                        <h2 className="text-xl font-bold text-white font-[Clash_Display]">Feature 2</h2>
                    </div>
                    <div className="min-h-[170px] rounded-2xl p-7 bg-white/[0.05] border border-white/[0.08] backdrop-blur-md">
                        <h2 className="text-xl font-bold text-white font-[Clash_Display]">Feature 3</h2>
                    </div>
                    <div className="min-h-[170px] rounded-2xl p-7 bg-white/[0.05] border border-white/[0.08] backdrop-blur-md">
                        <h2 className="text-xl font-bold text-white font-[Clash_Display]">Feature 4</h2>
                    </div>
                    <div className="min-h-[170px] rounded-2xl p-7 bg-white/[0.05] border border-white/[0.08] backdrop-blur-md">
                        <h2 className="text-xl font-bold text-white font-[Clash_Display]">Feature 5</h2>
                    </div>
                </div>

                <Link to="/login">
                    <button className="mt-12 px-10 py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(124,58,237,0.35)]">
                        Get Started!
                    </button>
                </Link>
            </div>
        </div>






    )
}

export default Home