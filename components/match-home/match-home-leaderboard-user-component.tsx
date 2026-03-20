'use client'
import { TableBody, TableCell, TableHead, TableHeader, TableRoot, TableRow } from "../tailgrids/core/table";
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area";
import { FaTrophy } from "react-icons/fa";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import Image from "next/image";
import { PlayersRecordType } from "./match-home-leaderboard-server-component";


function shortenName(name: string): string {
    const returnedName = name.length > 12 ? name.slice(0, 10) + '..' : name
    return returnedName
}

export default function MatchHomeLeaderboardUserComponent({ playersRecord }: { playersRecord: PlayersRecordType[] }) {


    const headerClsName = 'text-black font-bold dark:text-(--color-dark-text) p-1.5 sm:text-base'
    const rowClsName = 'text-black font-bold dark:text-(--color-dark-text) text-xs p-1.5 sm:text-base'

    /* Top 3 player */
    const rawLeaderboardData = playersRecord.slice(0, 3).map((p, idx) => {
        return { name: shortenName(p.user.name), rank: (3 - idx), picture: p.user.picture }
    })
    while (rawLeaderboardData.length < 3) {
        rawLeaderboardData.push({ name: '', rank: (3 - rawLeaderboardData.length), picture: '/images/profile_inactive.png' })
    }
    const leaderboardData = [
        rawLeaderboardData[1],
        rawLeaderboardData[0],
        rawLeaderboardData[2]
    ]

    /* Table Entry */
    const tableRows = playersRecord.map((record, idx) => {
        return (
            <TableRow key={idx}>
                <TableCell className={`${rowClsName}`}>#{idx + 1}</TableCell>
                <TableCell className={`${rowClsName}`}>{record.user.name}</TableCell>
                <TableCell className={`${rowClsName}`}>{record.wins}</TableCell>
                <TableCell className={`${rowClsName}`}>{record.losses}</TableCell>
                <TableCell className={`${rowClsName}`}>{record.scoreDiff}</TableCell>
                <TableCell className={`${rowClsName}`}>{record.wins + record.losses !== 0 ? (((record.wins) / (record.losses + record.wins)) * 100).toFixed(2) : 0.00}%</TableCell>
            </TableRow>
        )
    })




    return (

        <div className='border rounded-lg mt-2' >


            <ScrollArea className='h-100'>
                <ScrollAreaViewport className=''>
                    <div className="w-full h-50 aspect-video mx-auto mt-12 mb-0">
                        <ResponsiveContainer initialDimension={{ width: 100, height: 100 }} width='80%' className='mx-auto block relative pt-14 sm:pt-10.5'>
                            <BarChart data={leaderboardData} barCategoryGap={0}>
                                <Bar
                                    dataKey="rank"
                                    fill="#ff8b26"
                                    radius={[4, 4, 0, 0]}
                                >
                                </Bar>
                            </BarChart>
                            <div className='absolute w-full flex -top-8 left-0'>
                                <div className='font-bold flex flex-col items-center w-1/3 mt-11 sm:mt-13'>

                                    <Image
                                        height={60}
                                        width={60}
                                        src={leaderboardData[0].picture}
                                        alt={`The profile picture of the number 2 player, ${leaderboardData[0].name}`}
                                        className='w-10 rounded-full'
                                    />
                                    <div className="flex gap-2 items-center text-sm">
                                        <p>2nd</p>
                                    </div>
                                    <p className="text-sm text-center leading-tight">
                                        {leaderboardData[0].name}
                                    </p>
                                </div>

                                <div className='font-bold flex flex-col items-center w-1/3'>
                                    <Image
                                        height={60}
                                        width={60}
                                        src={leaderboardData[1].picture}
                                        alt={`The profile picture of the number 1 player, ${leaderboardData[1].name}`}
                                        className='w-10 rounded-full'
                                    />
                                    <div className="flex gap-2 items-center text-sm text-(--color-highlight)">
                                        <FaTrophy />
                                        <p>1st</p>
                                    </div>
                                    <p className="text-sm text-center leading-tight">
                                        {leaderboardData[1].name}
                                    </p>
                                </div>

                                <div className='font-bold flex flex-col items-center w-1/3 mt-22 sm:mt-25'>
                                    <Image
                                        height={60}
                                        width={60}
                                        src={leaderboardData[2].picture}
                                        alt={`The profile picture of the number 3 player, ${leaderboardData[2].name}}`}
                                        className='w-10 rounded-full'
                                    />
                                    <div className="flex gap-2 items-center text-sm">
                                        <p>3rd</p>
                                    </div>
                                    <p className="text-sm text-center leading-tight">
                                        {leaderboardData[2].name}
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
                                    <TableHead className={`${headerClsName}`}>+/-</TableHead>
                                    <TableHead className={`${headerClsName}`}>%</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableRows}
                            </TableBody>
                        </TableRoot>
                    </div>
                </ScrollAreaViewport>
                <ScrollBar orientation="vertical" />

            </ScrollArea>
        </div >
    )
}