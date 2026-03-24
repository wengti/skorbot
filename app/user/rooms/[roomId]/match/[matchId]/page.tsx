import MatchHomeLeaderboard from "@/components/match-home/match-home-leaderboard"
import MatchHomePaymenmt from "@/components/match-home/match-home-payment"
import MatchHomePreview from "@/components/match-home/match-home-preview"
import MatchHomeScoreboard from "@/components/match-home/match-home-scoreboard"
import MatchHomeTitle from "@/components/match-home/match-home-title"
import { createClient } from "@/lib/supabase/server"
import { ClientUserContextType } from "@/type/auth-type"
import { redirect } from "next/navigation"


export type MatchDataType = {
    id: string
    created_at: Date
    team_config: 'one' | 'two'
    num_of_rounds: number
    length: 'short' | 'medium' | 'long'
    maxLength: number
    note: string
    players: string[]
    rooms: {
        id: string
        owner: string
    }
    is_pending: boolean
}

export type ResultDataType = {
    id: string
    player_a1: string
    player_a2?: string
    score_a: number
    player_b1: string
    player_b2?: string
    score_b: number
    is_locked: boolean
    match_index: number
}

export type PlayersDataType = {
    player: string
    has_paid: boolean
    users: ClientUserContextType
}

export default async function MatchHomePage({ params }: { params: Promise<{ roomId: string, matchId: string }> }) {

    try {
        /* Getting roomId & matchId from the URL */
        const { roomId, matchId } = await params

        /* Fetch the data of the match from 'matches' table */
        const supabase = await createClient()
        const { data: rawMatchData, error: matchError } = await supabase
            .from('matches')
            .select(`
                id, created_at, team_config, num_of_rounds, length, maxLength, note, players, is_pending,
                rooms(
                    id, owner
                )
            `)
            .eq('id', matchId)
        if (matchError) throw new Error(matchError.message)
        else if (rawMatchData === null) throw new Error('Failure in fetching the data for the requested match.')
        const matchData = rawMatchData as unknown as MatchDataType[]

        /* Fetch the data of the player involved in this match from 'match_players' table */
        const { data: rawPlayersData, error: playersError } = await supabase
            .from('match_players')
            .select(
                `
                    player, has_paid,
                    users(
                        id, name, email, picture
                    )
                `
            )
            .eq('match', matchId)
        if (playersError) throw new Error(playersError.message)
        else if (rawPlayersData === null) throw new Error('Failure in fetching the player data for the requested match.')
        const playersData = rawPlayersData as unknown as PlayersDataType[]


        /* Fetch the results corresponding to this match ID from either `results_1v1` or `results_2v2` */
        const tableName = matchData[0].team_config === 'one' ? 'results_1v1' : 'results_2v2'
        let resultData: ResultDataType[] = null!
        if (matchData[0].team_config === 'one') {
            const { data: rawResultData, error: resultError } = await supabase
                .from(tableName)
                .select('id, player_a1, score_a, player_b1, score_b, is_locked, match_index')
                .eq('match', matchData[0].id)
                .order('match_index', { ascending: true })
            if (resultError) throw new Error(resultError.message)
            else if (rawResultData === null) throw new Error('Failure in fetching the result data for the requested match.')
            resultData = rawResultData as ResultDataType[]
        }
        else if (matchData[0].team_config === 'two') {
            const { data: rawResultData, error: resultError } = await supabase
                .from(tableName)
                .select('id, player_a1, player_a2, score_a, player_b1, player_b2, score_b, is_locked, match_index')
                .eq('match', matchData[0].id)
                .order('match_index', { ascending: true })
            if (resultError) throw new Error(resultError.message)
            else if (rawResultData === null) throw new Error('Failure in fetching the result data for the requested match.')
            resultData = rawResultData as ResultDataType[]
        }

        return (
            <>
                <MatchHomeTitle matchData={matchData[0]} />
                <div className='lg:flex lg:gap-2'>
                    <div className='lg:w-5/11'>
                        <MatchHomeScoreboard matchData={matchData[0]} playersData={playersData} resultData={resultData} />
                    </div>
                    <div className='lg:w-6/11'>
                        <MatchHomeLeaderboard playersData={playersData} resultData={resultData} matchData={matchData[0]}/>
                    </div>
                </div>
                <div className='lg:flex lg:gap-2'>
                    <div className='lg:w-5/11'>
                        <MatchHomePreview matchData={matchData[0]} playersData={playersData} />
                    </div>
                    <div className='lg:w-6/11'>
                        <MatchHomePaymenmt matchData={matchData[0]} playersData={playersData} roomId={roomId}/>
                    </div>
                </div>
                
            </>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }

}