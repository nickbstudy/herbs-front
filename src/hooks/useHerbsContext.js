import { HerbsContext } from "../context/HerbsContext";
import { useContext } from "react";

export const useHerbsContext = () => {
    const context = useContext(HerbsContext)

    if (!context) {
        throw Error('useHerbsContext must be used insidce a HerbsContextProvider')
    }

    return context
}