import { getUserData } from "@/lib/auth-utils"
import { createClient } from "@/lib/supabase/server"
import RoomCard from "./room-card"
import { redirect } from "next/navigation"
import { RoomDataType } from "@/type/room-data-type"



export default async function RoomCardGrid({isOwner}: {isOwner: boolean}) {
    try {
        /* Get current user data */
        const { data: userData, error: userError } = await getUserData()
        if (userError instanceof Error) throw userError
        else if (userError !== null) throw new Error(userError)

        const supabase = await createClient()
        let roomData: RoomDataType[] | null = []

        /* Code block to execute for Hosted Rooms */
        if (isOwner) {
            /* Get the rooms information if user is the host */
            const { data: fetchedRoomData, error: roomError } = await supabase
                .from('rooms')
                .select(`
                    id, name, picture, owner,
                    room_participants (
                        participant,
                        users(
                            name,
                            picture
                        )
                    )
                `)
                .eq('owner', userData?.claims.sub)
            roomData = fetchedRoomData as RoomDataType[] | null
            if (roomError) throw new Error(roomError.message)
            if (roomData === null) roomData = []
        }
        /* Code block to execute for Joined Rooms */
        else {
            /* Get room id if user is the participant of a room, but not the owner */
            const { data: involvedRoomData, error: involvedRoomError } = await supabase
                .from('room_participants')
                .select(`room`)
                .eq('participant', userData?.claims.sub)
                .eq('is_owner', false)
            if (involvedRoomError) throw new Error(involvedRoomError.message)
            if (involvedRoomData === null) roomData = []

            /* Get the room information based on the returned room id */
            else if (involvedRoomData !== null && involvedRoomData.length > 0) {
                const queryStr = involvedRoomData.map(({ room }) => `id.eq.${room}`).join(',')

                const { data: fetchedRoomData, error: roomError } = await supabase
                    .from('rooms')
                    .select(`
                        id, name, picture, owner,
                        room_participants (
                            participant,
                            users(
                                name,
                                picture
                            )
                        )
                    `)
                    .or(queryStr)
                roomData = fetchedRoomData as RoomDataType[] | null
                if (roomError) throw new Error(roomError.message)
                if (roomData === null) roomData = []
            }
        }

        /* Return the grid components */
        return (
            roomData.length === 0 ?
                <p className='text-slate-500 text-sm font-bold'>No result</p> :
                roomData.map(room => <RoomCard room={room} key={room.id} />)
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }
}