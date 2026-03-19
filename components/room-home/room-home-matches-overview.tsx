import { createClient } from "@/lib/supabase/server";
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AvatarGroup } from "../tailgrids/core/avatar";
import { getAProfilePicture } from "@/lib/picture";
import { getUserData } from "@/lib/auth-utils";
import { LiaStarSolid } from "react-icons/lia";
import { ClientUserContextType } from "@/type/auth-type";
import { cacheTag } from "next/cache";

type MatchDataType = {
    id: string,
    created_at: Date,
    team_config: 'one' | 'two',
    num_of_rounds: number,
    length: 'short' | 'medium' | 'long'
    players: string[]
}

async function getCurrentUserId() {
    const { data, error } = await getUserData()
    if (error) throw new Error(error instanceof Error ? error.message : error)
    else if (data === null) throw new Error("Cannot verify current user's id")
    return data.claims.sub
}

async function getMatchesData(roomId: string): Promise<MatchDataType[]> {
    const supabase = await createClient()
    const { data: rawMatchData, error: matchError } = await supabase
        .from('matches')
        .select(`id, created_at, team_config, num_of_rounds, players, length`)
        .eq('room', roomId)
        .order('created_at', { ascending: false })
    if (matchError || rawMatchData === null) throw new Error(matchError.message)
    return rawMatchData
}


export default async function RoomHomeMatchesOverview({ roomId, roomParticipants }: { roomId: string, roomParticipants: ClientUserContextType[] }) {


    try {
        /* Get the current user */
        const currentUserId = await getCurrentUserId()

        /* Fetch all the relevant matches */
        const matchData = await getMatchesData(roomId)

        /* Creating the match cell */
        const matchesDisplay = matchData.map(data => {

            /* Creating the data needed for avatar group */
            const avatarGroupData = data.players.slice(0, 5).map(player => {
                const playerData = roomParticipants.find(p => p.id === player)
                return {
                    src: playerData ? playerData.picture : '/images/profile_inactive.png',
                    alt: `The profile picture of ${playerData ? playerData.name : 'An inactive user'}.`
                }
            })

            /* Converting to date time */
            const dateTime = new Date(data.created_at)

            /* The actual match cell */
            return (
                <div key={data.id} className='flex gap-2 bg-(--color-pale) dark:bg-(--color-dark-pale) rounded-xl h-20 items-center'>
                    <div className='grow px-2'>
                        <div className='flex justify-between'>
                            <div className='flex items-center'>
                                {data.players.includes(currentUserId) && <LiaStarSolid className='text-green-500' />}
                                <p className='text-sm text-gray-500 font-bold'>Created at {dateTime.toLocaleDateString('en-GB')}</p>
                            </div>
                            <Link href={`/user/rooms/${roomId}/match/${data.id}`} className="underline text-sm">See More</Link>
                        </div>
                        <div className='mt-2 flex gap-2 justify-center items-center font-bold text-md lg:text-xl'>
                            <AvatarGroup data={avatarGroupData} size='sm' />
                            <p className='border-l pl-1'>{data.team_config === 'one' ? '1v1' : '2v2'}</p>
                            <p className='border-l pl-1'>{data.length[0].toUpperCase() + data.length.slice(1)}</p>
                            <p className='border-l pl-1 hidden lg:block'>{data.num_of_rounds} round</p>
                        </div>
                    </div>
                </div>
            )
        })


        /* Returned Element */
        return (
            <ScrollArea className="h-100 w-full border my-4 rounded-xl">
                <ScrollAreaViewport className="p-4 flex flex-col gap-2">
                    {matchData.length > 0 ? matchesDisplay: <p className='text-gray-500 text-center'>No Result</p>}
                </ScrollAreaViewport>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }

}