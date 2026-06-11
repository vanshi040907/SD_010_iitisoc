import React from 'react'
import { useState, useContext } from "react";
import { Pencil, LayoutDashboard, StickyNote, Type, Shapes, ChevronDown, Undo2, Redo2,Eraser, MousePointer2, Minus, Square, Circle, Triangle, Highlighter, Pen,  } from "lucide-react";
import { ThemeContext } from '../context/ThemeContext';
 
const tools = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "pen", icon: Pencil, label: "Pen" },
  { id: "layout", icon: LayoutDashboard, label: "Frame" },
  { id: "sticky", icon: StickyNote, label: "Sticky Note" },
  { id: "text", icon: Type, label: "Text" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
];
 
const shapeTools = [
  { id: "rect", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "triangle", icon: Triangle, label: "Triangle" },
  { id: "line", icon: Minus, label: "Line" },
];
 
const penStyle = [
  {id: "pencil", icon: Pencil, label: "Pencil"},
  {id: "highlighter", icon: Highlighter, label: "Highlighter"},
  {id: "pen", icon: Pen, label: "Pen"},
];

const Toolbar = () => {

  const {theme, isDark} = useContext(ThemeContext);

  const [activeTool, setActiveTool] = useState("pen");
  const [shapesOpen, setShapesOpen] = useState(false);
  const [activeShape, setActiveShape] = useState("rect");

  const ToolTipButton = ({id, icon: Icon, label, onClick, isActive}) => (<div className="relative group flex items-center justify-center">
      <button
      onClick={()=> onClick(id)}
      className={`
          w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200
          ${isActive
            ? `${theme.activeBg} ${theme.textPrimary} shadow-lg ${theme.activeShadow}`
            : `${theme.textSecondary} ${theme.hover}`
          }
        `}
        >
          <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
        </button>

        <div className={`absolute left-full ml-3 px-2 py-1 rounded-md bg-[#1a1a2e] border ${theme.border} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl`}>
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a2e]" />
      </div>
    </div>
    );
    

  return (
    <>
      <div
        className={`w-18 fixed top-36 left-4 flex flex-col items-center gap-1 px-2 py-3 rounded-2xl border ${theme.border} shadow-2xl`}
        style={{
          ...theme.glass
        }}
      >
        {tools.map((tool) => (
          <ToolTipButton
            key={tool.id}
            {...tool}
            onClick={setActiveTool}
            isActive={activeTool === tool.id}
          />
        ))}

        {/* add horizontal seperator */}
        <div className={`w-6 h-px ${theme.divider} my-1 rounded-full`} /> 

        <div className="relative flex flex-col items-center">
          <div className="relative group flex items-center justify-center">
            <button
            onClick={()=> setShapesOpen(!shapesOpen)}
            className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative
                ${activeTool === "shape"
                  ? `${theme.activeBg} ${textPrimary} shadow-lg ${theme.activeShadow}`
                  : `${theme.textSecondary} ${theme.hover}`
                }
              `}
              >
               <Shapes size={18} strokeWidth={1.8} />
              <ChevronDown
                size={8}
                className={`absolute bottom-1.5 right-1.5 transition-transform duration-200 ${shapesOpen ? "rotate-180" : ""}`}
              /> 
              </button>
              <div className={`absolute left-full ml-3 px-2 py-1 rounded-md bg-[#1a1a2e] border ${theme.border} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl`}>
              Shapes
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a2e]" />
           </div>
          </div>

          {shapesOpen && (
            <div
              className={`absolute left-full ml-3 flex flex-col gap-1 p-2 rounded-xl border ${theme.border} z-50`}
              style={{

                ...theme.glass,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              {shapeTools.map((shape) => (
                <ToolTipButton 
                  key={shape.id}
                  {...shape}
                  onClick={(id) => {
                    setActiveShape(id);
                    setActiveTool("shape");
                    setShapesOpen(false);
                  }}
                  isActive={activeTool === "shape" && activeShape === shape.id}
                  />
              ))}
            </div>
          )}

        </div>
        <div className={`w-6 h-px ${theme.divider} my-1 rounded-full`} />
         <ToolTipButton id="undo" icon={Undo2} label="Undo" onClick={() => {}} isActive={false} />
        <ToolTipButton id="redo" icon={Redo2} label="Redo" onClick={() => {}} isActive={false} />
      </div>

      <div className={`left-13 -translate-x-1/2 fixed top-154 px-4 py-1.5 rounded-full border ${theme.border} text-xs ${theme.textSecondary}`}
        style={{ background: "rgba(15,12,30,0.8)", backdropFilter: "blur(8px)" }}
      >
        Active: <span className={`${theme.accent} font-medium capitalize`}>{activeTool === "shape" ? activeShape : activeTool}</span>
      </div>
    </>
  )
}

export default Toolbar
