

import { RoomDataType } from "@/type/room-data-type";
import { Avatar } from "../tailgrids/core/avatar";
import { redirect } from "next/navigation";
import Link from "next/link";


export default function RoomHomeParticipants({ roomData }: { roomData: RoomDataType[] }) {

    try {

        const roomParticipants = roomData[0].room_participants.slice(0, 5).map(p => p.users)
        const extraNum = roomData[0].room_participants.length - 5
        const roomParticipantsAvatar = roomParticipants.map(p => {
            return (
                <div key={p.id} className='w-fit'>
                    <Avatar
                        src={p.picture}
                        fallback={p.name.slice(1)}
                        size="lg"
                        label={{ title: p.name, subtitle: p.email }}
                    />
                </div>
            )
        })

        return (
            <div className='border my-2 rounded-lg px-2 py-2'>
                <div className='flex justify-center items-center'>
                    <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
                        {roomParticipantsAvatar}
                        {
                            extraNum > 0 &&
                            <div className='self-center justify-self-center'>and {extraNum} more</div>
                        }
                    </div>
                </div>
                <div className='flex justify-center'>
                    <Link href={`/user/rooms/${roomData[0].id}/all-participants`}>
                        <p className='underline w-fit text-sm font-bold mt-2'>
                            See All
                        </p>
                    </Link>
                </div>
            </div>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }



}