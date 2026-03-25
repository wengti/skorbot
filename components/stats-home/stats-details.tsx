import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FaHandshake } from "react-icons/fa";
import StatsTable from "./stats-table";
import { ClientUserContextType } from "@/type/auth-type";
import { GiSwordsEmblem } from "react-icons/gi";
import StatsSummary from "./stats-summary";

export type StatsDataType = {
    other_player: string
    relationship: 'teammate' | 'opponent' | 'self'
    wins: number
    losses: number
    score_diff: number
    win_rate: number
    user: ClientUserContextType
}

export default async function StatsDetails({ playerId }: { playerId: string }) {

    try {

        const supabase = await createClient()

        /* Fetch the user stats */
        const { data: rawStatsData, error: statsError } = await supabase
            .from('stats')
            .select(
                `
                    other_player, relationship, wins, losses, score_diff, win_rate,
                    user: users!stats_other_player_fkey(id, name, email, picture)
                
                `
            )
            .eq('cur_player', playerId)
            .order('win_rate', { ascending: false })
            .order('wins', { ascending: false })
            .order('score_diff', { ascending: false })

        if (statsError) throw new Error(statsError.message)
        else if (rawStatsData === null) throw new Error('Unknown error in fetching the statistics data for this requested player.')
        const statsData = rawStatsData as unknown as StatsDataType[]

        const selfData = statsData.filter(d => d.relationship === 'self')
        const teammateData = statsData.filter(d => d.relationship === 'teammate')
        const opponentData = statsData.filter(d => d.relationship === 'opponent')

        return (
            <div className="flex flex-col gap-2">

                <StatsSummary
                    statsData={selfData}
                    bestTeammate={teammateData[0]}
                    worstOpponent={opponentData[opponentData.length - 1]}
                />

                <div className='flex flex-col md:flex-row gap-2'>

                    <div className='md:w-1/2 border rounded-xl p-2 flex flex-col gap-2 h-78 lg:h-88'>
                        <div className='text-lg font-bold mb-1 flex gap-2 items-center'>
                            <FaHandshake />
                            <h2>Record with these teammates</h2>
                        </div>
                        <StatsTable statsData={teammateData} />
                    </div>

                    <div className='md:w-1/2 border rounded-xl p-2 flex flex-col gap-2 h-78 lg:h-88'>
                        <div className='text-lg font-bold mb-1 flex gap-2 items-center'>
                            <GiSwordsEmblem />
                            <h2>H2H versus these opponents</h2>
                        </div>
                        <StatsTable statsData={opponentData} />
                    </div>
                </div>
            </div>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }
}