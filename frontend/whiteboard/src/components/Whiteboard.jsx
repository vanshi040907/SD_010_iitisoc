import React from 'react'
import { useRef, useContext, useEffect, useCallback, useState } from "react";
import { WhiteboardContext } from '../context/WhiteboardContext';
import conf from '../conf/conf';
import axios from 'axios';
import { useSocket } from '../context/Socket';
import useInfinity from '../context/infinity';

const THROTTLE_MS = 10;

const Whiteboard = () => {
  const socket = useSocket();

  // state for the floating text input box position, value, and id of item being edited
  const [textInput, setTextInput] = useState(null);
    const [add,setAdd] = useState(0);

  const { activeTool, activeShape, activeColor, strokeWidth, registerEngine, bump, notifyHistortChange } = useContext(WhiteboardContext);
  const {camera,setCamera,worldtoscreen,screentoworld, zoom, setZoom, cameraonzoom , isZoom, setIsZoom,canvasRef} = useInfinity();
  const [isPanning, setIsPanning]= useState(true);
  const activeColorRef = useRef(activeColor);
  const strokeWidthRef = useRef(strokeWidth);
  const shapeStartRef = useRef(null);
  const previewShapeRef = useRef(null);
  const activeToolRefLocal = useRef(activeTool);
  const cameraRef = useRef(camera);
  const zoomRef = useRef(zoom); //  ref mirror for activeTool, needed inside mouse handlers

  useEffect(() => { activeColorRef.current = activeColor; }, [activeColor]);
  useEffect(() => { strokeWidthRef.current = strokeWidth; }, [strokeWidth]);
  useEffect(() => { activeToolRefLocal.current = activeTool; }, [activeTool]);
  useEffect(() => { cameraRef.current = camera; }, [camera]); 
  useEffect(() => { zoomRef.current = zoom; }, [zoom]); //  keep local tool ref in sync

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
   
     try {
       const res= await axios.get(
       ` ${conf.path}/whiteboard/undo`,  {
    withCredentials: true,
  }
      );

       const {remainingHistory , remainingRedoHistory} = res.data
      historyStackRef.current = remainingHistory;
      redoStackRef.current = remainingRedoHistory;
          bump();

    } catch (error) {
      console.log(error);
    }
    redrawAll();
    redraw();
  }

  const redo = async() => {
    if (redoStackRef.current.length === 0) return;
    
     try {
       const res = await axios.get(
        `${conf.path}/whiteboard/redo`,  {
    withCredentials: true,
  }
      );
       const {remainingHistory , remainingRedoHistory} = res.data;
      historyStackRef.current = remainingHistory;
      redoStackRef.current = remainingRedoHistory;
          bump();

      
      
    } catch (error) {
      console.log(error);
    }
    redrawAll();
    redraw();
  }
      let MAX_X_STROKE = -Infinity;
    let MAX_Y_STROKE = -Infinity;
    let MIN_X_STROKE = Infinity;
    let MIN_Y_STROKE = Infinity;
     

