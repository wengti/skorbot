'use server'

import arrangeMatchups from "./match-algo"
import { createClient } from "./supabase/server"

type newMatchType = {
    room: string
    players: string[]
    team_config: 'one' | 'two'
    num_of_rounds: number
    length: 'short' | 'medium' | 'long'
    maxLength: number
    note: string
}

export async function createANewMatch({ room, players, team_config, num_of_rounds, length, maxLength, note }: newMatchType) {

    try {
        /* Data sanitization */
        if (players.length < 4 && team_config === 'two') {
            throw new Error('Not enough player to set up for 2v2.')
        }

        if (team_config === 'one' && length !== 'short') {
            throw new Error('The length of a 1v1 match can only be short.')
        }

        /* Create server supabase client */
        const supabase = await createClient()

        /* Get current user */
        const { data: currentUserData, error: currentUserError } = await supabase.auth.getClaims()
        if (currentUserError) throw new Error(currentUserError.message)
        else if (currentUserData === null) throw new Error("Unable to verify the current user's id.")
        const currentUser = currentUserData.claims.sub


        /* Create a new match entry */
        const { data: insertedMatchData, error: addMatchError } = await supabase
            .from('matches')
            .insert(
                { room, players, team_config, num_of_rounds, length, maxLength, note }
            )
            .select('id')
        const newMatchData = insertedMatchData as { id: string }[] | null
        if (addMatchError) throw new Error(addMatchError.message)
        else if (newMatchData === null) throw new Error('Fail to insert a new match entry.')


        /* Create new match player entry */
        const matchId = newMatchData[0].id
        const newMatchPlayerEntries = players.map(player => {
            return {
                room, match: matchId, player, has_paid: currentUser === player //if the player is the owner, default to has_paid = true, else false
            }
        })
        const { error: addMatchPlayerError } = await supabase
            .from('match_players')
            .insert(newMatchPlayerEntries)
        if(addMatchPlayerError) throw new Error(addMatchPlayerError.message)

        /* Create matches */
        const rawMatchups = arrangeMatchups(players, team_config, length, num_of_rounds, maxLength, false)
        const matchups = rawMatchups?.flatFullResult
        if(matchups){
            const tableName = team_config === 'one' ? 'results_1v1' : 'results_2v2'
            const matchupData = matchups.map( (matchup, idx) => {
                return {
                    ...matchup,
                    match_index: idx+1,
                    room,
                    match: matchId,
                    score_a: 0,
                    score_b: 0
                }
            })

            const {error: addMatchEntryError} = await supabase
                .from(tableName)
                .insert(matchupData)
            if(addMatchEntryError) throw new Error(addMatchEntryError.message)

        } else{
            throw new Error('Error in generating matchups.')
        }
        

        return {errorState: null, matchId: matchId}

    }
    catch (error) {
        if (error instanceof Error) return {errorState: error, matchId: ''}
        else return {errorState: new Error('Unknown Error.'), matchId: ''}
    }

}