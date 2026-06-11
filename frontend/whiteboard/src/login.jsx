import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom"
import Ferrofluid from './Ferrofluid';
import { motion } from 'framer-motion'

function Login() {
    const [myName, setMyName] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="relative h-[100vh] w-full">

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
            <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-5 py-10 font-[Nunito]">

                {/* Glow blobs */}
                <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 -translate-x-1/2 -translate-y-1/2 blur-[200px]" />
                <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 translate-x-1/2 -translate-y-1/2 blur-[200px]" />
                <div className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 -translate-x-1/2 translate-y-1/2 blur-[200px]" />
                <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 blur-[200px] translate-x-1/2 translate-y-1/2" />

                {/* Title */}
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

                {/* Card */}
                <div className="w-full max-w-md z-10">
                    <div className="rounded-2xl p-7 bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                        <h2 className="text-xl font-bold text-white font-[Clash_Display] mb-[30px]">
                            Login
                        </h2>
                        <label className="text-[11px] text-violet-300 font-semibold uppercase tracking-[0.15em] mb-1 block">
                            Your Name
                        </label>
                        <input
                            type="text"
                            value={myName}
                            onChange={(e) => setMyName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl mb-5 text-white text-sm bg-white/[0.06] border border-white/10 outline-none"
                        />
                        <label className="text-[11px] text-violet-300 font-semibold uppercase tracking-[0.15em] mb-1 block">
                            Your Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl mb-5 text-white text-sm bg-white/[0.06] border border-white/10 outline-none"
                        />
                        <Link to="/Welcome">
                            <button className="w-full py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(124,58,237,0.35)] active:scale-95 transition">
                                Login
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Signup link */}
                <Link to="/signup" className="text-violet-300/70 mt-6 text-sm hover:text-violet-300 transition">
                    Don't have an account? Sign up
                </Link>

            </div>
        </div>
    )
}

export default Login