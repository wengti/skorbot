import { redirect } from "next/navigation"
import { StatsMatchDataType } from "./stats-matches"
import { getUserData } from "@/lib/auth-utils"
import { LiaStarSolid } from "react-icons/lia"
import Link from "next/link"
import StatsMatchesSectionPagination from "./stats-matches-section-pagination"
import { Avatar } from "../tailgrids/core/avatar"
import { getARoomProfilePictureLink } from "@/lib/room-picture"
import { createClient } from "@/lib/supabase/server"
import { FaLock, FaLockOpen } from "react-icons/fa6"

export default async function StatsMatchesSection({ matchData }: { matchData: StatsMatchDataType[] }) {
    try {

        const supabase = await createClient()

        const { data: currentUserData, error: currentUserError } = await getUserData()
        if (currentUserError instanceof Error) throw new Error(currentUserError.message)
        else if (currentUserError !== null) throw new Error(currentUserError)
        else if (currentUserData === null) throw new Error('Failure to identify the current user.')

        const currentUserId = currentUserData.claims.sub


        /* Creating the match cell */
        const matchesDisplay = matchData.map(data => {

            /* Converting to date time */
            const dateTime = new Date(data.created_at)

            /* Get the room participants of the match */
            const roomParticipants = data.rooms.room_participants.map(p => p.participant)

            /* The actual match cell */
            return (
                <div key={data.id} className='flex gap-2 bg-(--color-pale) dark:bg-(--color-dark-pale) rounded-xl h-20 items-center'>
                    <div className='grow px-2'>
                        <div className='flex justify-between'>

                            <div className='flex items-center'>
                                <div className='flex gap-1 mr-2'>
                                    {data.players.includes(currentUserId) && <LiaStarSolid className='text-green-500' />}
                                    {data.is_pending ? <FaLockOpen /> : <FaLock />}
                                </div>
                                <p className='text-sm text-gray-500 font-bold'>Created at {dateTime.toLocaleDateString('en-GB')}</p>
                            </div>
                            {
                                roomParticipants.includes(currentUserId) &&
                                <Link href={`/user/rooms/${data.room}/match/${data.id}`} className="underline text-sm">See More</Link>
                            }
                        </div>
                        <div className='mt-2 flex gap-2 justify-center items-center font-bold text-md lg:text-xl'>
                            <Avatar
                                src={getARoomProfilePictureLink(supabase, data.rooms.owner, data.rooms.picture)}
                                fallback={data.rooms.name[0]}
                                size="md"
                                label={{ title: data.rooms.name }}
                            />
                            <p className='border-l pl-1'>{data.team_config === 'one' ? '1v1' : '2v2'}</p>
                            <p className='border-l pl-1'>{data.length[0].toUpperCase() + data.length.slice(1)}</p>
                            <p className='border-l pl-1 hidden lg:block'>{data.num_of_rounds} round</p>
                        </div>
                    </div>
                </div>
            )
        })

        /* Full returned component with pagination */
        return (
            <div className="w-full mt-2 rounded-lg flex flex-col h-full">
                <div className='grow'>
                    {
                        matchData.length > 0 ?
                            <StatsMatchesSectionPagination>
                                {matchesDisplay}
                            </StatsMatchesSectionPagination> :
                            <p className='text-gray-500 text-center'>No Result</p>
                    }
                </div>
            </div>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }
}