// Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import conf from "../conf/conf";
import { useSocket } from "../context/Socket";
import Ferrofluid from "../animations/Ferrofluid";

export default function Dashboard() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [myName, setMyName] = useState("");
    const socket = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const [roomsRes, meRes] = await Promise.all([
                    axios.get(`${conf.path}/room/myrooms`, { withCredentials: true }),
                    axios.get(`${conf.path}/user/me`, { withCredentials: true }),
                ]);
                setRooms(roomsRes.data.rooms || []);
                setMyName(meRes.data.user?.userName || "");
            } catch (error) {
                console.log(error);
                setErrorMsg("Couldn't load your boards. Try refreshing.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    async function openRoom(roomId) {
        try {
            const response = await axios.post(
                `${conf.path}/room/joinRoom`,
                { roomid: roomId },
                { withCredentials: true },
            );

            if (response.data.success) {
                if (!socket.connected) {
                    socket.connect();
                }
                socket.emit("joinroom", { roomID: roomId, myName });
                navigate(`/Workspace/${roomId}`);
            } else if (response.data.pending) {
                if (!socket.connected) {
                    socket.connect();
                }
                socket.emit("pending", { myName });
                alert("wait for approval");
            } else {
                alert("Couldn't open this board");
            }
        } catch (error) {
            console.log(error);
            alert("Couldn't open this board");
        }
    }

    return (
        <div className="relative min-h-screen w-full">
            <div className="absolute inset-0 bg-[#0a0014]">
                <Ferrofluid
                    colors={["#4f1b69", "#7C3AED", "#a855f7"]}
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
                />
            </div>

            <div className="min-h-screen relative z-10 flex flex-col items-center px-5 py-10 font-[Nunito]">
                <div className="w-full max-w-3xl flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-white tracking-tight font-[Clash_Display]">
                        My Boards
                    </h1>
                    <Link
                        to="/Welcome"
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/[0.07] border border-white/10 hover:bg-white/[0.12] active:scale-95 transition"
                    >
                        + New / Join
                    </Link>
                </div>

                <div className="w-full max-w-3xl">
                    {loading && (
                        <p className="text-violet-300/70 text-sm">Loading your boards...</p>
                    )}

                    {!loading && errorMsg && (
                        <p className="text-red-400 text-sm">{errorMsg}</p>
                    )}

                    {!loading && !errorMsg && rooms.length === 0 && (
                        <p className="text-violet-300/70 text-sm">
                            You haven't joined or created any boards yet.
                        </p>
                    )}

                    <div className="flex flex-col gap-3">
                        {rooms.map((room) => (
                            <div
                                key={room.roomId}
                                className="flex items-center justify-between rounded-2xl p-5 bg-white/[0.04] border border-white/[0.08] backdrop-blur-md"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-[JetBrains_Mono] tracking-widest text-violet-300">
                                            {room.roomId}
                                        </span>
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400 bg-violet-950/50 border border-violet-700/30 rounded-full px-2 py-0.5">
                                            {room.role}
                                        </span>
                                    </div>
                                    <p className="text-white/40 text-xs">
                                        Owner: {room.owner} &middot; {room.participantCount}{" "}
                                        {room.participantCount === 1 ? "member" : "members"}
                                    </p>
                                </div>

                                <button
                                    onClick={() => openRoom(room.roomId)}
                                    className="px-4 py-2 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition"
                                >
                                    Open →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
