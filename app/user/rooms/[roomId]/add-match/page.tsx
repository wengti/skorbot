import AddMatchForm from "@/components/add-match-form/add-match-form"
import { createClient } from "@/lib/supabase/server"
import { ClientUserContextType } from "@/type/auth-type"
import { redirect } from "next/navigation"

type RoomParticipantsDataType = {
    participant: string,
    users: ClientUserContextType
}

export default async function AddMatchPage({ params }: { params: Promise<{ roomId: string }> }) {

    try {
        const { roomId } = await params

        const supabase = await createClient()
        const { data, error } = await supabase
            .from('room_participants')
            .select(
                `
                participant,
                users(
                    id, email, name, picture
                )
                `
            )
            .eq('room', roomId)
        let roomParticipantsData = data as RoomParticipantsDataType[] | null
        if (error) throw new Error(error.message)
        else if (roomParticipantsData === null) throw new Error('Unknown error')
            
        const roomParticipants = roomParticipantsData.map(p => p.users)

        return (
            <AddMatchForm roomParticipants={roomParticipants} roomId={roomId}/>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }


}