import RoomHomeSearchForm from "@/components/room-home/room-home-search-form"
import RoomHomeTitle from "@/components/room-home/room-home-title"
import { createClient } from "@/lib/supabase/server"
import { RoomDataType } from "@/type/room-data-type"
import { notFound, redirect } from "next/navigation"


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
            <section>
                <RoomHomeSearchForm initParticipants={roomData[0].room_participants.map( p => p.users)} roomId={roomId} ownerId={roomData[0].owner}/>
            </section>
        )

    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }


}