const downloadCanvas = useCallback(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;

    const tempCanvas =document.createElement("canvas");
    let MAX_X = -Infinity;
    let MAX_Y = -Infinity;
    let MIN_X = Infinity;
    let MIN_Y = Infinity;

    historyStackRef.current.forEach((item)=> {
       if (item.type === "stroke") {
        
        
        if(item.bounds.minx<MIN_X) MIN_X=item.bounds.minx;
         if(item.bounds.miny<MIN_Y) MIN_Y=item.bounds.miny;
         if(item.bounds.maxx>MAX_X) MAX_X=item.bounds.maxx;
        if(item.bounds.maxy>MAX_Y) MAX_Y=item.bounds.maxy;

        
        
      }
      else if(item.type==="text") {
        
      }
      else {
        if(item.type==="rect"||item.type==="line") {
       if(item.start.x<MIN_X) MIN_X=item.start.x;
         if(item.start.y<MIN_Y) MIN_Y=item.start.y;
         if(item.start.x>MAX_X) MAX_X=item.start.x;
        if(item.start.y>MAX_Y) MAX_Y=item.start.y;
         if(item.end.x<MIN_X) MIN_X=item.end.x;
         if(item.end.y<MIN_Y) MIN_Y=item.end.y;
         if(item.end.x>MAX_X) MAX_X=item.end.x;
        if(item.end.y>MAX_Y) MAX_Y=item.end.y;
        }
        else if(item.type==="circle") {
          const start = item.start;
          const end = item.end;
          const dx = end.x - start.x;
          const dy = end.y - start.y;

    const r = Math.sqrt(dx * dx + dy * dy);
    const left = Math.min(start.x-r,start.x+r,end.x-r,end.x+r);
    const right = Math.max(start.x-r,start.x+r,end.x-r,end.x+r);
    const top = Math.min(start.y-r,start.y+r,end.y-r,end.y+r);
    const bottom = Math.max(start.y-r,start.y+r,end.y-r,end.y+r);
    MIN_X=Math.min(left,MIN_X);
    MIN_Y=Math.min(top,MIN_Y);
    MAX_X=Math.max(right,MAX_X);
     MAX_Y=Math.max(bottom,MAX_Y);

    

    

          

        }
        else {
           const start = item.start;
          const end = item.end;
          const point1_x=(start.x + end.x) / 2;
          const point1_y=start.y;
           const point2_x=start.x;
           const point2_y=end.y;
            const point3_x=end.x;
           const point3_y=end.y;
            MIN_X=Math.min(point1_x,point2_x,point3_x,MIN_X);
    MIN_Y=Math.min(point1_y,point2_y,point3_y,MIN_Y);
    MAX_X=Math.max(point1_x,point2_x,point3_x,MAX_X);
     MAX_Y=Math.max(point1_y,point2_y,point3_y,MAX_Y);


          

      


        }
        

      
      }
    }


    );
    if (MIN_X === Infinity) {
    console.log("Nothing to export");
    }
       tempCanvas.width = MAX_X-MIN_X;
   tempCanvas.height = MAX_Y-MIN_Y;
     const tempCtx = tempCanvas.getContext("2d");
      tempCtx.fillStyle = "#000000";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

   tempCtx.translate(-MIN_X,-MIN_Y);

   

//Again need to define function because only world coordinate needed

     historyStackRef.current.forEach((item)=>  {
if (item.type === "stroke") {
  const Stroke = (ctx, stroke) => {

    const{
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

  
  Stroke(tempCtx,item);

      }
else if(item.type==="text") {
        
      }
else {
    const Rect = (ctx, shape) => {
    const x = Math.min(shape.start.x,shape.end.x);
    const y = Math.min(shape.start.y,shape.end.y);
    const width = Math.abs(shape.end.x - shape.start.x);
    const height = Math.abs(shape.end.y - shape.start.y);

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.strokeRect(x, y, width, height);
  };

  const LineShape = (ctx, shape) => {
    
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();
    ctx.moveTo(shape.start.x, shape.start.y);
    ctx.lineTo(shape.end.x,shape.end.y);
    ctx.stroke();
  };

  const Circle = (ctx, shape) => {
   
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

  const Triangle = (ctx, shape) => {
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

  const Shape = (ctx, shape) => {
    
    switch (shape.type) {
      case "rect":
        Rect(ctx, shape);
        break;

      case "circle":
        Circle(ctx, shape);
        break;

      case "triangle":
        Triangle(ctx, shape);
        break;

      case "line":
        LineShape(ctx, shape);
        break;

      default:
        break;
    }
  };
  Shape(tempCtx,item);


}
  });
    
    
    


    const dataUrl = tempCanvas.toDataURL("image/jpeg", 0.95);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `whiteboard-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);
const downloadCurrentCanvas = useCallback(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `whiteboard-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [camera]);




  useEffect(() => {
    registerEngine({
      undo,
      redo,
      canUndo: () => historyStackRef.current.length > 0,
      canRedo: () => redoStackRef.current.length > 0,
      downloadCanvas,
      downloadCurrentCanvas,
    });
    
  }, [bump]);

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
    
  },[socket,camera])
  useEffect(() => {
   const handlesocket = (data) => {
      drawSegment(ctxRef.current,
        data.previousPoint,
      data.point_stored,
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

    

},[socket,camera])


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

  }, [camera,zoom]);

  //single stroke drawing
  const drawStroke = (ctx, stroke) => {

    const{
      points,
      color,
      width,
      isEraser,
      opacity = 1
    } = stroke;
     const point = points.map((point) => {
       return worldtoscreen({world:point, camera})
   })
   

    if (point.length < 2) return;

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
      point[0].x,
      point[0].y
    );

    for (
      let i = 1;
      i < point.length - 1;
      i++
    ) {

      const midX =
        (point[i].x +
          point[i + 1].x) / 2;

      const midY =
        (point[i].y +
          point[i + 1].y) / 2;

      ctx.quadraticCurveTo(
        point[i].x,
        point[i].y,
        midX,
        midY
      );
    }

    const last =
      point[point.length - 1];

    ctx.lineTo(
      last.x,
      last.y
    );

    ctx.stroke();

    ctx.restore();
  };

  const drawRect = (ctx, shape) => {
    

    const start = worldtoscreen({world:shape.start, camera});
    const end = worldtoscreen({world:shape.end, camera});
     

    const x = Math.min(start.x,end.x);
    const y = Math.min(start.y,end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.strokeRect(x, y, width, height);
  };

  const drawLineShape = (ctx, shape) => {
    const start = worldtoscreen({world:shape.start, camera});
    const end = worldtoscreen({world:shape.end, camera});
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  };

  const drawCircle = (ctx, shape) => {
   const start = worldtoscreen({world:shape.start, camera});
  const end = worldtoscreen({world:shape.end, camera});
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const radius = Math.sqrt(dx * dx + dy * dy);

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;

    ctx.beginPath();
    ctx.arc(
      start.x,
      start.y,
      radius,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  };

  const drawTriangle = (ctx, shape) => {
     const start = worldtoscreen({world:shape.start, camera});
     const end = worldtoscreen({world:shape.end, camera});
    

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
     from = worldtoscreen({world:from, camera});
    to = worldtoscreen({world:to, camera});

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
    return { x: e.nativeEvent.offsetX, y:e.nativeEvent.offsetY  };
  }

  const drawText = (ctx, item) => {
    ctx.save();

    ctx.fillStyle = item.color;

    ctx.font = `${item.fontSize}px Arial`;
    const world = {
      x:item.x,
      y:item.y
    }
    const screen= worldtoscreen({world, camera});

    ctx.fillText(
      item.text,
      screen.x,
      screen.y
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
    setIsPanning(false);
    setIsZoom(false);
    const point_stored = screentoworld({screen:point,camera})

    if (
      activeToolRefLocal.current === "pen" ||
      activeToolRefLocal.current === "eraser" ||
      activeToolRefLocal.current === "highlighter"
    ) {
      isDrawingRef.current = true;
       
      lastPointRef.current = point_stored;
       if(point_stored.x<MIN_X_STROKE) MIN_X_STROKE=point_stored.x;
         if(point_stored.y<MIN_Y_STROKE) MIN_Y_STROKE=point_stored.y;
         if(point_stored.x>MAX_X_STROKE) MAX_X_STROKE=point_stored.x;
        if(point_stored.y>MAX_Y_STROKE) MAX_Y_STROKE=point_stored.y;

    

      currentStrokeRef.current = {
        id: crypto.randomUUID(),
        type: "stroke",
        points: [point_stored],

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
        bounds:{}
      };
    }

    else if (activeToolRefLocal.current === "shape") {
      isDrawingRef.current = true;

      shapeStartRef.current = point_stored;

      previewShapeRef.current = {
        id: crypto.randomUUID(),
        type: activeShape,
        start:point_stored,
        end:point_stored,
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
    const point_stored = screentoworld({screen:point,camera})
     if(point_stored.x<MIN_X_STROKE) MIN_X_STROKE=point_stored.x;
         if(point_stored.y<MIN_Y_STROKE) MIN_Y_STROKE=point_stored.y;
         if(point_stored.x>MAX_X_STROKE) MAX_X_STROKE=point_stored.x;
        if(point_stored.y>MAX_Y_STROKE) MAX_Y_STROKE=point_stored.y;

    if (activeToolRefLocal.current === "shape") {
      previewShapeRef.current.end = point_stored;
      

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
      point_stored,
      color:currentStrokeRef.current.color,
      width:currentStrokeRef.current.width,
      isEraser:currentStrokeRef.current.isEraser,
      opacity:currentStrokeRef.current.opacity});

    drawSegment(
      ctx,
      previousPoint,
      point_stored,
      currentStrokeRef.current.color,
      currentStrokeRef.current.width,
      currentStrokeRef.current.isEraser,
      currentStrokeRef.current.opacity
    );

    currentStrokeRef.current.points.push(point_stored);
    

    lastPointRef.current = point_stored;
  };


  const handleMouseUp = async() => {
     setIsPanning(true)
      setIsZoom(true)
    if (!isDrawingRef.current) return;

    isDrawingRef.current = false;

    if (
      (activeToolRefLocal.current === "pen" ||
        activeToolRefLocal.current === "eraser" ||
        activeToolRefLocal.current === "highlighter") &&
      currentStrokeRef.current &&
      currentStrokeRef.current.points.length > 1
    ) {
      currentStrokeRef.current.bounds = {
        minx:MIN_X_STROKE,
        miny:MIN_Y_STROKE,
        maxx:MAX_X_STROKE,
        maxy:MAX_Y_STROKE};
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
      MAX_X_STROKE = -Infinity;
      MAX_Y_STROKE = -Infinity;
      MIN_X_STROKE = Infinity;
      MIN_Y_STROKE = Infinity;


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
   useEffect (() => {
      const canvas = canvasRef.current;
      
          
        
const handleWheel = (e) => {
  const MAX = 20;
  const MIN = 0.02;
   e.preventDefault();
   let x = 0;
  
  if(e.ctrlKey&&isZoom) {
    x = 1;
    
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
          const screen = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          }
          
          const  world = screentoworld({screen:screen,camera:cameraRef.current})
          


             const zoomFactor = 1 - e.deltaY * 0.001;
             
             let newzoom = (zoom*zoomFactor)
             newzoom = Math.max(MIN,(Math.min(MAX,newzoom)));
             
              
             setZoom(prev =>  Math.max(MIN,(Math.min(MAX,prev*=zoomFactor))));
             
             
        const cameranew = cameraonzoom({world,screen,newzoom})
          setCamera(cameranew)


            

          }
  const point = {
              x:e.deltaX,

              y:e.deltaY            }
              
  if(x==0&&isPanning) setCamera(prev => ({
    x: prev.x + e.deltaX,
    y: prev.y + e.deltaY
})) ;


    
}
canvas.addEventListener("wheel",handleWheel,{
  passive:false,

});
return  () => {
canvas.removeEventListener("wheel",handleWheel);
}



},[camera,zoom,isPanning, isZoom])
useEffect(()=> {
    
  redrawAll();
}, [camera,zoom])

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
             const screen = {
      x:textInput.x,
      y:textInput.y
    }
    const world=screentoworld({screen, camera});

          socket.emit("text",{newTextItem:{
             x: world.x,
        y:world.y,
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
              const screen = {
      x:textInput.x,
      y:textInput.y
    }
    const world=screentoworld({screen, camera});
    textInput.x = world.x;
    textInput.y = world.y;
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