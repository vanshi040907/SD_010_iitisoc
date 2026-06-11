import React from 'react'
import { useState, useContext } from "react";
import { Users, ChevronDown, Circle, TheaterIcon } from "lucide-react";
import { ThemeContext } from '../context/ThemeContext';

// Right now i have taken a random array for the members. later we will fetch these details from the Database.

const MEMBERS = [
  { id: 1, name: "Vishruthi", role: "Host", online: true },
  { id: 2, name: "Vanshika", role: "Editor", online: true },
  { id: 3, name: "Saumya", role: "Editor", online: true },
  { id: 4, name: "Pranjali", role: "Viewer", online: false },
  { id: 5, name: "Hello XYZ", role: "Viewer", online: false },
];

const Avatar = ({member, size = "md"}) => {

  const {theme, isDark} = useContext(ThemeContext);
  const dim = member.role === "Host" ? "w-12 h-12 text-2xl" : "w-9 h-9 text-m";
  return(
    <div
      className={`${dim} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ring-2 ring-[#0d0d1a]`}
      style={{ background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0') }}
    >
      {member.name[0]}
    </div>
  );
}


const MemberList = () => {

  const [open, setOpen] = useState(false);
  const onlineCount = MEMBERS.filter((m) => m.online).length;
  const {theme} = useContext(ThemeContext);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <button
       onClick={()=> setOpen(!open)}
       className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${theme.border} transition-all duration-200 hover:border-purple-500/40`}
        style={{
          ...theme.glass
        }}
        >
          {/* here i writing the logic for stacking of the initials  */}
          <div className="flex items-center">
            {MEMBERS.slice(0, 3).map((m, i) => (
              <div key={m.id} className="w-10 h-10 rounded-full flex items-center justify-center text-l font-semibold text-white ring-2 ring-[#0d0d1a] flex-shrink-0"
              style={{ background:"#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'), marginLeft: i === 0 ? 0 : "-8px", zIndex: 3 - i }}
              >
                {m.name[0]}
              </div>
            ))}
             {/* For Extra members */}
            {MEMBERS.length > 3 && (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-slate-300 ring-2 ring-[#0d0d1a] flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.1)", marginLeft: "-8px" }}
            >
              +{MEMBERS.length - 3}
            </div>
          )}
          </div>

          <div className="h-14 flex flex-col justify-center items-start leading-tight">
          <span className="text-white text-m font-semibold">{MEMBERS.length} Members</span>
          <span className={`${theme.accent} text-[12px]`}>{onlineCount} online</span>
         </div>

         <ChevronDown
          size={14}
          className={`${theme.textSecondary}transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        </button>

        <div
        className={`mt-2 w-69.5 rounded-xl border ${theme.border} overflow-hidden`}
        style={{
          background: "rgba(15, 12, 30, 0.92)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          // animate open/close
          maxHeight: open ? "400px" : "0px",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scaleY(1)" : "translateY(-8px) scaleY(0.95)",
          transformOrigin: "top right",
          transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: open ? "auto" : "none",
        }}
        >
          <div className={`flex items-center gap-2 px-4 py-3 border-b ${theme.border}`}>
           <Users size={13} className="${theme.accent}" />
           <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">VIEWERS</span>
          </div>

          <div className="flex flex-col py-1.5">
            {MEMBERS.map((m)=>(
              <div
               key={m.id}
               className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors duration-150 cursor-default"
               >
                <div className="relative">
                   <Avatar member={m} />
                   <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#0d0d1a] ${m.online ? "bg-green-400" : "bg-slate-600"}`}
                  />
                </div>
                
                <div className="flex flex-col leading-tight flex-1 min-w-0">
                  <span className="text-white text-sm font-medium truncate">{m.name}</span>
                <span className={`${theme.textMuted} text-xs`}>{m.role}</span>
                </div>

                <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  m.online
                    ? "bg-green-500/15 text-green-400"
                    : "bg-white/5 `bg-white/5 ${theme.textMuted}`"
                }`}
              >
                {m.online ? "Online" : "Away"}
              </span>
              </div>
            ))}
          </div>

          <div className={`px-4 py-2.5 border-t ${theme.border} flex items-center gap-1.5`}>
           <Circle size={7} className="text-green-400 fill-green-400" />
           <span className={`${theme.textMuted} text-xs`}>{onlineCount} of {MEMBERS.length} currently active</span>
          </div>
        </div>
    </div>
  );
}

export default MemberList
