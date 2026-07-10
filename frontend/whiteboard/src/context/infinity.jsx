import React from 'react'
import { createContext, useContext, useState, useCallback } from 'react'
import { useRef } from 'react';


export const InfinityContext = createContext();
export function InfinityProvider ({children}) {
    const [camera, setCamera] = useState({
      x:0,
      y:0
    });
    const [zoom, setZoom] = useState(1);
    const [isZoom, setIsZoom] = useState(true);
    

    const worldtoscreen = useCallback(({world,camera}) => {
        const x =( world.x - camera.x)*zoom;
        const y = (world.y - camera.y) *zoom;
        return ({x,y});
    },[zoom])
    const screentoworld = useCallback(({screen,camera}) => {
        const x = screen.x/zoom + camera.x;
        const y = screen.y/zoom + camera.y;
        return ({x,y});
    },[zoom])
    const cameraonzoom = useCallback(({world,screen,newzoom}) => {
        const x = world.x - (screen.x/newzoom)
        const y = world.y - (screen.y/newzoom)
        return ({x,y});
    },[]) 
    
      const canvasRef = useRef(null);

    
    return(
        <InfinityContext.Provider value ={{camera,setCamera,worldtoscreen,screentoworld,zoom, setZoom, cameraonzoom, isZoom, setIsZoom,canvasRef}}>
        {children}
        </InfinityContext.Provider>

    );
}
export default function useInfinity() {
    return useContext(InfinityContext)
}