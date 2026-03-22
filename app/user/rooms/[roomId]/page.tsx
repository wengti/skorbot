import RoomHomeLeaderboard from "@/components/room-home/room-home-leaderboard"
import RoomHomeMatchesOverview from "@/components/room-home/room-home-matches-overview"
import RoomHomeParticipants from "@/components/room-home/room-home-participants"
import { createClient } from "@/lib/supabase/server"
import { RoomDataType } from "@/type/room-data-type"
import { notFound, redirect } from "next/navigation"
import { IoPeopleSharp } from "react-icons/io5"
import { MdLeaderboard } from "react-icons/md"
import { TbSwords } from "react-icons/tb"


export default async function RoomHomePage({ params }: { params: Promise<{ roomId: string }> }) {
    try {

        /* Get room id */
        const { roomId } = await params

        /*  Get room details */
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('rooms')
            .select(
                `
                    id, owner, name, picture,
                    room_participants (
                        participant,
                        users (
                            id, name, email, picture
                        )
                    )
                `
            )
            .eq('id', roomId)
        let roomData = data as RoomDataType[] | null
        if (error) throw new Error(error.message)
        else if (roomData === null) notFound()

        return (
            <>
                {/* The latest participants*/}
                <section className='max-w-300 mx-auto'>
                    <section>
                        <div className='text-xl font-bold mb-1 flex gap-2 items-center'>
                            <IoPeopleSharp />
                            <h2>Participants</h2>
                        </div>
                        <RoomHomeParticipants roomData={roomData}/>
                    </section>
                </section>

                <section className='mt-4 max-w-300 mx-auto flex flex-col gap-4 md:flex-row md:gap-2'>

                    {/* All room matches overview */}
                    <section className='md:w-1/2'>
                        <div className='text-xl font-bold flex gap-2 items-center'>
                            <TbSwords />
                            <h2>Matches</h2>
                        </div>
                        <RoomHomeMatchesOverview ownerId={roomData[0].owner} roomId={roomId} roomParticipants={roomData[0].room_participants.map(p => p.users)} />
                    </section>

                    {/* All time leaderboard in this room */}
                    <section className='grow'>
                        <div className='text-xl font-bold flex gap-2 items-center'>
                            <MdLeaderboard />
                            <h2>Leaderboard</h2>
                        </div>
                        <RoomHomeLeaderboard roomId={roomId} />
                    </section>
                </section>
            </>
        )

    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }


}