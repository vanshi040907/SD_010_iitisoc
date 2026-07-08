import React, { useContext } from 'react';
import { useState } from "react";
import { Share2, HelpCircle, X, Copy, Check, Link, Zap, Users, Pencil, MessageCircle, Smile, ChevronDown, ChevronUp } from "lucide-react";
import { ThemeContext } from '../context/ThemeContext';
import { RoomContext } from '../context/RoomContext';

const glassDark = {
  background: "rgba(15, 12, 30, 0.92)",
  backdropFilter: "blur(20px)",
  border: "rgba(255, 255, 255, 0.1)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
};

const glassLight = {
  background: "rgba(255, 255, 255, 0.75)",
  backdropFilter: "blur(20px)",
  border: "rgba(168, 85, 247, 0.15)",
  boxShadow: "0 4px 24px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
};
 

function Backdrop({ onClick }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClick}
    />
  );
}

//room code and link we will fetch later from the backend when the mongodb set up will be done and romm creation possible
const ROOM_LINK = `https://whiteboard.app/room/roomId`;

function SharePopup({onClose}){
    const [codeCopied, setCodeCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const {isDark} = useContext(ThemeContext);
    const {roomId} = useContext(RoomContext);

    const glass = isDark ? glassDark : glassLight;
    const {theme} = useContext(ThemeContext);

    const copy = (text, setter)=>{
        navigator.clipboard.writeText(text).catch(()=>{
            comnsole.log("Error!! Unable to copy due to restricted permissions. ");
        });
        setter(true);
        setTimeout(()=>setter(false), 2000);
    }

    return(
        <>
         <Backdrop onClick={onClose}/>
         <div
           className={`fixed z-60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl border ${theme.border} overflow-hidden`}
           style={{ ...glass, zIndex: 60 }}
           onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.popupBorder}`}>
             <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${theme.iconBg} flex items-center justify-center`}>
                  <Share2 size={15} className={`${theme.accent}`} />
                </div>
                <div>
                    <p className={`${theme.textPrimary} text-sm font-semibold`}>Share Room</p>
                    <p className={`${theme.textSecondary} text-xs`}>Invite others to collaborate</p>
                </div>
             </div>
            
             <button onClick={onClose} className={`${theme.textMuted} ${theme.iconButtonHover} transition-colors w-7 h-7 rounded-lg flex items-center justify-center`}>
               <X size={15} />
             </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
                <div>
                    <label className={`${theme.popupLabel} text-xs font-medium uppercase tracking-wider mb-2 block`}>Room Code</label>
                    <div className="flex items-center gap-2">
                        <div className={`flex-1 flex items-center justify-center py-3 rounded-xl border ${theme.popupBorder} font-mono text-2xl font-bold tracking-[0.25em] ${theme.textPrimary}`}
                         style={{ background: "rgba(168,85,247,0.08)" }}>
                            {roomId}
                        </div>
                        <button
                          onClick={() => copy(roomId, setCodeCopied)}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${
                          codeCopied
                            ? `${theme.copied}`
                            : `${theme.popupBorder} ${theme.textPrimary} ${theme.iconButtonHover}` }`}
                            >{codeCopied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                    <p className={`${theme.textSecondary} text-xs mt-2 text-center`}>Share this code with anyone you want to invite</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`flex-1 h-px ${theme.popupDiv}`} />
                  <span className="text-slate-600 text-xs">or share link</span>
                  <div className={`flex-1 h-px ${theme.popupDiv}`} />
                </div>

                <div>
                    <label className={`${theme.popupLabel} text-xs font-medium uppercase tracking-wider mb-2 block`}> ROOM LINK</label>
                    <div className="flex items-center gap-2">
                        <div className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border ${theme.popupBorder} min-w-0 ${theme.textPrimary}`}
                         style={{ background: "rgba(168,85,247,0.08)" }}>
                            <Link size={13} className={`${theme.textPrimary} flex-shrink-0`} />
                            <span className={`${theme.textPrimary} text-xs truncate font-mono`}>{ROOM_LINK}</span>
                        </div>

                        <button onClick={() => copy(ROOM_LINK, setLinkCopied)}
                         className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${
                         linkCopied
                         ? `${theme.copied}`
                         : `${theme.popupBorder} ${theme.textPrimary} ${theme.iconButtonHover}`}`}
                        >
                             {linkCopied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>
            </div>
            <div className={`px-6 py-4 border-t ${theme.popupBorder} flex items-center gap-2`}>
                <span className={`${theme.textSecondary} text-xs`}>Anyone with the code or link can join this room</span>
            </div>
         </div>
        </>
    );
}

const FEATURES = [
  { icon: Pencil, title: "Real-time Drawing", desc: "Draw, sketch, and annotate together with your team instantly." },
  { icon: Users, title: "Multi-user Rooms", desc: "Invite unlimited members with a simple room code or link." },
  { icon: MessageCircle, title: "Live Chat", desc: "Communicate without leaving the whiteboard using the built-in chat." },
  { icon: Smile, title: "Emoji Reactions", desc: "React to ideas in real time with animated floating emojis." },
  { icon: Zap, title: "Instant Sync", desc: "Every stroke and action is synced across all participants instantly." },
  { icon: Pencil, title: "ABCD", desc: "Draw, sketch, and annotate together with your team instantly." },
  { icon: Users, title: "EFGH", desc: "Invite unlimited members with a simple room code or link." },
  { icon: MessageCircle, title: "IJKL", desc: "Communicate without leaving the whiteboard using the built-in chat." },
  { icon: Smile, title: "MNOP", desc: "React to ideas in real time with animated floating emojis." },
  { icon: Zap, title: "QRST", desc: "Every stroke and action is synced across all participants instantly." },
];

function AboutPopup({onClose}){

  const {isDark} = useContext(ThemeContext);
  const glass = isDark ? glassDark : glassLight;
  const {theme} = useContext(ThemeContext);

    return(
        <>
          <Backdrop onClick={onClose} />
          <div
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-2xl border ${theme.popupBorder} overflow-hidden flex flex-col`}
          style={{ ...glass, zIndex: 60, maxHeight: "85vh" }}
          onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.popupBorder} flex-shrink-0`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl ${theme.iconBg} flex items-center justify-center`}>
                  <HelpCircle size={20} className={`${theme.accent}`} />
                </div>
                <div>
                  <p className={`${theme.textPrimary} text-sm font-semibold`}>About & Help</p>
                  <p className={`${theme.textSecondary} text-xs`}>Features </p>
                </div>
              </div>
              <button onClick={onClose} className={`${theme.textMuted}  transition-colors w-7 h-7 rounded-lg ${theme.iconButtonHover}flex items-center justify-center`}>
                <X size={15} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">
              <div>
               <p className={`${theme.popupLabel} text-xs font-medium uppercase tracking-wider mb-3`}>Features</p>
               <div className="flex flex-col gap-2">
                {FEATURES.map((feature)=>{
                  const Icon=feature.icon;
                  // console.log(feature.title);
                  return(
                    <div
                  key={feature.title}
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${theme.popupBorder}`}
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="w-9 h-9 rounded-lg bg-purple-600/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                     <Icon size={18} className={`${theme.accent}`} />
                    </div>
                    <div>
                      <p className={`${theme.textPrimary} text-xs font-semibold`}>{feature.title}</p>
                    <p className={`${theme.textSecondary} text-xs mt-0.5 leading-relaxed`}>{feature.desc}</p>
                    </div>
                  </div>
                  )
})}
               </div> 
              </div>
            </div>
          </div>
        </>        
    );
}

const Invite_help = () => {

  const [shareOpen, setShareOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const {theme} = useContext(ThemeContext);

  const glassBtn = {
    ...theme.glass
  };

  return (
    <>
     <div className={`fixed bottom-4 right-4 z-40 flex items-center gap-1.5 px-2 py-2 rounded-xl border ${theme.border}`} style={glassBtn}>
      <div className="relative group">
        <button
          onClick={() => { setShareOpen(true); setAboutOpen(false); }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme.textPrimary} ${theme.iconButtonHover} transition-all duration-200`}>
            <Share2 size={15} strokeWidth={1.8} />
            <span className="text-xs font-medium">Share</span>
        </button>
        <div className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md border ${theme.border} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl`}
        style={{background:theme.tooltipBg}}>
          Share room code 
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
        </div>
      </div>

      <div className={`w-px h-5 ${theme.divider} rounded-full`} />

      <div className="relative group">
        <button
         onClick={() => { setAboutOpen(true); setShareOpen(false); }}
         className={`w-9 h-9 rounded-lg flex items-center justify-center ${theme.textPrimary} ${theme.iconButtonHover} transition-all duration-200`}>
           <HelpCircle size={16} strokeWidth={1.8} />
        </button>
        <div className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md ${theme.border} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-xl`
      }style={{background:theme.tooltipBg}}>
          About & Help
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
        </div>
      </div>
     </div>

     {shareOpen && <SharePopup onClose={() => setShareOpen(false)} />}
     {aboutOpen && <AboutPopup onClose={() => setAboutOpen(false)} />}
    </>
  );
}

export default Invite_help
