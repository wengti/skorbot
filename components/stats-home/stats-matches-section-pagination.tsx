'use client'
import { JSX, useState } from "react";
import { Pagination } from "../tailgrids/core/pagination";

export default function StatsMatchesSectionPagination({ children }: { children: JSX.Element[] }) {

    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 4
    const totalPages = Math.ceil(children.length / itemsPerPage)

    return (
        <div className='flex flex-col gap-2 px-2 pt-4 pb-1 h-full'>
            <div className='grow flex flex-col gap-4'>
                {children.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage)}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                sideLayout='icon'
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    )
}