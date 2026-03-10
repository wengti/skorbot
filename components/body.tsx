'use client'
import { useDarkModeContext } from "@/context/dark-mode-context-provider"
import clsx from "clsx"
import { ReactNode } from "react"

type BodyPropsType = {
    children: ReactNode
}

export default function Body({children}: BodyPropsType){

    const [isDarkMode, _setIsDarkMode] = useDarkModeContext()

    const bodyCls = clsx({
        'bg-(--color-main) dark:bg-(--color-dark-main) dark:text-(--color-dark-text) min-w-(--min-content-width)': true,
        'dark': isDarkMode
    })

    return (
        <body className={bodyCls}>
            {children}
        </body>
    )
}