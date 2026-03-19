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
        const { roomId, matchId } = await params

        const supabase = await createClient()
        const { data: rawMatchData, error: matchError } = await supabase
            .from('matches')
            .select('id, created_at, team_config, num_of_rounds, length, maxLength, note')
            .eq('id', matchId)
        if(matchError) throw new Error(matchError.message)
        else if (rawMatchData === null) throw new Error('Failure in fetching the data for the requested match.')
        const matchData = rawMatchData as MatchDataType[]
        
        const {data: rawPlayersData, error: playersError} = await supabase
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
        
        if(playersError) throw new Error(playersError.message)
        else if (rawPlayersData === null) throw new Error('Failure in fetching the player data for the requested match.')
        const playersData = rawPlayersData as unknown as PlayersDataType[]

        return (
            <>
                <MatchHomeTitle matchData={matchData[0]} />
                <MatchHomeScoreboard matchData={matchData[0]} playersData={playersData}/>
            </>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }

}