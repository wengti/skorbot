import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import MatchHomeLeaderboardServerComponent from "../match-home/match-home-leaderboard-server-component"
import { PlayersDataType, ResultDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page"
import { ClientUserContextType } from "@/type/auth-type"


export default async function RoomHomeLeaderboard({ roomId }: { roomId: string }) {

    try {

        /* Fetch the room participants detail of this room */
        const supabase = await createClient()
        const { data: rawRPData, error: RPError } = await supabase
            .from('room_participants')
            .select(
                `
                participant,
                users(
                    id, name, picture, email
                )
                `
            )
            .eq('room', roomId)
        if (RPError) throw new Error(RPError.message)
        else if (rawRPData === null) throw new Error('Failure in fetching the room participants data.')

        /* Map the fetched data in such a way that it statisfies the required format of PlayersDataType */
        const playersData = rawRPData.map(data => {
            return {
                player: data.participant,
                has_paid: false,
                users: data.users as unknown as ClientUserContextType
            }
        })

        /* Fetch the results of 2v2 */
        const { data: twoData, error: twoError } = await supabase
            .from('results_2v2')
            .select(
                `
                id, player_a1, player_a2, score_a, player_b1, player_b2, score_b, is_locked, match_index
                `
            )
            .eq('room', roomId)
        if (twoError) throw new Error(twoError.message)
        else if (twoData === null) throw new Error('Failure in fetching the 2v2 results data.')

        /* Fetch the results of 1v1 */
        const { data: oneData, error: oneError } = await supabase
            .from('results_1v1')
            .select(
                `
                id, player_a1, score_a, player_b1, score_b, is_locked, match_index
                `
            )
            .eq('room', roomId)
        if (oneError) throw new Error(oneError.message)
        else if (oneData === null) throw new Error('Failure in fetching the 1v1 results data.')
        
        /* Merge the results of 1v1 and 2v2  */
        const resultData = [...oneData, ...twoData]

        /* Pass on to the server component for computing the results */
        return <MatchHomeLeaderboardServerComponent playersData={playersData} resultData={resultData} matchData={null}/>
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }


}