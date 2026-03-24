'use client'

import { useState } from "react"
import { Pagination } from "../tailgrids/core/pagination"
import { TableBody, TableCell, TableHead, TableHeader, TableRoot, TableRow } from "../tailgrids/core/table"
import { StatsDataType } from "./stats-details"
import Link from "next/link"

function shortenName(name: string): string {
    const returnedName = name.length > 11 ? name.slice(0, 9) + '..' : name
    return returnedName
}


export default function StatsTable({ statsData }: { statsData: StatsDataType[] }) {

    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 5
    const totalPages = Math.ceil(statsData.length / itemsPerPage)

    /* Class Name for cell rows */
    const headerClsName = 'text-black font-bold dark:text-(--color-dark-text) p-1.5 lg:text-base'
    const rowClsName = 'text-black font-bold dark:text-(--color-dark-text) text-xs p-1.5 lg:text-base'

    /* Rows */
    const tableRows = statsData.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage).map((data, idx) => {

        const rank = (idx + 1) + (currentPage - 1) * itemsPerPage

        return (
            <TableRow key={rank}>
                <TableCell className={`${rowClsName}`}>#{rank}</TableCell>
                <TableCell className={`${rowClsName}`}>
                    <Link href={`/user/stats/${data.user.id}`}>
                        {shortenName(data.user.name)}
                    </Link>
                </TableCell>
                <TableCell className={`${rowClsName}`}>{data.wins}</TableCell>
                <TableCell className={`${rowClsName}`}>{data.losses}</TableCell>
                <TableCell className={`${rowClsName}`}>{data.score_diff}</TableCell>
                <TableCell className={`${rowClsName}`}>{data.win_rate.toFixed(2)}%</TableCell>
            </TableRow>
        )
    })

    return (
        <div className='flex flex-col grow'>
            <div className='mx-2 grow items-center'>
                {
                    statsData.length > 0 ?
                        <TableRoot className="w-full px-4 dark:border-white p-0">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={`${headerClsName}`}>Rank</TableHead>
                                    <TableHead className={`${headerClsName}`}>Name</TableHead>
                                    <TableHead className={`${headerClsName}`}>Win</TableHead>
                                    <TableHead className={`${headerClsName}`}>Lose</TableHead>
                                    <TableHead className={`${headerClsName}`}>+/-</TableHead>
                                    <TableHead className={`${headerClsName}`}>%</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableRows}
                            </TableBody>
                        </TableRoot>:
                        <p className='text-center text-sm text-slate-500 dark:text-gray-500'>
                            No record found.
                        </p>
                }
            </div>

            {/* Pagination */}
            <div className='mt-4 px-2'>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => { setCurrentPage(page) }}
                    sideLayout="icon"
                />
            </div>
        </div>

    )
}