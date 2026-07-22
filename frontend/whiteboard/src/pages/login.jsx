import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Ferrofluid from "../animations/Ferrofluid";
import { motion } from "framer-motion";
import conf from "../conf/conf";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LetsCoSketh from "../animations/LetsCoSketh";
import TextPressure from '../animations/TextPressure';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLampOn, setIsLampOn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${conf.path}/user/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      );

      alert("Login successful");
      navigate("/Welcome");
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Invalid Myname or password ❌");
      } else {
        alert("Server error ⚠️");
      }
    }
  };

  return (
    <>
      {/* Cord + housing — behind the title */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[8] flex flex-col items-center">
        <div className="w-[2px] h-[180px] bg-gradient-to-b from-[#26203a] to-[#3a3454]" />
        <div className="w-[100px] h-[50px] bg-[#201a30] rounded-b-md rounded-t-[40px] shadow-md" />
      </div>

      {/* Bulb + chain + button — in front, unaffected since it sits below the text anyway */}
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

      <motion.div
        animate={{ opacity: isLampOn ? 0 : 0.55 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[#05030a] z-[5] pointer-events-none"
      />

      {/* Light cone — separate from the bulb's own glow */}
      <motion.div
        animate={{ opacity: isLampOn ? 1 : 0 }}
        transition={{ duration: 1 }}
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          background: "linear-gradient(to bottom, rgba(255,221,140,0.35), rgba(255,221,140,0.05) 70%, transparent)",
        }}
        className="absolute top-[230px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] z-[6] pointer-events-none"
      />
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
          className="text-center mb-6 z-30"
        >
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

        {/* Card */}
        <motion.div
          animate={{
            opacity: isLampOn ? 1 : 0.20,
            y: isLampOn ? 0 : 14,
          }}
          transition={{ duration: 0.8, delay: isLampOn ? 0.15 : 0 }}
          className={`w-full max-w-md z-10 ${isLampOn ? "" : "pointer-events-none"}`}
        >

          <div className="w-full max-w-md z-10 mt-40">
            <div className="rounded-2xl p-7 bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
              <h2 className="text-xl font-bold text-white font-[Clash_Display] mb-[30px]">
                Login
              </h2>
              <label className="text-[11px] text-violet-300 font-semibold uppercase tracking-[0.15em] mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl mb-5 text-white text-sm bg-white/[0.06] border border-white/10 outline-none"
                required
              />
              <label className="text-[11px] text-violet-300 font-semibold uppercase tracking-[0.15em] mb-1 block">
                Your Password
              </label>
              <input
                type="password"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl mb-5 text-white text-sm bg-white/[0.06] border border-white/10 outline-none"
                required
              />
              <Link to="/Welcome">
                <button onClick={handleSubmit} className="w-full py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(124,58,237,0.35)] active:scale-95 transition">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Signup link */}
        <Link
          to="/signup"
          className="text-violet-300/70 mt-6 text-sm hover:text-violet-300 transition"
        >
          Don't have an account? Sign up
        </Link>
      </div>

    </>
  );
}

export default Login;
