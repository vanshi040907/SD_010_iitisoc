import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import Ferrofluid from "../animations/Ferrofluid";
import LetsCoSketh from '../animations/LetsCoSketh';
import TiltedFeatureCard from '../components/FeatureCard';
import TextPressure from '../animations/TextPressure';
import { ArrowRight } from 'lucide-react';
import SplashCursor from '../animations/cursor';

const FEATURES = [
  {
    icon: "🎨",
    title: "Real-Time Collaborative Canvas",
    description:
      "Draw together on a shared HTML5 Canvas with zero noticeable delay. Every stroke appears on all connected screens the instant your mouse moves — powered by Socket.IO's event-driven broadcast architecture.",
    tag: "Core",
  },
  {
    icon: "🔐",
    title: "Secure Authentication",
    description:
      "Sign up and log in with your own account. Passwords are hashed using HMAC with a unique per-user salt — your credentials are never stored as plain text. Sessions are managed via JWT tokens in HTTP-only cookies.",
    tag: "Auth",
  },
  {
    icon: "🏠",
    title: "Private Room Codes",
    description:
      "Create an isolated drawing room and get a unique code. Share it with whoever you want — only people with the code can join. Rooms are completely independent of each other, so multiple sessions can run simultaneously.",
    tag: "Rooms",
  },
  {
    icon: "⚡",
    title: "Instant Sync",
    description: "Every stroke syncs across all participants immediately via Socket.io.",
    tag: "Sync",
  },
  {
    icon: "✏️",
    title: "Full Drawing Toolkit",
    description:
      "Pen, highlighter, eraser, rectangle, circle, triangle, line, and a floating text tool. Customize color and stroke width for every tool. Smooth curves via quadraticCurveTo() so freehand lines never look jagged.",
    tag: "Tools",
  },
  {
    icon: "↩️",
    title: "Undo / Redo History",
    description:
      "Every drawing action is stored as a lightweight JSON operation in a runtime history stack. Undo reconstructs the canvas by replaying the remaining operations — nothing is destructively deleted, so redo always works too.",
    tag: "History",
  },
  {
    icon: "😄",
    title: "Live Emoji Reactions",
    description:
      "React to ideas in real time. Click an emoji and it floats upward with your name attached — visible to everyone in the room simultaneously via the same Socket.IO event pipeline as drawing.",
    tag: null,
  },
  {
    icon: "💾",
    title: "Export as JPEG",
    description:
      "Download your entire whiteboard as a high-quality JPEG with one click. The canvas is composited onto a clean white background before export so there are no black transparent areas in the saved image.",
    tag: "Export",
  },
  {
    icon: "🌙",
    title: "Dark & Light Theme",
    description:
      "Switch between a deep purple dark mode and a soft pastel light mode at any time. Theme state is managed globally through React Context so every component updates simultaneously with a single toggle.",
    tag: null,
  },
  {
    icon: "👥",
    title: "Live Member Presence",
    description:
      "See who's in your room — avatars, names, online/offline status, and roles (Host, Editor, Viewer). The member list updates in real time as people join or leave, synced via Socket.IO room events.",
    tag: "Coming Soon",
  },
  {
    icon: "💬",
    title: "Live Chat",
    description: "Communicate without ever leaving the whiteboard.",
    tag: null,
  },
  {
    icon: "🔗",
    title: "Room Sharing & Invite Links",
    description:
      "Share your room instantly via a copyable room code or a direct URL. The Share popup gives both options with a one-click copy that flashes a confirmation checkmark so you always know it worked.",
    tag: null,
  },
];


function Home() {
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
 
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-4">
          {/* Feature 1 — spans 2 columns, matches your big card */}
          <div className="col-span-2">
            <TiltedFeatureCard
              feature = {FEATURES[0]}
              
            />
          </div>
          {/* Feature 2 */}
          <TiltedFeatureCard feature = {FEATURES[1]} />
        </div>
 
        {/* Row 2 — three equal cards */}
        <div className="grid grid-cols-3 gap-4">
          {FEATURES.slice(2, 5).map((f, i) => (
            <TiltedFeatureCard key={i} feature = {f} />
          ))}
        </div>
 
      </div>

                <Link to="/login">
                    <button className="mt-12 px-10 py-3 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(124,58,237,0.35)]">
                        <div className="flex items-center gap-2">
                          <span>Get Started!</span>
                          <ArrowRight />
                        </div>
                    </button>
                </Link>
            </div>
        </div>






    )
}

export default Home