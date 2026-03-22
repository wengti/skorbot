'use client'
import { MatchDataType, PlayersDataType, ResultDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page"
import { TbSword } from "react-icons/tb"
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area"
import MatchHomeScoreboardForm from "./match-home-scoreboard-form"
import { useState } from "react"
import { Pagination } from "../tailgrids/core/pagination"



export default function MatchHomeScoreboard({ matchData, playersData, resultData }: { matchData: MatchDataType, playersData: PlayersDataType[], resultData: ResultDataType[] }) {

    /* state - pagination */
    const [currentPage, setCurrentPage] = useState<number>(1)
    const totalPages = Math.ceil(resultData.length / 3)




    /* The entire scoreboard section */
    const tableName = matchData.team_config === 'one' ? 'results_1v1' : 'results_2v2'

    return (
        <section>
            <div className='text-xl font-bold mb-1 flex gap-2 items-center mt-4'>
                <TbSword />
                <h2>Matches</h2>
                <h2>| {resultData.length} {resultData.length > 1 ? 'matches' : 'match'}</h2>
            </div>
            <div className="h-130 w-full border my-2 rounded-xl flex flex-col">

                {/* The individual form / scoreboard for each match */}
                <div className='flex flex-col gap-2 items-center justify-center my-4 grow'>
                    {resultData.slice((currentPage - 1) * 3, (currentPage - 1) * 3 + 3).map((data, idx) => <MatchHomeScoreboardForm resultData={data} idx={idx} key={data.id} playersData={playersData} tableName={tableName} matchData={matchData} />)}
                </div>

                {/* Pagination */}
                <div className='my-2 mx-2'>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => { setCurrentPage(page) }}
                    />
                </div>
            </div>
        </section>
    )






}