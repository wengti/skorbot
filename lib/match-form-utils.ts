'use server'

import { createClient } from "./supabase/server"

type newMatchType = {
    room: string
    players: string[]
    team_config: 'one' | 'two'
    num_of_rounds: number
    length: 'short' | 'medium' | 'long'
    note: string
}

export async function createANewMatch({ room, players, team_config, num_of_rounds, length, note }: newMatchType) {

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
                { room, players, team_config, num_of_rounds, length, note }
            )
            .select('id')
        const newMatchData = insertedMatchData as { id: string } | null
        if (addMatchError) throw new Error(addMatchError.message)
        else if (newMatchData === null) throw new Error('Fail to insert a new match entry.')


        /* Create new match player entry */
        const { id: matchId } = newMatchData
        const newMatchPlayerEntries = players.map(player => {
            return {
                room, match: matchId, player, has_paid: currentUser === player //if the player is the owner, default to has_paid = true, else false
            }
        })
        const { error: addMatchPlayerError } = await supabase
            .from('match_players')
            .insert(newMatchPlayerEntries)
        if(addMatchPlayerError) throw new Error(addMatchPlayerError.message)
        

        return null

    }
    catch (error) {
        if (error instanceof Error) return error
        else return new Error('Unknown Error.')
    }

}