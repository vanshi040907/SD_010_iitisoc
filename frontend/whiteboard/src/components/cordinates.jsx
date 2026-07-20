import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import useInfinity from "../context/infinity";

const Btn_coordinates = () => {
    const { isDark, theme } = useContext(ThemeContext);
    const { screentoworld, camera, canvasRef } = useInfinity();
    const [coords, SetCoords] = useState({ x: 0, y: 0 });

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

    return (
        <div className={`fixed bottom-5 left-4 p-5 h-14 rounded-xl flex z-50 items-center justify-center ${theme.textPrimary} ${theme.iconButtonHover} transition-all duration-200 z-5 border ${theme.border}`}
            style={{ ...theme.glass }}>
            <button className="h-18">
                X: {coords.x}, Y: {coords.y}
            </button>
        </div>
    );
};

export default Btn_coordinates;