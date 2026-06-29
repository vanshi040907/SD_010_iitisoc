import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import Ferrofluid from "../animations/Ferrofluid";
import LetsCoSketh from '../animations/LetsCoSketh';
import TiltedFeatureCard from '../components/FeatureCard';
import TextPressure from '../animations/TextPressure';

const FEATURES = [
  {
    icon: "🎨",
    title: "Real-time Drawing",
    description: "Draw together on a shared canvas with zero lag using HTML5 Canvas.",
    tag: "Core",
  },
  {
    icon: "👥",
    title: "Multi-user Rooms",
    description: "Invite your team instantly with a room code or shareable link.",
    tag: "Rooms",
  },
  {
    icon: "💬",
    title: "Live Chat",
    description: "Communicate without ever leaving the whiteboard.",
    tag: null,
  },
  {
    icon: "😄",
    title: "Emoji Reactions",
    description: "React to ideas with animated floating emojis in real time.",
    tag: null,
  },
  {
    icon: "⚡",
    title: "Instant Sync",
    description: "Every stroke syncs across all participants immediately via Socket.io.",
    tag: "Sync",
  },
];


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
          {FEATURES.slice(2).map((f, i) => (
            <TiltedFeatureCard key={i} feature = {f} />
          ))}
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