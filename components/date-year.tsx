'use client'


export default function DateYear(){

    const year = (new Date()).getFullYear()

    return (
        <p>Skorbot @ {year}</p>
    )
}