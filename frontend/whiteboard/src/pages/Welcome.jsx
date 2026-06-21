// Welcome.jsx

import { useState } from "react";
import { motion } from 'framer-motion'
import Ferrofluid from "../animations/Ferrofluid";
import { Link } from "react-router-dom"
import LetsCoSketh from "../animations/LetsCoSketh";
import { useSocket } from "../context/Socket";
import conf from "../conf/conf";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function Welcome() {
    const [myName, setMyName] = useState("");
    const [roomID, setRoomID] = useState("");
    const [joinName, setJoinName] = useState("");
    const [joinRoomID, setJoinRoomID] = useState("");
    const [copyMsg, setCopyMsg] = useState("");
    const [joinMsg, setJoinMsg] = useState("");
    const socket = useSocket();
    const navigate = useNavigate();

    function generateID() {
        let part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
        let part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
        setRoomID(part1 + "-" + part2);
        setCopyMsg("");
    }

    function copyID() {
        if (roomID === "") {
            setCopyMsg("Generate a room ID first!");
            return;
        }
        navigator.clipboard.writeText(roomID);
        setCopyMsg("Copied!");
        setTimeout(() => setCopyMsg(""), 2000);
    }

    async function createRoom() {
        if (myName === "") { alert("Please enter your name"); return; }
        if (roomID === "") { alert("Please generate a room ID first"); return; }
        alert("Room " + roomID + " created!\nShare this room ID with your friends.");
        try {
        await axios.post(`${conf.path}/room/createroom`,{
                       
            roomID: roomID
        },{
        withCredentials: true,
    })
        socket.emit("joinroom", {roomID, myName});
        navigate(`/Workspace/${roomID}`);
    }
        catch(error) {
            console.log(error);
        }

    }

    function joinRoom() {
        if (joinName === "" || joinRoomID === "") {
            setJoinMsg("Please fill all fields");
            return;
        }
        setJoinMsg("");
        alert("Hello " + joinName + "! Joining room " + joinRoomID);
    }

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
            <div className="min-h-screen relative z-10 flex flex-col justify-center items-center px-5 py-10 font-[Nunito]">

                <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 -translate-x-1/2 -translate-y-1/2 blur-[200px] " />

                <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 translate-x-1/2 -translate-y-1/2 blur-[200px] " />

                <div className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 -translate-x-1/2 translate-y-1/2 blur-[200px] " />

                <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 blur-[200px] translate-x-1/2 translate-y-1/2 " />

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-12">
                    {/* <h1 className="text-5xl font-black text-white tracking-tight font-[Clash_Display] mb-2">
                        ✏️ Whiteboard
                    </h1> */}
                    <LetsCoSketh />
                    <p className="text-violet-300/70 text-base">
                        Draw together, in real time.
                    </p>
                </motion.div>

                {/* Cards row */}
                <div className="w-full max-w-3xl flex flex-col md:flex-row gap-5 z-10">

                    {/* ── Create Room ── */}
                    <div className="flex-1 rounded-2xl p-7 bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">

                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xl">🏠</span>
                            <h2 className="text-xl font-bold text-white font-[Clash_Display]">
                                Create a Room
                            </h2>
                        </div>

                        <label className="text-[11px] text-violet-300 font-semibold uppercase tracking-[0.15em] mb-1 block">
                            Your Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Vishruthi"
                            value={myName}
                            onChange={(e) => setMyName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl mb-5 text-white text-sm bg-white/[0.06] border border-white/10 outline-none focus:ring-2 focus:ring-violet-500 placeholder-white/20 transition"
                        />

                        <label className="text-[11px] text-violet-300 font-semibold uppercase tracking-[0.15em] mb-1 block">
                            Room ID
                        </label>
                        <div className="flex gap-2 mb-1">
                            <div className="flex-1 px-4 py-3 rounded-xl text-sm font-[JetBrains_Mono] tracking-widest bg-violet-950/50 border border-violet-700/30 text-violet-300">
                                {roomID === "" ? "—— ——" : roomID}
                            </div>
                            <button
                                onClick={generateID}
                                className="px-4 py-3 rounded-xl text-sm font-semibold text-white bg-violet-700/50 border border-violet-600/40 hover:bg-violet-600/60 active:scale-95 transition"
                            >
                                Generate
                            </button>
                            <button
                                onClick={copyID}
                                className="px-4 py-3 rounded-xl text-sm font-semibold text-white bg-white/[0.07] border border-white/10 hover:bg-white/[0.12] active:scale-95 transition"
                            >
                                Copy
                            </button>
                        </div>

                        <p className="text-violet-400 text-xs mb-5 h-4">{copyMsg}</p>

                        
                        <button
                            onClick={createRoom}
                            className="w-full py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(124,58,237,0.35)] active:scale-95 transition"
                        >
                            Create Room →
                        </button>
                        
                    </div>

                    {/* Divider */}
                    <div className="flex md:flex-col items-center justify-center gap-3">
                        <div className="flex-1 h-px md:h-full md:w-px bg-white/10" />
                        <span className="text-white/20 text-xs font-bold uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px md:h-full md:w-px bg-white/10" />
                    </div>

                    {/*join Room*/}
                    <div className="flex-1 rounded-2xl p-7 bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">

                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xl">🔗</span>
                            <h2 className="text-xl font-bold text-white font-[Clash_Display]">
                                Join a Room
                            </h2>
                        </div>

                        <label className="text-[11px] text-violet-300 font-semibold uppercase tracking-[0.15em] mb-1 block">
                            Your Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Rithika"
                            value={joinName}
                            onChange={(e) => setJoinName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl mb-5 text-white text-sm bg-white/[0.06] border border-white/10 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-white/20 transition"
                        />

                        <label className="text-[11px] text-violet-300 font-semibold uppercase tracking-[0.15em] mb-1 block">
                            Room ID
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. AB12-CD34"
                            value={joinRoomID}
                            onChange={(e) => setJoinRoomID(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl mb-1 text-white text-sm font-[JetBrains_Mono] tracking-widest bg-white/[0.06] border border-white/10 outline-none focus:ring-2 focus:ring-indigo-500 placeholder-white/20 transition"
                        />

                        <p className="text-red-400 text-xs mb-5 h-4">{joinMsg}</p>

                        <Link to="/Workspace">
                        <button
                            onClick={joinRoom}
                            className="w-full py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-[0_4px_20px_rgba(79,70,229,0.35)] active:scale-95 transition"
                        >
                            Join Room →
                        </button>
                        </Link>
                    </div>
                </div>
            </div>


        </div >
    );
}
