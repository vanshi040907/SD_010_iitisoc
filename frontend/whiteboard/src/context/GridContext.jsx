
import { useState, createContext, useContext } from "react";
export const GridContext = createContext();

export const GridProvider = ({ children }) => {
    const [showGrid, setShowGrid] = useState(false);
    const toggleGrid = () => {
        setShowGrid(prev => !prev);
    }

    return (
        <GridContext.Provider value={{ showGrid, toggleGrid }}>
            {children}
        </GridContext.Provider>
    )
};
export const useGrid = () => useContext(GridContext);