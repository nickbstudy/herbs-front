import { createContext, useReducer } from "react";

export const HerbsContext = createContext()

export const herbsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_HERBS':
            return {
                herbs: action.payload
            }
        case 'CREATE_HERB':
            return {
                herbs: [action.payload, ...state.herbs]
            }
        case 'DISCARD_HERB':
            
            return {
                herbs: state.herbs.filter((w) => w._id !== action.payload._id)
            }
        default:
            return state;
    }
}

export const HerbsContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(herbsReducer, {
        herbs: []
    })

    

    return (
        <HerbsContext.Provider value={{...state, dispatch}}>
            { children }
        </HerbsContext.Provider>
    )
}