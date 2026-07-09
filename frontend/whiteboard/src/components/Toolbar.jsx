import React, { useEffect } from 'react'
import { useState, useContext, useRef } from "react";
import { StickyNote, Type, Shapes, ChevronDown, Undo2, Redo2, Eraser, MousePointer2, Minus, Square, Circle, Triangle, Highlighter, Pen, Pointer, } from "lucide-react";
import { ThemeContext } from '../context/ThemeContext';
import { WhiteboardContext } from '../context/WhiteboardContext';
import ColorPicker from './ColorPicker';

const tools = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "pen", icon: Pen, label: "Pen" },
  { id: "sticky", icon: StickyNote, label: "Sticky Note" },
  { id: "highlighter", icon: Highlighter, label: "Highlighter" },
  { id: "text", icon: Type, label: "Text" },
  { id: "eraser", icon: Eraser, label: "Eraser" },
  { id: "laser", icon: Pointer, label: "Laser Pointer" },
  
];

const shapeTools = [
  { id: "rect", icon: Square, label: "Rectangle" },
  { id: "circle", icon: Circle, label: "Circle" },
  { id: "triangle", icon: Triangle, label: "Triangle" },
  { id: "line", icon: Minus, label: "Line" },
];

const Toolbar = () => {

  const pickerRef = useRef(null);
  const shapesRef = useRef(null);
  const rangeRef = useRef(null);

  const { theme, isDark } = useContext(ThemeContext);
  const { activeTool, setActiveTool, activeColor, setActiveColor, strokeWidth, setStrokeWidth, undo, redo, canUndo, canRedo, activeShape,
    setActiveShape } = useContext(WhiteboardContext);

  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [shapesOpen, setShapesOpen] = useState(false);

  const [rangeOpen, setRangeOpen] = useState(false);

  useEffect(()=>{
    const handleClickOOutside = (e)=>{
      if(pickerRef.current && !pickerRef.current.contains(e.target)){
        setColorPickerOpen(false);
      }
    };
    if(colorPickerOpen) {
      document.addEventListener("mousedown", handleClickOOutside);
    }
    return ()=>document.removeEventListener("mousedown", handleClickOOutside);
  }, [colorPickerOpen]);

  useEffect(()=>{
    const handleClickOOutside = (e)=>{
      if(shapesRef.current && !shapesRef.current.contains(e.target)){
        setShapesOpen(false);
      }
    };
    if(shapesOpen) {
      document.addEventListener("mousedown", handleClickOOutside);
    }
    return ()=>document.removeEventListener("mousedown", handleClickOOutside);
  }, [shapesOpen]);

  useEffect(()=>{
    const handleClickOOutside = (e)=>{
      if(rangeRef.current && !rangeRef.current.contains(e.target)){
        setRangeOpen(false);
      }
    };
    if(rangeOpen) {
      document.addEventListener("mousedown", handleClickOOutside);
    }
    return ()=>document.removeEventListener("mousedown", handleClickOOutside);
  }, [rangeOpen]);

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
        className={`w-18 fixed top-28 left-4 flex flex-col items-center gap-1 px-2 py-3 rounded-2xl border ${theme.border} shadow-2xl z-50`}
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
              ref={shapesRef}
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
          <div 
          className="relative group flex items-center justify-center">
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
            ref={pickerRef}
            className="absolute left-full ml-8 z-50" style={{ top: "50%", transform: "translateY(-75%)" }}>
            <ColorPicker
              value={activeColor}
              onChange={(hex) => {
                setActiveColor(hex);   // updates context → Whiteboard reads it
              }}
            />
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
              ref={rangeRef}
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
