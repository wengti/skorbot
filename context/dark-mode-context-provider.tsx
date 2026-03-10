'use client'
import { createContext, ReactNode, useContext, useState } from "react"

/* Type */
type DarkModeContextProviderPropsType = {
    children: ReactNode
}

type DarkModeContextType = [boolean, React.Dispatch<React.SetStateAction<boolean>>]

/* Context */
const DarkModeContext = createContext<DarkModeContextType>(null!)

export function useDarkModeContext(){
    return useContext(DarkModeContext)
}

/* Returned Context Provider */
export default function DarkModeContextProvider({children}: DarkModeContextProviderPropsType){

    const [isDarkMode, setIsDarkMode] = useState<boolean>(true)

    return (
        <DarkModeContext value={[isDarkMode, setIsDarkMode]}>
            {children}
        </DarkModeContext>
    )
}