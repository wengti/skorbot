import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FaRegCalendarAlt } from "react-icons/fa";
import StatsMatchesSection from "./stats-matches-section";
import { FaLockOpen } from "react-icons/fa6";


export type StatsMatchDataType = {
    id: string,
    created_at: Date,
    team_config: 'one' | 'two',
    num_of_rounds: number,
    length: 'short' | 'medium' | 'long',
    players: string[],
    is_pending: boolean,
    room: string
    rooms: {
        owner: string
        name: string
        picture: string
        room_participants: {
            participant: string

        }[]
    }
}

export default async function StatsMatches({ playerId }: { playerId: string }) {

    try {

        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('')
            }, 10000)
        })
        
        const supabase = await createClient()
        const { data: rawMatchData, error: matchError } = await supabase
            .from('matches')
            .select(
                `id, created_at, team_config, num_of_rounds, players, length, is_pending, room,
                rooms(
                    owner, name, picture,
                    room_participants(
                        participant
                    )
                )
                `
            )
            .contains('players', [playerId])
            .order('created_at', { ascending: false })
        if (matchError) throw new Error(matchError.message)
        else if (rawMatchData === null) throw new Error('Unknown error in fetching the match data for this requested player.')
        const matchData = rawMatchData as unknown as StatsMatchDataType[]

        return (
            <div className="flex flex-col gap-2 mb-4">

                <div className='flex flex-col md:flex-row gap-2'>

                    <div className='md:w-1/2 border rounded-xl p-2 flex flex-col gap-2 h-130'>
                        <div className='text-lg font-bold mb-1 flex gap-2 items-center'>
                            <FaRegCalendarAlt />
                            <h2>All Matches</h2>
                        </div>
                        <p className='text-sm text-slate-500 dark:text-gray-500 -mt-2'>All past matches.</p>
                        <StatsMatchesSection matchData={matchData} />
                    </div>

                    <div className='md:w-1/2 border rounded-xl p-2 flex flex-col gap-2 h-130'>
                        <div className='text-lg font-bold mb-1 flex gap-2 items-center'>
                            <FaLockOpen />
                            <h2>Unfinalized Matches</h2>
                        </div>
                        <p className='text-sm text-slate-500 dark:text-gray-500 -mt-2'>Contact the room owner to finalize it.</p>
                        <StatsMatchesSection matchData={matchData.filter(d => d.is_pending === true)} />
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