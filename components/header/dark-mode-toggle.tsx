'use client'

import { useDarkModeContext } from "@/context/dark-mode-context-provider"
import { LuSun, LuSunMoon } from "react-icons/lu";

export default function DarkModeToggle(){
    const [isDarkMode, setIsDarkMode] = useDarkModeContext()

    const handleDarkModeToggle = () => {
        setIsDarkMode(prevIsDarkMode => {
            localStorage.setItem('skorbot-theme', JSON.stringify(!prevIsDarkMode))
            return !prevIsDarkMode
        })
        
    }
    
    return (
        <button 
            className='text-3xl flex items-center hover:cursor-pointer'
            onClick={handleDarkModeToggle}
        >
            {
                isDarkMode ? 
                    <LuSun /> :
                    <LuSunMoon />
            }
        </button>
    )
}