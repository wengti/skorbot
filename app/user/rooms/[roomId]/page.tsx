import RoomHomeMatches from "@/components/room-home/room-home-matches"
import RoomHomeSearchForm from "@/components/room-home/room-home-search-form"
import { createClient } from "@/lib/supabase/server"
import { RoomDataType } from "@/type/room-data-type"
import { notFound, redirect } from "next/navigation"
import { MdLeaderboard } from "react-icons/md"


export default async function RoomHomePage({ params }: { params: Promise<{ roomId: string }> }) {
    try {
        const { roomId } = await params

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
                <section className='max-w-300 mx-auto'>
                    <RoomHomeSearchForm initParticipants={roomData[0].room_participants.map(p => p.users)} roomId={roomId} ownerId={roomData[0].owner} />
                </section>
                <section className='mt-4 max-w-300 mx-auto flex flex-col gap-4 md:flex-row md:gap-2'>
                    <RoomHomeMatches ownerId={roomData[0].owner} roomId={roomId} roomParticipants={roomData[0].room_participants.map(p => p.users)}/>

                    {/* To be replaced in future */}
                    <section>
                        <div className='text-xl font-bold mb-1 flex gap-2 items-center'>
                            <MdLeaderboard />
                            <h2>Stats</h2>
                        </div>
                        {/* The main section */}
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