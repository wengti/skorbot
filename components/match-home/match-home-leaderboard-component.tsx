'use client'
import { TableBody, TableCell, TableHead, TableHeader, TableRoot, TableRow } from "../tailgrids/core/table";
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area";
import { FaTrophy } from "react-icons/fa";
import { ChartContainer } from "../tailgrids/core/chart";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import Image from "next/image";

export default function MatchHomeLeaderboardComponent() {
    const data = [
        { name: "Jan", rank: 2, picture: '/images/profile_red.png' },
        { name: "Feb", rank: 3, picture: '/images/profile_red.png' },
        { name: "Mar", rank: 1, picture: '/images/profile_red.png' },
    ];

    const headerClsName = 'text-black font-bold dark:text-(--color-dark-text) p-1.5 sm:text-base'
    const extraHeaderClsName = 'text-black font-bold dark:text-(--color-dark-text) hidden sm:table-cell p-1.5 sm:text-base'
    const rowClsName = 'text-black font-bold dark:text-(--color-dark-text) text-xs p-1.5 sm:text-base'
    const extraRowClsName = 'text-black font-bold dark:text-(--color-dark-text) hidden sm:table-cell p-1.5 sm:text-base'

    return (

        <div className='border rounded-lg mt-2' >


            <ScrollArea className='h-100'>
                <ScrollAreaViewport className=''>
                    <div className="w-full h-50 aspect-video mx-auto mt-12 mb-6">
                        <ResponsiveContainer initialDimension={{ width: 100, height: 100 }} width='80%' className='mx-auto block relative pt-12'>
                            <BarChart data={data} barCategoryGap={0}>
                                <Bar
                                    dataKey="rank"
                                    fill="#ff8b26"
                                    radius={[4, 4, 0, 0]}
                                >
                                </Bar>
                            </BarChart>
                            <div className='absolute w-full flex -top-8 left-0'>
                                <div className='font-bold flex flex-col items-center w-1/3 mt-12'>
                                    <Image
                                        height={60}
                                        width={60}
                                        src={'/images/profile_red.png'}
                                        alt={'The profile picture of the number 1 player, Weng Ti'}
                                        className='w-10 rounded-full'
                                    />
                                    <div className="flex gap-2 items-center text-sm">
                                        <p>2nd</p>
                                    </div>
                                    <p className="text-sm text-center">
                                        Weng Ti Wong..
                                    </p>
                                </div>
                                <div className='font-bold flex flex-col items-center w-1/3'>
                                    <Image
                                        height={60}
                                        width={60}
                                        src={'/images/profile_red.png'}
                                        alt={'The profile picture of the number 1 player, Weng Ti'}
                                        className='w-10 rounded-full'
                                    />
                                    <div className="flex gap-2 items-center text-sm">
                                        <FaTrophy />
                                        <p>1st</p>
                                    </div>
                                    <p className="text-sm text-center">
                                        Weng Ti Wong..
                                    </p>
                                </div>

                                <div className='font-bold flex flex-col items-center w-1/3 mt-24'>
                                    <Image
                                        height={60}
                                        width={60}
                                        src={'/images/profile_red.png'}
                                        alt={'The profile picture of the number 1 player, Weng Ti'}
                                        className='w-10 rounded-full'
                                    />
                                    <div className="flex gap-2 items-center text-sm">
                                        <p>3rd</p>
                                    </div>
                                    <p className="text-sm text-center">
                                        Weng Ti Wong..
                                    </p>
                                </div>
                            </div>
                        </ResponsiveContainer>
                    </div>

                    <div className='mx-2'>
                        <TableRoot className="w-full px-4 dark:border-white p-0">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={`${headerClsName}`}>Rank</TableHead>
                                    <TableHead className={`${headerClsName}`}>Name</TableHead>
                                    <TableHead className={`${headerClsName}`}>Win</TableHead>
                                    <TableHead className={`${headerClsName}`}>Lose</TableHead>
                                    <TableHead className={`${headerClsName}`}>%</TableHead>
                                    <TableHead className={`${headerClsName}`}>+/-</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className={`${rowClsName}`}>#1</TableCell>
                                    <TableCell className={`${rowClsName}`}>Weng Ti Wong</TableCell>
                                    <TableCell className={`${rowClsName}`}>3</TableCell>
                                    <TableCell className={`${rowClsName}`}>2</TableCell>
                                    <TableCell className={`${rowClsName}`}>60%</TableCell>
                                    <TableCell className={`${rowClsName}`}>+221</TableCell>
                                </TableRow>
                            </TableBody>
                        </TableRoot>
                    </div>
                </ScrollAreaViewport>
                <ScrollBar orientation="vertical" />

            </ScrollArea>
        </div >
    )
}