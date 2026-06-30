import React from 'react'
import { useState, useContext } from "react";
import { Pencil, StickyNote, Type, Shapes, ChevronDown, Undo2, Redo2, Eraser, MousePointer2, Minus, Square, Circle, Triangle, Highlighter, Pen, } from "lucide-react";
import { ThemeContext } from '../context/ThemeContext';
import { WhiteboardContext } from '../context/WhiteboardContext';

const tools = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "pen", icon: Pencil, label: "Pen" },
  { id: "sticky", icon: StickyNote, label: "Sticky Note" },
  { id: "highlighter", icon: Highlighter, label: "Highlighter" },
  { id: "text", icon: Type, label: "Text" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
];

const shapeTools = [
  { id: "rect", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "triangle", icon: Triangle, label: "Triangle" },
  { id: "line", icon: Minus, label: "Line" },
];

const SWATCHES = ["#a855f7", "#3b82f6", "#22c55e", "#f97316", "#ef4444", "#ffffff", "#000000"];

const Toolbar = () => {


  const { theme, isDark } = useContext(ThemeContext);
  const { activeTool, setActiveTool, activeColor, setActiveColor, strokeWidth, setStrokeWidth, undo, redo, canUndo, canRedo, activeShape,
    setActiveShape } = useContext(WhiteboardContext);

  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [shapesOpen, setShapesOpen] = useState(false);

  const [rangeOpen, setRangeOpen] = useState(false);

  const ToolTipButton = ({ id, icon: Icon, label, onClick, isActive, disabled }) => (<div className="relative group flex items-center justify-center">
    <button
      onClick={onClick}
      disabled={disabled}
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

    <div className={`absolute left-full ml-6 px-2 py-1 rounded-md border ${theme.border} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl`}
      style={{
        background: theme.tooltipBg
      }}>
      {label}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a2e]" />
    </div>
  </div>
  );


  return (
    <>
      <div
        className={`w-18 fixed top-28 left-4 flex flex-col items-center gap-1 px-2 py-3 rounded-2xl border ${theme.border} shadow-2xl z-5`}
        style={{
          ...theme.glass
        }}
      >
        {tools.map((tool) => (
          <ToolTipButton
            key={tool.id}
            {...tool}
            onClick={() => setActiveTool(tool.id)}
            isActive={activeTool === tool.id}
          />
        ))}

        {/* add horizontal seperator */}
        <div className={`w-6 h-px ${theme.divider} my-1 rounded-full`} />

        <div className="relative flex flex-col items-center">
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => setShapesOpen(!shapesOpen)}
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative
                ${activeTool === "shape"
                  ? `${theme.activeBg} ${theme.textPrimary} shadow-lg ${theme.activeShadow}`
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
            <div className={`absolute left-full ml-6 px-2 py-1 rounded-md border ${theme.border} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl`}
              style={
                { background: theme.tooltipBg }
              }>
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
                  onClick={() => {
                    setActiveShape(shape.id);
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

        <div className="relative flex flex-col items-center">
          <div className="relative group flex items-center justify-center">
            <button
              onClick={() => setColorPickerOpen(!colorPickerOpen)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200">
              <div
                className={`w-6 h-6 rounded-full border-2 ${theme.border} bg-[conic-gradient(red,magenta,blue,cyan,green,yellow,red)]`}

              />
            </button>
            <div
              className={`absolute left-full ml-6 px-2 py-1 rounded-md border ${theme.border} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl`}
              style={{ background: theme.tooltipBg }}>
              Colour
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a2e]" />
            </div>
          </div>

          {colorPickerOpen && (
            <div
              className={`absolute left-full ml-3 p-3 rounded-xl border ${theme.border} z-50 flex flex-col gap-3`}
              style={{ ...theme.glass, top: "50%", transform: "translateY(-50%)", width: "180px" }}>

              {/* Swatches */}
              <div className="grid grid-cols-4 gap-2">
                {SWATCHES.map((swatch) => (
                  <button
                    key={swatch}
                    onClick={() => setActiveColor(swatch)}
                    className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${activeColor === swatch ? `ring-1 ring-offset-1/2 ${theme.colorpicker}ring-offset-transparent` : ""
                      }`}
                    style={{ background: swatch }}
                  />
                ))}
              </div>

              {/* custom colours */}
              <label className={`flex items-center gap-2 text-xs ${theme.textSecondary} cursor-pointer`}>
                <input
                  type="color"
                  value={activeColor}
                  onChange={(e) => setActiveColor(e.target.value)}
                  className="w-8 h-8 rounded-sm cursor-pointer border-none bg-[conic-gradient(red,magenta,blue,cyan,green,yellow,red)] p-0"
                />
                Custom
              </label>
            </div>
          )}
        </div>

        {/* stroke width custom selector */}

        <div className="relative flex flex-col items-center">
          <div className="relative group flex items-center justify-center">
            <button onClick={() => {
              setRangeOpen(!rangeOpen)
            }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${theme.border}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${theme.border}`}>
                <div className={` rounded-full border-2 ${theme.border}`}
                  style={{ background: activeColor, width: strokeWidth, height: strokeWidth }} />
              </div>
            </button>
            <div
              className={`absolute left-full ml-6 px-2 py-1 rounded-md border ${theme.border} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl`}
              style={{ background: theme.tooltipBg }}>
              Stroke Width
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a2e]" />
            </div>
          </div>

          {rangeOpen && (
            <div
              className={`absolute left-full ml-5 p-3 rounded-xl border ${theme.border} z-50 flex flex-col gap-3`}
              style={{ ...theme.glass, width: "110px" }}>
              <div className="relative group flex flex-col items-center gap-1 px-1 py-2">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-24 origin-center accent-purple-500"
                  style={{ marginBlock: "0.1px" }}
                />
                <div className={`absolute left-full ml-6 px-2 py-1 rounded-md border ${theme.border} text-xs text-slate-200 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-xl`}
                  style={{ background: theme.tooltipBg }}>
                  Width: {strokeWidth}px
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1a1a2e]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`w-6 h-px ${theme.divider} my-1 rounded-full`} />

        {/* undo and redo buttons  */}

        <ToolTipButton id="undo" icon={Undo2} label="Undo" onClick={undo} isActive={false} disabled={!canUndo} />
        <ToolTipButton id="redo" icon={Redo2} label="Redo" onClick={redo} isActive={false} disabled={!canRedo} />
      </div>

      <div className={`left-13 -translate-x-1/2 fixed top-167 px-4 py-1.5 rounded-full border ${theme.border} text-xs ${theme.textSecondary}`}
        style={{ ...theme.glass }}
      >
        Active: <span className={`${theme.accent} font-medium capitalize`}>{activeTool === "shape" ? activeShape : activeTool}</span>
      </div>
    </>
  )
}

export default Toolbar
