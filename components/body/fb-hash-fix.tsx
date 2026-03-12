'use client'

import { useEffect } from "react"

export default function FbHashFix() {

    useEffect(() => {
        if (window.location.hash.startsWith('#_=_')) {
            window.history.replaceState(null, document.title,
                window.location.pathname + window.location.search)
        }
    }, [])

    return (
        <></>
    )
}