import React from 'react'
import { useState, useRef } from 'react';

const FeatureCard = ({feature}) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glowStyle, setGlowStyle] = useState({});
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) =>{
    const card = cardRef.current;
    if(!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(1000px) rotateX(${-y*24}deg) rotateY(${x * 24}deg) scale(${1.05})`,
      transition: "transform 0.05s ease-out",
    });
    setGlowStyle({
      left: `${(x + 0.5) * 100}%`,
      top: `${(y + 0.5) * 100}%`,
      opacity: 1,
      transition: "opacity 0.1s ease",
    });
  };
  
  const handleMouseLeave = ()=>{
    setHovered(false);
    setStyle({
        transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: "transform 1s cubic-bezier(0.34,1.56,0.64,1)",
    });
    setGlowStyle({ opacity: 0, transition: "opacity 0.4s ease" });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`
        relative overflow-hidden rounded-2xl cursor-pointer
        border p-6 flex flex-col gap-3 min-h-[180px]
        will-change-transform
        bg-[rgba(20,10,40,0.75)]
        transition-[box-shadow,border-color] duration-300
        ${hovered
          ? "border-purple-500/50 shadow-[0_20px_60px_rgba(124,58,237,0.3)]"
          : "border-purple-500/20"
        }
      `}>
      
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full w-[200px] h-[200px]"
        style={{
          ...glowStyle,
          background: "radial-gradient(circle, rgba(168,85,247,0.28) 0%, transparent 70%)",
        }}/>

        <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
        style={{
          background: hovered
            ? "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)"
            : "none",
        }}
      />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between">
            <span className={`text-3xl inline-block transition-transform duration-300 ${hovered ? "scale-110" : "scale-100"}`}>
                {feature?.icon}
            </span>
            {feature.tag && (
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25">
                    {feature.tag}
                </span>
            )}
        </div>

        <h3 className={`text-sm font-semibold leading-snug transition-colors duration-300 ${hovered ? "text-white" : "text-purple-100"}`}>
            {feature.title}
        </h3>
        <p className="text-xs leading-relaxed text-purple-200/55">
            {feature.description
        }</p>
      </div>

       <div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl transition-all duration-500"
        style={{
          background: hovered
            ? "linear-gradient(90deg, transparent, #a855f7, transparent)"
            : "transparent",
        }}
      />
    </div>
  )
}

export default FeatureCard
