import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom"
import { motion } from 'framer-motion'
import Ferrofluid from "../animations/Ferrofluid";
import axios from "axios";
import conf from "../conf/conf";
import { useNavigate } from "react-router-dom"
import LetsCoSketh from '../animations/LetsCoSketh';
import TextPressure from '../animations/TextPressure';

function Signup() {

    const [myName, setMyName] = useState("");
    const [password, setPassword] = useState("");
    const [Mail, setMail] = useState("");
    const [isLampOn, setIsLampOn] = useState(false);
    const navigate = useNavigate();
    const handleAccountCreate = (e) => {
        e.preventDefault();

        axios.post(`${conf.path}/user/signin`, {
            userName: myName,
            email: Mail,
            password: password
        })
            .then((res) => navigate("/login"))
            .catch((err) => console.log(err))


    }
    return (<>

        {/* Cord + housing — behind the title */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[8] flex flex-col items-center">
            <div className="w-[2px] h-[180px] bg-gradient-to-b from-[#26203a] to-[#3a3454]" />
            <div className="w-[100px] h-[50px] bg-[#201a30] rounded-b-md rounded-t-[40px] shadow-md" />
        </div>

        {/* Bulb + chain + button */}
        <div className="absolute top-[230px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <motion.div
                animate={{
                    backgroundColor: isLampOn ? "#ffd76a" : "#3a3450",
                    boxShadow: isLampOn
                        ? "0 0 20px 6px rgba(255,215,106,0.9), 0 0 60px 30px rgba(255,205,90,0.35)"
                        : "0 0 0px rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.4 }}
                className="w-[80px] h-[40px] rounded-b-full"
            />
            <div className="w-[1px] h-[34px] bg-[#55506e] mt-0.5" />
            <button
                onClick={() => setIsLampOn((v) => !v)}
                aria-label="Toggle lamp"
                className="w-4 h-4 rounded-full bg-gradient-to-br from-[#9a8fc4] to-[#3d3658] hover:scale-110 active:translate-y-1 transition -mt-px"
            />
        </div>

        {/* Darkness overlay */}
        <motion.div
            animate={{ opacity: isLampOn ? 0 : 0.55 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-[#05030a] z-[5] pointer-events-none"
        />

        {/* Light cone */}
        <motion.div
            animate={{ opacity: isLampOn ? 1 : 0 }}
            transition={{ duration: 1 }}
            style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                background: "linear-gradient(to bottom, rgba(255,221,140,0.35), rgba(255,221,140,0.05) 70%, transparent)",
            }}
            className="absolute top-[230px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] z-[6] pointer-events-none"
        />

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

            <div className="min-h-screen relative z-10 flex flex-col justify-center items-center px-5 py-10 font-[Nunito]">
                <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 -translate-x-1/2 -translate-y-1/2 blur-[200px] " />

                <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 translate-x-1/2 -translate-y-1/2 blur-[200px] " />

                <div className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 -translate-x-1/2 translate-y-1/2 blur-[200px] " />

                <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 blur-[200px] translate-x-1/2 translate-y-1/2 " />

                <motion.div initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-12 z-30">
                    {/* <h1 className="text-5xl font-black text-white tracking-tight font-[Clash_Display] mb-2">
                        ✏️ Whiteboard
                    </h1> */}
                    <LetsCoSketh />

                    {/* <p className="text-violet-300/70 text-base">
                        Draw together, in real time.
                    </p> */}
                    <div style={{ position: 'relative' }}>
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

                <motion.div
                    animate={{
                        opacity: isLampOn ? 1 : 0.20,
                        y: isLampOn ? 0 : 14,
                    }}
                    transition={{ duration: 0.8, delay: isLampOn ? 0.15 : 0 }}
                    className={`w-full max-w-3xl z-10 ${isLampOn ? "" : "pointer-events-none"}`}
                >
                    <div className="w-full max-w-3xl flex flex-col md:flex-row gap-5 z-10 mt-30">
                        <div className="flex-1 rounded-2xl p-7 bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">

                            <h2 className="text-xl font-bold text-white font-[Clash_Display] mb-[30px]">
                                Sign up
                            </h2>
                            <label className="text-[11px] text-violet-300 font-semibold uppercase tracking-[0.15em] mb-1 block">
                                mail id
                            </label>
                            <input type="text" value={Mail} onChange={(e) => setMail(e.target.value)} className='w-full px-4 py-3 rounded-xl mb-5 text-white text-sm bg-white/[0.06] border border-white/10 outline-none ' />
                            <label className="text-[11px] text-violet-300 font-semibold uppercase tracking-[0.15em] mb-1 block">
                                Your Name
                            </label>
                            <input type="text" value={myName} onChange={(e) => setMyName(e.target.value)} className='w-full px-4 py-3 rounded-xl mb-5 text-white text-sm bg-white/[0.06] border border-white/10 outline-none ' />
                            <label className="text-[11px] text-violet-300 font-semibold uppercase tracking-[0.15em] mb-1 block">
                                Your password
                            </label>
                            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className='w-full px-4 py-3 rounded-xl mb-5 text-white text-sm bg-white/[0.06] border border-white/10 outline-none ' />

                            <button onClick={handleAccountCreate}

                                className="w-full py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(124,58,237,0.35)] active:scale-95 transition"
                            >
                                Sign in

                            </button>



                        </div>
                    </div>
                </motion.div>


                <Link to="/login" className="text-violet-300/70 mt-[40px]"> Have an account? login now! </Link>



            </div>
        </div>
    </>
    )
}

export default Signup