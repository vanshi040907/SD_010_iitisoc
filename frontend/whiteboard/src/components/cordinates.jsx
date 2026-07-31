import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import useInfinity from "../context/infinity";
import { WhiteboardContext } from '../context/WhiteboardContext';
import { useSocket } from "../context/Socket";


const Btn_coordinates = () => {
    const { isDark, theme } = useContext(ThemeContext);
    const { screentoworld, camera,setCamera, canvasRef , zoom, setZoom} = useInfinity();
    const [coords, SetCoords] = useState({ x: 0, y: 0 });
    const [hostcoords, Sethostcoords] = useState({x:0,y:0});
    const {role,setRole} = useContext(WhiteboardContext);
    const [hostFollow, setHostFollow] = useState(true);
    const socket = useSocket();
    useEffect(() => {
        if(role==="Host") {
            setHostFollow(false);
             
            socket.emit("hostcoordinatesent",{world:coords});

        }

    },[camera,role,coords])


    

    useEffect(() => {
        const handleMouseMove = (e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const screen = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };

            const world = screentoworld({ screen, camera });
            SetCoords({ x: Math.round(world.x), y: Math.round(world.y) });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [camera, screentoworld, canvasRef]);
    const handleHostFollow =async() => {
        socket.emit("hostFollow");
        
    }
    
    useEffect(() => {
        const handleHost = (data) => {
            const {userid} = data;
            console.log("hi");
            socket.emit("givingHostcamera",{camera:camera,zoom:zoom,userid:userid});
        }
        const handleCamera = (data) => {
            const {camera,zoom} = data;
            console.log("dfghjk");
             setCamera({ x: Math.round(camera.x), y: Math.round(camera.y) });
             setZoom(zoom);

        }
        const handleCoordinates = (data) => {
            const {world} = data;
             Sethostcoords({ x: Math.round(world.x), y: Math.round(world.y) })
        }
        socket.on("askingHostFollowup",handleHost);
        socket.on("sendingHostCamera",handleCamera);
        socket.on("sendingHostCoordinate",handleCoordinates);
        
        return () => {
            socket.off("askingHostFollowup",handleHost);
            socket.off("sendingHostCamera",handleCamera);
            socket.off("sendingHostCoordinate",handleCoordinates);
        
        }



    },[socket,camera,zoom])

    return (
        <div className={`fixed top-25 right-2 p-3 h-12 rounded-full flex z-10 items-center justify-center ${theme.textPrimary} ${theme.iconButtonHover} transition-all duration-200  ${theme.border}`}
            style={{ ...theme.glass }}>
                 <button className="font-semibold text-sm">
                X: {coords.x}, Y: {coords.y}
            </button>
            
              {hostFollow && (
                <>
                    <div className="flex items-center gap-3 flex-wrap">
            <button  onClick={handleHostFollow} className={`px-3 py-1 rounded-lg border text-xs
                ${theme.border} hover:scale-105 transition-all`}>
                Go To Host View
                </button>
                <span className={`${theme.textSecondary} text-xs`}>
                  x : {hostcoords.x}, Y:{hostcoords.y}
                </span>
                </div>
                </>
                

              )}
                  
           
        </div>
    );
};

export default Btn_coordinates;