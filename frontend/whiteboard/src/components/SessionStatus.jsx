import React from 'react'
import { useState, useContext} from "react";
import { LogOut, Smile } from "lucide-react";
import { ThemeContext } from '../context/ThemeContext';

const EMOJIS = ["👍", "❤️", "😂", "😮", "🔥", "🎉", "👏", "💡", "✅", "🚀"];
 
const CURRENT_USER = "Vanshika"; 
let reactionIdCounter = 0;

const SessionStatus = () => {

  const {isDark, theme} = useContext(ThemeContext);

  const [emojiOpen, setEmojiOpen] = useState(false);
  const [reactions, setReactions] = useState([]);

  const LaunchReaction = (emoji) => {
    const id= ++reactionIdCounter;
    const left= 30+ Math.floor(Math.random()*40);
    setReactions((prev) => [...prev, { id, emoji, name: CURRENT_USER, left }]);
    setTimeout(() =>{
      setReactions((prev)=> prev.filter((r)=> r.id !== id));
    }, 2800);
    setEmojiOpen(false);
  };

  const glassStyle = {
    ...theme.glass
  };

  return (
    <>
      {reactions.map((r)=>(
        <div 
          key={r.id}
          className="fixed z-50 flex flex-col items-center pointer-events-none"
          style={{
            left: `${r.left}%`,
            bottom: "90px",
            animation: "riseUp 2.8s ease-out forwards",
          }}>
            <span className="text-3xl leading-none">{r.emoji}</span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full mt-1"
            style={{ background: "rgba(168,85,247,0.25)", color: "#c084fc" }}
          >
            {r.name}
          </span> 
          </div>
      ))}

      <div
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 px-3 py-2.5 rounded-2xl border ${theme.divider} flex items-center gap-1 z-40`}
        style={{
          ...glassStyle,
          maxHeight: emojiOpen ? "80px" : "0px",
          opacity: emojiOpen ? 1 : 0,
          transform: emojiOpen ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
          transformOrigin: "bottom center",
          transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease, transform 0.2s ease",
          pointerEvents: emojiOpen ? "auto" : "none",
          overflow: "hidden",
        }}>
          { EMOJIS.map((emoji) => (
            <button
             key={emoji}
             onClick={() => LaunchReaction(emoji)}
             className={`text-xl w-9 h-9 rounded-xl flex items-center justify-center ${theme.hoverEmoji} transition-all duration-150 hover:scale-125`}
             >
              {emoji}
             </button>
          ))}
      </div>

      {/* Bottom card */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div
          className={`flex items-center gap-1 px-2 py-2 rounded-2xl border ${theme.divider}`}
          style={glassStyle}
        >
          <div className="relative group">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${theme.leaveBtn} hover:bg-red-500/25 hover:border-red-500/40 hover:text-red-300 transition-all duration-200`}
              onClick={() => alert("Session ended.")}
              >
                <LogOut size={15} strokeWidth={1.8} />
                <span className="text-xs font-medium">Leave</span>
              </button>
              <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[#1a1a2e] border ${theme.divider} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl`}>
                Leave Session 
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
              </div>
          </div>

          <div className={`w-px h-7 ${theme.divider} mx-1 rounded-full`} />

          <div className="relative group">
            <button
             onClick={() => { setEmojiOpen(!emojiOpen); }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                emojiOpen ? "${theme.activeBg} ${theme.textPrimary} shadow-lg ${theme.activeShadow}" : `${theme.textSecondary} ${theme.whiteHover} ${theme.hoverEmoji}`
              }`}
            >
              <Smile size={17} strokeWidth={1.8} />
            </button>
            <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[#1a1a2e] border ${theme.divider} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl`}>
              React
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes riseUp {
          0%   { transform: translateY(0px);   opacity: 1; }
          70%  { transform: translateY(-180px); opacity: 1; }
          100% { transform: translateY(-220px); opacity: 0; }
        }
      `}</style>

    </>
  );
}

export default SessionStatus
