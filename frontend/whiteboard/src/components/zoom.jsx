import React from 'react'
import { Plus ,  Search, Minus} from 'lucide-react';
import useInfinity from '../context/infinity';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';

function Zoom() {
      const {theme} = useContext(ThemeContext);
      const glassBtn = {
    ...theme.glass
  };
  const MAX = 20;
  const MIN = 0.02;
    const {camera,setCamera,worldtoscreen,screentoworld,zoom, setZoom, cameraonzoom, isZoom, setIsZoom,canvasRef} = useInfinity();
    const handleZoomIncrease = () => {
       const canvas = canvasRef.current; 
       const screen = {
         x: canvas.width / 2,
  y: canvas.height / 2
       } 
       const world = screentoworld({screen,camera});
       let newzoom = zoom + (0.1*zoom);
        newzoom = Math.max(MIN,(Math.min(MAX,newzoom)));
        
        
        
       setZoom(newzoom);
        const cameranew = cameraonzoom({world,screen,newzoom})
          setCamera(cameranew)

       


    }
    const handleZoomdecrease = () => {
       const canvas = canvasRef.current; 
       const screen = {
         x: canvas.width / 2,
  y: canvas.height / 2
       } 
       const world = screentoworld({screen,camera});
       let newzoom = zoom - (0.1*zoom);
        newzoom = Math.max(MIN,(Math.min(MAX,newzoom)));
        
       setZoom(newzoom);
        const cameranew = cameraonzoom({world,screen,newzoom})
          setCamera(cameranew)

       


    }
  return (
    <div className={`fixed bottom-4 left-4 z-40 flex items-center gap-1.5 px-2 py-2 rounded-xl border ${theme.border}`} style={glassBtn}>
        <div><button onClick= {handleZoomIncrease}  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme.textPrimary} ${theme.iconButtonHover} transition-all duration-200`}><Plus/></button></div>
        <div className={`${theme.textPrimary} ${theme.iconButtonHover} `}><label>{(zoom*100).toFixed(0)}</label> <Search/></div>
        <div><button onClick= {handleZoomdecrease}  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme.textPrimary} ${theme.iconButtonHover} transition-all duration-200`}><Minus/></button></div>
    </div>
  )
}

export default Zoom