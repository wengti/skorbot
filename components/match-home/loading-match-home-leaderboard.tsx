'use client'
import { MdLeaderboard } from "react-icons/md";
import { TableBody, TableCell, TableHead, TableHeader, TableRoot, TableRow } from "../tailgrids/core/table";
import { Skeleton } from "../tailgrids/core/skeleton";
import { Bar, BarChart, ResponsiveContainer } from "recharts";

export default function LoadingMatchHomeLeaderboard() {

    const headerClsName = 'text-black font-bold dark:text-(--color-dark-text) p-1.5 sm:text-base'
    const itemsPerPage = 5
    const tableRows = []

    for (let i = 0; i < itemsPerPage; i++) {
        tableRows.push(
            <TableRow key={i}>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
            </TableRow>
        )
    }

    return (
        <section>
            <div className='text-xl font-bold mb-1 flex gap-2 items-center mt-4'>
                <MdLeaderboard />
                <h2>Leaderboard</h2>
            </div>
            <div className='h-130 border rounded-lg my-2 flex flex-col relative' >

                <div className="w-full h-50 aspect-video mx-auto mt-9 mb-0 z-0">

                    {/* Leaderboard */}
                    <ResponsiveContainer initialDimension={{ width: 100, height: 100 }} width='80%' className='mx-auto block relative pt-14 sm:pt-10.5'>

                        {/* The Bar */}
                        <BarChart data={[{ rank: 2 }, { rank: 3 }, { rank: 1 }]} barCategoryGap={0}>
                            <Bar
                                dataKey="rank"
                                fill="#ff8b26"
                                radius={[4, 4, 0, 0]}
                            >
                            </Bar>
                        </BarChart>

                        {/* The container for bar labels - absolute, bounded by the bar chart container */}
                        <div className='absolute w-full flex -top-8 left-0'>

                            {/* Container for 2nd-place player */}
                            <div className='font-bold flex flex-col items-center w-1/3 mt-11 sm:mt-13'>
                                <Skeleton className="size-12 rounded-full" />
                            </div>

                            {/* Container for 1st-place player */}
                            <div className='font-bold flex flex-col items-center w-1/3'>
                                <Skeleton className="size-12 rounded-full" />
                            </div>

                            {/* Container for 3rd-place player */}
                            <div className='font-bold flex flex-col items-center w-1/3 mt-22 sm:mt-25'>
                                <Skeleton className="size-12 rounded-full" />
                            </div>
                        </div>
                    </ResponsiveContainer>
                </div>

                {/* Leaderboard table */}
                <div className='mx-2 grow mt-4'>
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
                    </TableRoot>
                </div>

            </div >
        </section>
    )
}