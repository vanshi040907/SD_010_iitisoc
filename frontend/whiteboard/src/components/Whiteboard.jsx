import React from 'react'
import { useRef, useContext, useEffect, useCallback, useState } from "react";
import { WhiteboardContext } from '../context/WhiteboardContext';
import conf from '../conf/conf';
import axios from 'axios';
import { useSocket } from '../context/Socket';

const THROTTLE_MS = 10;

const Whiteboard = () => {
  const socket = useSocket();

  // state for the floating text input box position, value, and id of item being edited
  const [textInput, setTextInput] = useState(null);
    const [add,setAdd] = useState(0);

  const { activeTool, activeShape, activeColor, strokeWidth, registerEngine, bump, notifyHistortChange } = useContext(WhiteboardContext);

  const activeColorRef = useRef(activeColor);
  const strokeWidthRef = useRef(strokeWidth);
  const shapeStartRef = useRef(null);
  const previewShapeRef = useRef(null);
  const activeToolRefLocal = useRef(activeTool); //  ref mirror for activeTool, needed inside mouse handlers

  useEffect(() => { activeColorRef.current = activeColor; }, [activeColor]);
  useEffect(() => { strokeWidthRef.current = strokeWidth; }, [strokeWidth]);
  useEffect(() => { activeToolRefLocal.current = activeTool; }, [activeTool]); //  keep local tool ref in sync

  //  ref mirrors for color and font size needed inside text commit handler
  const activeColorRefText = useRef(activeColor);
  useEffect(() => { activeColorRefText.current = activeColor; }, [activeColor]);

  useEffect (() => {
    const fetchData = async () => {
    try {
      const res = await axios.get(
        `${conf.path}/whiteboard/getdata`,

        {
          withCredentials: true,
        },
      );
      const whiteboard = res.data.data;
      const size = whiteboard.length;
        if(size>0) {
        const historyflatted= whiteboard
        .map((item) => item. drawingOperations)
        .flat();
        historyStackRef.current = historyflatted

        
          redrawAll();
        }
      
        
    } catch (error) {
      console.log(error);
    }
  }; 
  fetchData();
  

  },[])

  const undo = async () => {
    if (historyStackRef.current.length === 0) return;
    const last = historyStackRef.current.pop();
    redoStackRef.current.push(last);
     try {
      await axios.get(
       ` ${conf.path}/whiteboard/undo`,  {
    withCredentials: true,
  }
      );
      
      
    } catch (error) {
      console.log(error);
    }
    redrawAll();
    redraw();
  }

  const redo = async() => {
    if (redoStackRef.current.length === 0) return;
    const restored = redoStackRef.current.pop();
    historyStackRef.current.push(restored);
     try {
      await axios.post(
        `${conf.path}/whiteboard/redo`,{
           drawingOperations: restored,
        },  {
    withCredentials: true,
  }
      );
      
      
    } catch (error) {
      console.log(error);
    }
    redrawAll();
    redraw();
  }

  const downloadCanvas = useCallback(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;

    const tempCanvas =document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.fillStyle = "#000000";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    historyStackRef.current.forEach((stroke)=> drawStroke(tempCtx, stroke));

    const dataUrl = tempCanvas.toDataURL("image/jpeg", 0.95);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `whiteboard-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  useEffect(() => {
    registerEngine({
      undo,
      redo,
      canUndo: () => historyStackRef.current.length > 0,
      canRedo: () => redoStackRef.current.length > 0,
      downloadCanvas,
    });
  }, [add]);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  //operation storage for undo and redo
  const historyStackRef = useRef([]);
  const redoStackRef = useRef([]);

  //live state management
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef(null);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const lastEmitTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redrawAll();
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    return () => window.removeEventListener("resize", resize);

  }, []);
  
  const redraw = () => {
    socket.emit('historysend' ,{history:historyStackRef.current});
  }
  useEffect (() => {
    const handlesocket = (data) => {
      const {history} = data;
      historyStackRef.current = history;
      redrawAll();
    }
    socket.on("historyreceived",handlesocket)
      return () => {
        socket.off("historyreceived",handlesocket);
      }
    
  },[socket])
  useEffect(() => {
   const handlesocket = (data) => {
      drawSegment(ctxRef.current,
        data.previousPoint,
      data.point,
      data.color,
      data.width,
      data.isEraser,
      data.opacity

      )
    }
     const handleshape = (data) => {
      redrawAll();
      drawShape(ctxRef.current,
        data.shape)
      
    }
     const handletext = (data) => {
      
      
      
        
      drawText(ctxRef.current, {
          x: data.newTextItem.x,
        y: data.newTextItem.y,
        text: data.newTextItem.value,
        color:data.newTextItem.color ,
        fontSize: data.newTextItem.fontSize,

      }  );
      
    }
    socket.on("currentreceived",handlesocket);
    
    socket.on("currentshapereceived",handleshape);
   
    socket.on("showtext",handletext);
      return () => {
        socket.off("currentreceived",handlesocket);
        socket.off("currentshapereceived",handleshape);
         socket.off("showtext",handletext);
      }

    

},[socket])


  //function for undo/redo/ first initialisation of the canvas- complete redraw through object array saved
  const redrawAll = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    historyStackRef.current.forEach((item) => {


      if (item.type === "stroke") {
        drawStroke(ctx, item);
      }

      else if (item.type === "text") {
        drawText(ctx, item);
      }

      else {
        drawShape(ctx, item);
      }
    });

  }, []);

  //single stroke drawing
  const drawStroke = (ctx, stroke) => {

    const {
      points,
      color,
      width,
      isEraser,
      opacity = 1
    } = stroke;

    if (points.length < 2) return;

    ctx.save();

    if (isEraser) {
      ctx.globalCompositeOperation =
        "destination-out";
    } else {
      ctx.globalCompositeOperation =
        "source-over";
    }

    ctx.globalAlpha = opacity;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(
      points[0].x,
      points[0].y
    );

    for (
      let i = 1;
      i < points.length - 1;
      i++
    ) {

      const midX =
        (points[i].x +
          points[i + 1].x) / 2;

      const midY =
        (points[i].y +
          points[i + 1].y) / 2;

      ctx.quadraticCurveTo(
        points[i].x,
        points[i].y,
        midX,
        midY
      );
    }

    const last =
      points[points.length - 1];

    ctx.lineTo(
      last.x,
      last.y
    );

    ctx.stroke();

    ctx.restore();
  };

  const drawRect = (ctx, shape) => {
    const x = Math.min(shape.start.x, shape.end.x);
    const y = Math.min(shape.start.y, shape.end.y);
    const width = Math.abs(shape.end.x - shape.start.x);
    const height = Math.abs(shape.end.y - shape.start.y);

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.strokeRect(x, y, width, height);
  };

  const drawLineShape = (ctx, shape) => {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();
    ctx.moveTo(shape.start.x, shape.start.y);
    ctx.lineTo(shape.end.x, shape.end.y);
    ctx.stroke();
  };

  const drawCircle = (ctx, shape) => {
    const dx = shape.end.x - shape.start.x;
    const dy = shape.end.y - shape.start.y;

    const radius = Math.sqrt(dx * dx + dy * dy);

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();
    ctx.arc(
      shape.start.x,
      shape.start.y,
      radius,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  };

  const drawTriangle = (ctx, shape) => {
    const start = shape.start;
    const end = shape.end;

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();

    ctx.moveTo(
      (start.x + end.x) / 2,
      start.y
    );

    ctx.lineTo(
      start.x,
      end.y
    );

    ctx.lineTo(
      end.x,
      end.y
    );

    ctx.closePath();
    ctx.stroke();
  };

  const drawShape = (ctx, shape) => {
    
    switch (shape.type) {
      case "rect":
        drawRect(ctx, shape);
        break;

      case "circle":
        drawCircle(ctx, shape);
        break;

      case "triangle":
        drawTriangle(ctx, shape);
        break;

      case "line":
        drawLineShape(ctx, shape);
        break;

      default:
        break;
    }
  };
  

  const drawSegment = (
    ctx,
    from,
    to,
    color,
    width,
    isEraser = false,
    opacity = 1
  ) => {

    ctx.save();

    if (isEraser) {
      ctx.globalCompositeOperation =
        "destination-out";
    }

    ctx.globalAlpha = opacity;

    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.restore();
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  const drawText = (ctx, item) => {
    ctx.save();

    ctx.fillStyle = item.color;

    ctx.font = `${item.fontSize}px Arial`;

    ctx.fillText(
      item.text,
      item.x,
      item.y
    );

    ctx.restore();
  };

  // commits the floating input box text onto the canvas as a history item
  // called on Enter key or when the input loses focus
  const commitText = useCallback(async(inputState) => {
    if (!inputState || !inputState.value.trim()) {
       
      setTextInput((prev) => (prev?.value.trim() ? prev : null));
      return;
    }
    

    // if editing an existing text item, remove the old one first
    if (inputState.editingId) {
      historyStackRef.current = historyStackRef.current.filter(
        (item) => item.id !== inputState.editingId
      );
    }

    const newTextItem = {
      id: inputState.editingId || crypto.randomUUID(),
      type: "text",
      text: inputState.value,
      x: inputState.x,
      y: inputState.y,
      color: inputState.color,
      fontSize: inputState.fontSize,
    };

    historyStackRef.current.push(newTextItem);
    redoStackRef.current = [];

   

      try{
         console.log("yes");
      await axios.post(`${conf.path}/whiteboard/event`,{
       drawingOperations:newTextItem,
      },{
        withCredentials:true,
      })

    }catch(error){
      console.log(error)
    }
    redrawAll();
    setTextInput(null);
    redraw();
    bump();
  }, [redrawAll]);

  //Mouse Handlers

  const handleMouseDown = (e) => {
    const point = getMousePos(e);

    if (
      activeToolRefLocal.current === "pen" ||
      activeToolRefLocal.current === "eraser" ||
      activeToolRefLocal.current === "highlighter"
    ) {
      isDrawingRef.current = true;
      lastPointRef.current = point;

      currentStrokeRef.current = {
        id: crypto.randomUUID(),
        type: "stroke",
        points: [point],

        color: activeColorRef.current,

        width:
          activeToolRefLocal.current === "highlighter"
            ? strokeWidthRef.current * 4
            : strokeWidthRef.current,

        isEraser:
          activeToolRefLocal.current === "eraser",

        opacity:
          activeToolRefLocal.current === "highlighter"
            ? 0.25
            : 1,

        isHighlighter:
          activeToolRefLocal.current === "highlighter",
      };
    }

    else if (activeToolRefLocal.current === "shape") {
      isDrawingRef.current = true;

      shapeStartRef.current = point;

      previewShapeRef.current = {
        id: crypto.randomUUID(),
        type: activeShape,
        start: point,
        end: point,
        color: activeColorRef.current,
        width: strokeWidthRef.current,
      };
    }

    // text tool — single click opens floating input at click position
    else if (activeToolRefLocal.current === "text") {

      //  if a text input is already open, commit it before opening a new one
      if (textInput) {
        
        commitText(textInput);
        return;
      }

      setTextInput({
        x: point.x,
        y: point.y,
        value: "",
        color: activeColorRefText.current,
        fontSize: 20,
        editingId: null,
      });
    }
  };

  // double click handler — if text tool is active and user double-clicks
  // an existing text item, re-opens it in the floating input for editing
  const handleDoubleClick = async(e) => {
    if (activeToolRefLocal.current !== "text") return;

    const point = getMousePos(e);
    const ctx = ctxRef.current;

    // find the topmost text item whose bounding box contains the click point
    const clicked = [...historyStackRef.current].reverse().find((item) => {
      if (item.type !== "text") return false;

      ctx.font = `${item.fontSize}px Arial`;
      const measured = ctx.measureText(item.text);
      const w = measured.width;
      const h = item.fontSize;

      return (
        point.x >= item.x &&
        point.x <= item.x + w &&
        point.y >= item.y - h &&
        point.y <= item.y
      );
    });

    if (!clicked) return;

    // remove it from canvas visually and open it in the input box
    historyStackRef.current = historyStackRef.current.filter(
      (item) => item.id !== clicked.id
    );
    redrawAll();

    setTextInput({
      x: clicked.x,
      y: clicked.y,
      value: clicked.text,
      color: clicked.color,
      fontSize: clicked.fontSize,
      editingId: clicked.id,
    });

    

   
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;

    const now = performance.now();

    if (now - lastEmitTimeRef.current < THROTTLE_MS) return;

    lastEmitTimeRef.current = now;

    const point = getMousePos(e);
    const ctx = ctxRef.current;

    if (activeToolRefLocal.current === "shape") {
      previewShapeRef.current.end = point;

      redrawAll();
      socket.emit('currentshapesend',{shape:previewShapeRef.current});

      drawShape(
        ctx,
        previewShapeRef.current
      );

      return;
    }

    const previousPoint = lastPointRef.current;
     socket.emit('currentsend' ,{
      previousPoint,
      point,
      color:currentStrokeRef.current.color,
      width:currentStrokeRef.current.width,
      isEraser:currentStrokeRef.current.isEraser,
      opacity:currentStrokeRef.current.opacity});

    drawSegment(
      ctx,
      previousPoint,
      point,
      currentStrokeRef.current.color,
      currentStrokeRef.current.width,
      currentStrokeRef.current.isEraser,
      currentStrokeRef.current.opacity
    );

    currentStrokeRef.current.points.push(point);

    lastPointRef.current = point;
  };


  const handleMouseUp = async() => {
    if (!isDrawingRef.current) return;

    isDrawingRef.current = false;

    if (
      (activeToolRefLocal.current === "pen" ||
        activeToolRefLocal.current === "eraser" ||
        activeToolRefLocal.current === "highlighter") &&
      currentStrokeRef.current &&
      currentStrokeRef.current.points.length > 1
    ) {
      historyStackRef.current.push(
        currentStrokeRef.current
      );
 try {
      await axios.post(
       `${conf.path}/whiteboard/event`,{
        drawingOperations:currentStrokeRef.current ,
        },{
          withCredentials: true,
        },
      );
      
      
    } catch (error) {
      console.log(error);
    }

      redoStackRef.current = [];
      redrawAll();
      redraw();

      currentStrokeRef.current = null;
      bump();
    }

    if (
      activeToolRefLocal.current === "shape" &&
      previewShapeRef.current
    ) {
      historyStackRef.current.push(
        previewShapeRef.current
      );
 try {
      await axios.post(
       `${conf.path}/whiteboard/event`,{
        drawingOperations:previewShapeRef.current ,
        },{
          withCredentials: true,
        },
      );
      
      
    } catch (error) {
      console.log(error);
    }
      redoStackRef.current = [];

      previewShapeRef.current = null;

      redrawAll();
      redraw();
      bump();
    }
  };

  return (
    //  wrapper div so the floating input can be positioned relative to the canvas
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick} // for re-editing placed text
        className="absolute inset-0 touch-none"
      />

      {/* ADDED: floating input box — rendered when text tool is active and canvas is clicked */}
      {textInput && (
        <textarea
          autoFocus
          value={textInput.value}
          onChange={(e) => {
            let value = e.target.value;
            setTextInput((prev) => ({ ...prev, value: e.target.value }));
          socket.emit("text",{newTextItem:{
             x: textInput.x,
        y:textInput.y,
        value: value,
        color: activeColorRefText.current,
        fontSize: 20,
        editingId: textInput.editingId,

          }});
        }
          }
          onKeyDown={(e) => {
            // Enter commits, Shift+Enter allows newline, Escape cancels
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commitText(textInput);
            }
            if (e.key === "Escape") {
              setTextInput(null);
            }
          }}
          onMouseDown={(e) => e.stopPropagation()} // prevent canvas mousedown from firing when clicking inside textarea
          style={{
            position: "absolute",
            left: textInput.x,
            top: textInput.y - textInput.fontSize,
            fontSize: `${textInput.fontSize}px`,
            color: textInput.color,
            fontFamily: "Arial",
            background: "transparent",
            border: "1px dashed rgba(255,255,255,0.4)",
            outline: "none",
            resize: "none",
            minWidth: "120px",
            minHeight: `${textInput.fontSize + 8}px`,
            lineHeight: 1.2,
            padding: "2px 4px",
            caretColor: textInput.color,
            overflow: "hidden",
          }}
          rows={1}
        />
      )}
    </div>
  );
}

export default Whiteboard