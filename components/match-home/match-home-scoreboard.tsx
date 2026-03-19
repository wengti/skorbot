import { MatchDataType, PlayersDataType, ResultDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TbSword } from "react-icons/tb"
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area"
import MatchHomeScoreboardForm from "./match-home-scoreboard-form"



export default async function MatchHomeScoreboard({ matchData, playersData, roomId }: { matchData: MatchDataType, playersData: PlayersDataType[], roomId: string }) {

    try {
        const supabase = await createClient()
        const tableName = matchData.team_config === 'one' ? 'results_1v1' : 'results_2v2'
        let resultData: ResultDataType[] = null!

        if (matchData.team_config === 'one') {
            const { data: rawResultData, error: resultError } = await supabase
                .from(tableName)
                .select('id, player_a1, score_a, player_b1, score_b, is_locked, match_index')
                .eq('match', matchData.id)
                .order('match_index', {ascending: true})
            if (resultError) throw new Error(resultError.message)
            else if (rawResultData === null) throw new Error('Failure in fetching the result data for the requested match.')
            resultData = rawResultData as ResultDataType[]
        }
        else if (matchData.team_config === 'two') {
            const { data: rawResultData, error: resultError } = await supabase
                .from(tableName)
                .select('id, player_a1, player_a2, score_a, player_b1, player_b2, score_b, is_locked, match_index')
                .eq('match', matchData.id)
                .order('match_index', {ascending: true})
            if (resultError) throw new Error(resultError.message)
            else if (rawResultData === null) throw new Error('Failure in fetching the result data for the requested match.')
            resultData = rawResultData as ResultDataType[]
        }




        return (
            <section>
                <div className='text-xl font-bold mb-1 flex gap-2 items-center mt-4'>
                    <TbSword />
                    <h2>Matches</h2>
                    <h2>| {resultData.length} {resultData.length > 1 ? 'matches' : 'match'}</h2>
                </div>
                <ScrollArea className="h-100 w-full border my-2 rounded-xl">
                    <ScrollAreaViewport className="p-4 grid grid-cols-[repeat(auto-fit,290px)] gap-4 justify-center">
                        {resultData.map( (data, idx) => <MatchHomeScoreboardForm resultData={data} idx={idx} key={data.id} playersData={playersData} tableName={tableName} roomId={roomId}/>)}
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