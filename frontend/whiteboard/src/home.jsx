import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'

function Home() {
    return (
        <div className="min-h-screen bg-[#080412] flex flex-col justify-center items-center px-5 py-10 font-[Nunito]">

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

            <div className='grid grid-cols-3 gap-3 w-full max-w-7xl'>
                <div className=' color-white col-span-2 min-h-[190px] rounded-2xl p-7 bg-white/[0.05] border border-white/[0.08] backdrop-blur-md'> <h2 className="text-xl font-bold text-white font-[Clash_Display] mb-[30px]">
                    feature 1
                </h2> </div>
                <div className=' color-white border-2 border-white rounded-2xl min-h-[190px] rounded-2xl p-7 bg-white/[0.05] border border-white/[0.08] backdrop-blur-md '> <h2 className="text-xl font-bold text-white font-[Clash_Display] mb-[30px]">
                    Feature 2
                </h2></div>
                <div className=' color-white border-2 border-white  rounded-2xl min-h-[170px] rounded-2xl p-7 bg-white/[0.05] border border-white/[0.08] backdrop-blur-md'> <h2 className="text-xl font-bold text-white font-[Clash_Display] mb-[30px]">
                    <h2 className="text-xl font-bold text-white font-[Clash_Display] mb-[30px]">
                        Feature 3
                    </h2>
                </h2> </div>
                <div className=' color-white border-2 border-white rounded-2xl min-h-[170px] rounded-2xl p-7 bg-white/[0.05] border border-white/[0.08] backdrop-blur-md'> <h2 className="text-xl font-bold text-white font-[Clash_Display] mb-[30px]">
                    Feature 4
                </h2> </div>
                <div className=' color-white border-2 border-white gap-3 rounded-2xl min-h-[170px] rounded-2xl p-7 bg-white/[0.05] border border-white/[0.08] backdrop-blur-md'> <h2 className="text-xl font-bold text-white font-[Clash_Display] mb-[30px]">
                    Feature 5
                </h2></div>


            </div>

            <Link to="/login">
                <button

                    className="w-full py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(124,58,237,0.35)] mt-20 p-10"
                >
                    Get Started!

                </button>
            </Link>



        </div >
    )
}

export default Home