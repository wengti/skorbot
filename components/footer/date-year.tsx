'use client'

import { Suspense } from "react"

export default function DateYear() {

    const year = (new Date()).getFullYear()

    return (
        <p>Skorbot @ {year}</p>
    )
}