'use client'
import { JSX, useState } from "react"
import { Pagination } from "../tailgrids/core/pagination"

export default function PreviewPagination({previewCards}: {previewCards: JSX.Element[]}) {

    /* State - Pagination */
    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 1
    const totalPages = Math.ceil(previewCards.length / itemsPerPage)

    return (
        <>
            {/* Card Grid */}
            < div className='flex gap-2 items-center justify-center' >
                { previewCards.slice( (currentPage-1)*itemsPerPage, (currentPage-1)*itemsPerPage+itemsPerPage) }
            </div >

            {/* Pagination */}
            < div className='my-2 mx-2' >
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => { setCurrentPage(page) }}
                />
            </div >
        </>
    )
}