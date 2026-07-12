import React, { useContext } from 'react';
import { useState } from "react";
import {
  Pencil, Highlighter, Eraser, Type, Shapes,
  MousePointer2, Pointer, Undo2, Redo2, Palette,
  SlidersHorizontal, Download, Share2, Users,
  MessageCircle, Smile, LogOut, Sun, Trash2, Sparkles, HelpCircle, X, Copy, Link
} from "lucide-react";
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
  {
    icon: Pencil,
    title: "Pen Tool",
    desc: "Draw freehand strokes on the canvas. Select it from the toolbar, then click and drag to draw. Change color using the color picker and adjust thickness with the stroke width slider.",
  },
  {
    icon: Highlighter,
    title: "Highlighter",
    desc: "Draw semi-transparent strokes to highlight areas of the board. Works exactly like the pen but with a wider, translucent brush — great for marking important regions.",
  },
  {
    icon: Eraser,
    title: "Eraser",
    desc: "Remove strokes from the canvas. Select the eraser, then click and drag over any area you want to clear. The eraser is stored as an operation, so undo/redo works correctly with it.",
  },
  {
    icon: Type,
    title: "Text Tool",
    desc: "Add text anywhere on the board. Select the text tool, then click on the canvas where you want to type. A floating text box appears — type your content, then press Enter or click outside to commit it. Press Escape to cancel.",
  },
  {
    icon: Shapes,
    title: "Shape Tools",
    desc: "Draw geometric shapes by clicking the shapes icon in the toolbar to expand the submenu. Choose from Rectangle, Circle, Triangle, or Line. Click and drag on the canvas to draw — the shape previews live as you drag and commits when you release.",
  },
  {
    icon: MousePointer2,
    title: "Select Tool",
    desc: "Switch back to the default pointer mode without drawing anything. Use this when you want to interact with UI elements (toolbar, popups, chat) without accidentally drawing on the canvas.",
  },
  {
    icon: Pointer,
    title: "Laser Pointer",
    desc: "Point to areas of the board without leaving any permanent marks. Select the laser tool and move your mouse — a glowing red dot with a fading trail appears and is visible to all participants in real time. Nothing is saved to the canvas history.",
  },
  {
    icon: Undo2,
    title: "Undo",
    desc: "Removes the most recent drawing operation from the canvas and moves it to the redo stack. Every tool action — strokes, shapes, text, and eraser — is individually undoable. Keyboard shortcut: Ctrl+Z (Cmd+Z on Mac).",
  },
  {
    icon: Redo2,
    title: "Redo",
    desc: "Reapplies the most recently undone action. The redo stack clears automatically if you draw something new after undoing. Keyboard shortcut: Ctrl+Y or Ctrl+Shift+Z (Cmd+Shift+Z on Mac).",
  },
  {
    icon: Palette,
    title: "Color Picker",
    desc: "Opens a custom color picker panel. Drag the color map to pick any hue, saturation and brightness. Use the hue bar to change the base color, type a hex code directly, or click a preset swatch. The eyedropper button (Chrome 95+) lets you pick any color from anywhere on your screen.",
  },
  {
    icon: SlidersHorizontal,
    title: "Stroke Width",
    desc: "The vertical slider in the toolbar controls how thick or thin your strokes are. Drag up for thinner lines, drag down for thicker ones. The current width applies to the pen, highlighter, and shape outlines.",
  },
  {
    icon: Download,
    title: "Download as JPEG",
    desc: "Exports the entire current whiteboard as a JPEG image file. Click the download icon in the top-left header. The canvas is composited onto a white background before export so the image looks correct in all viewers.",
  },
  {
    icon: Share2,
    title: "Share Room",
    desc: "Opens the share popup with your room code and a direct invite link. Copy the room code and share it verbally or via chat — anyone who enters the code on the join screen can request access to your session.",
  },
  {
    icon: Users,
    title: "Member List",
    desc: "Click the member count badge in the top-right to see everyone in your room. Each member shows their name, role (Host, Editor, or Viewer), and online/away status. The count updates in real time as people join or leave.",
  },
  {
    icon: MessageCircle,
    title: "Chat",
    desc: "Click the chat bubble icon in the bottom bar to open the live chat panel. Type a message and press Enter to send. Messages are visible to all room members instantly. Your messages appear on the right, others on the left.",
  },
  {
    icon: Smile,
    title: "Emoji Reactions",
    desc: "Click the emoji icon in the bottom bar to open the reaction picker. Select any emoji and it floats upward from the bottom of the screen with your name attached — visible to everyone in the room simultaneously in real time.",
  },
  {
    icon: LogOut,
    title: "Leave Session",
    desc: "Click the Leave button in the bottom bar to disconnect from the current room. Your drawing history is saved to the board — if you rejoin with the same room code, everything you drew will still be there.",
  },
  {
    icon: Sun,
    title: "Dark / Light Theme",
    desc: "Click the sun/moon icon to toggle between the dark purple theme and the soft pastel light theme. The theme applies instantly across every component in the app and is independent per user — each person in the room can use their own preferred theme.",
  },
  {
    icon: Trash2,
    title: "Clear Canvas",
    desc: "Removes all strokes and shapes from the board permanently. This action is broadcast to all room members so everyone's canvas clears simultaneously. Unlike undo, clear canvas cannot be reversed — use it carefully.",
  },
  {
    icon: Sparkles,
    title: "AI Session Summary",
    desc: "Click the AI button to generate an automatic summary of your whiteboard session. Claude AI analyzes what was drawn on the canvas and the chat conversation, then produces a short paragraph describing the session's topics, ideas, and conclusions. Useful for capturing meeting notes without any manual effort.",
  },
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
