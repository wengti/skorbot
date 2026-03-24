'use server'

import { PlayersRecordType } from "@/components/match-home/match-home-leaderboard-server-component"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

type newEntry = {
    id: string
    wins: number
    losses: number
    scoreDiff: number
}

async function updateOneEntry(
    supabase: SupabaseClient,
    playerRecord: PlayersRecordType,
    newEntry: newEntry,
    relationship: 'teammate' | 'opponent'
) {
    const { data: curStatsData, error: curStatsError } = await supabase
        .from('stats')
        .select(
            `cur_player, other_player, relationship, wins, losses, score_diff, win_rate`
        )
        .eq('cur_player', playerRecord.user.id)
        .eq('other_player', newEntry.id)
        .eq('relationship', relationship)
    if (curStatsError) throw new Error(curStatsError.message)
    else if (curStatsData === null) throw new Error(`Unable to find the corresponding ${relationship} data.`)

    /* No previous record */
    if (curStatsData.length === 0) {
        const newData = {
            cur_player: playerRecord.user.id,
            other_player: newEntry.id,
            relationship: relationship,
            wins: newEntry.wins,
            losses: newEntry.losses,
            score_diff: newEntry.scoreDiff,
            win_rate: newEntry.wins + newEntry.losses === 0 ? 0 : ((newEntry.wins / (newEntry.wins + newEntry.losses)) * 100).toFixed(2)
        }
        const { error: insertError } = await supabase
            .from('stats')
            .insert(newData)
        if (insertError) throw new Error(insertError.message)
    }
    /* With Previous Record */
    else if (curStatsData.length > 0) {
        const oldEntry = curStatsData[0]
        const newData = {
            wins: oldEntry.wins + newEntry.wins,
            losses: oldEntry.losses + newEntry.losses,
            score_diff: oldEntry.score_diff + newEntry.scoreDiff,
            win_rate: oldEntry.wins + newEntry.wins + oldEntry.losses + newEntry.losses === 0 ? 0 : (((oldEntry.wins + newEntry.wins) / (oldEntry.wins + newEntry.wins + oldEntry.losses + newEntry.losses)) * 100).toFixed(2)
        }
        const { error: updateError } = await supabase
            .from('stats')
            .update(newData)
            .eq('cur_player', playerRecord.user.id)
            .eq('other_player', newEntry.id)
            .eq('relationship', relationship)

        if (updateError) throw new Error(updateError.message)
    }
}

export default async function updateStats(playersRecord: PlayersRecordType[]) {
    try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_SECRET_SUPABASE_KEY!, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            },
        })
        const promises: Promise<void>[] = []

        playersRecord.forEach(record => {
            for (let teammate of record.teammates) promises.push(updateOneEntry(supabase, record, teammate, 'teammate'))
            for (let opponent of record.opponents) promises.push(updateOneEntry(supabase, record, opponent, 'opponent'))
        })

        await Promise.all(promises)
        return { error: null }
    }
    catch (error) {
        if (error instanceof Error) return { error }
        else return { error: new Error('Unknown error happened while updating the stats.') }
    }

}