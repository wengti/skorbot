'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

/* Type */
type DarkModeContextProviderPropsType = {
    children: ReactNode
}

type DarkModeContextType = [boolean, React.Dispatch<React.SetStateAction<boolean>>]

/* Context */
const DarkModeContext = createContext<DarkModeContextType>(null!)

export function useDarkModeContext() {
    return useContext(DarkModeContext)
}

/* Local Storage */
function getIsDarkModeFromLocalStorage(): boolean {
    if (typeof window === 'undefined') return false // for Server Side Rendering

    const isDarkMode = localStorage.getItem('skorbot-theme')
    if (isDarkMode) return JSON.parse(isDarkMode)
    else return false
}

/* Returned Context Provider */
export default function DarkModeContextProvider({ children }: DarkModeContextProviderPropsType) {

    const [isMounted, setIsMounted] = useState<boolean>(false)
    const [isDarkMode, setIsDarkMode] = useState<boolean>(undefined!)

    /* run after first mount to confirm the component is mounted */
    useEffect(() => {
        setIsMounted(true)
        setIsDarkMode((_prevIsDarkMode) => { return getIsDarkModeFromLocalStorage() })
    }, [])

    /* Decide the component to be returned */
    if (!isMounted) {
        return (
            <body></body>
        )
    }
    else {
        return (
            <DarkModeContext value={[isDarkMode, setIsDarkMode]}>
                {children}
            </DarkModeContext>
        )
    }
}