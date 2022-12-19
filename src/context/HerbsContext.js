import { createContext, useReducer } from "react";

export const HerbsContext = createContext()

export const herbsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_HERBS':
            return {
                herbs: action.payload,
                results: action.payload
            }
        case 'CREATE_HERB':
            const newHerb = {
                _id: action.payload._id,
                name: action.payload.name,
                amount: action.payload.amount,
                expiry: action.payload.expiry
            }
            console.log('pl (should be with search) then newherb (without search)')
            console.log(action.payload)
            console.log(newHerb)
            let ifThis = newHerb.name.toLowerCase()
            let target = action.payload.search.toLowerCase()
            if (!action.payload.search) {
                console.log('!action.payload.search')
                return {
                    herbs: [newHerb, ...state.herbs],
                    results: [state.results]
                }
                break;
            }
            if (ifThis.includes(target)) {
                console.log('if (ifThis.includes(target)) {')
                return {
                    herbs: [newHerb, ...state.herbs],
                    results: [action.payload, ...state.results]
                }
            } else {
                console.log('else')
                return {
                    herbs: [newHerb, ...state.herbs],
                    results: [state.results]
                }
            }
        case 'DISCARD_HERB':
            return {
                herbs: state.herbs.filter((h) => h._id !== action.payload._id),
                results: state.results.filter((h) => h._id !== action.payload._id)
            }
        case 'SEARCH':
            if (action.payload == null) {
                return {
                    herbs: state.herbs,
                    results: state.herbs
                }
            } else {
                
                return {
                    herbs: state.herbs,
                    results: state.herbs.filter((h) => h.name.toLowerCase().includes(action.payload.toLowerCase()))
                }
            }
        default:
            return state;
    }
}

export const HerbsContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(herbsReducer, {
        herbs: [],
        results: []
    })

    

    return (
        <HerbsContext.Provider value={{...state, dispatch}}>
            { children }
        </HerbsContext.Provider>
    )
}