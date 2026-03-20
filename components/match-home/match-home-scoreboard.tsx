import { MatchDataType, PlayersDataType, ResultDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TbSword } from "react-icons/tb"
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area"
import MatchHomeScoreboardForm from "./match-home-scoreboard-form"



export default async function MatchHomeScoreboard({ matchData, playersData, resultData }: { matchData: MatchDataType, playersData: PlayersDataType[], resultData: ResultDataType[] }) {

    /* The entire scoreboard section */

    try {
        const tableName = matchData.team_config === 'one' ? 'results_1v1' : 'results_2v2'
        
        return (
            <section>
                <div className='text-xl font-bold mb-1 flex gap-2 items-center mt-4'>
                    <TbSword />
                    <h2>Matches</h2>
                    <h2>| {resultData.length} {resultData.length > 1 ? 'matches' : 'match'}</h2>
                </div>
                <ScrollArea className="h-100 w-full border my-2 rounded-xl">
                    <ScrollAreaViewport className="p-4 grid grid-cols-[repeat(auto-fit,290px)] gap-4 justify-center">
                        {/* The individual form / scoreboard for each match */}
                        {resultData.map( (data, idx) => <MatchHomeScoreboardForm resultData={data} idx={idx} key={data.id} playersData={playersData} tableName={tableName} matchData={matchData} />)}
                    </ScrollAreaViewport>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </section>
        )

    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }





}