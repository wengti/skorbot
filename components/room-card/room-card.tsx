import Image from "next/image";
import { getARoomProfilePictureLink } from "@/lib/room-picture";
import { AvatarGroup } from "../tailgrids/core/avatar";
import { FaHome } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";
import { SupabaseClient } from "@supabase/supabase-js";
import { getAProfilePicture } from "@/lib/picture";
import Link from "next/link";
import { RoomDataType } from "@/type/room-data-type";

export default function RoomCard({ room, supabase }: { room: RoomDataType, supabase: SupabaseClient<any, "public", "public", any, any> }) {

    /* Cut the room name down to 12 letters only */
    const roomName = room.name.length >= 12 ? room.name.slice(0, 12).trim() + '...' : room.name

    /* Get the room picture */
    const roomPicture = getARoomProfilePictureLink(supabase, room.owner, room.picture)

    /* Show the first 5 participants */
    const roomParticipants = room.room_participants.slice(0, 5).map(participant => {
        return {
            src: participant.users.picture,
            alt: participant.users.name
        }
    })

    /* Returned Component */
    return (
        <div key={room.id} className='bg-(--color-pale) dark:bg-(--color-dark-pale) w-77 h-77 rounded-md p-2 shadow-2xl flex flex-col gap-2 border'>
            <div className='flex gap-4 p-4 items-center grow'>
                <Image
                    height={64}
                    width={64}
                    alt={`The picture for room ${room.id}`}
                    src={roomPicture}
                    className='w-20 h-20 rounded-full border border-black dark:border-(--color-dark-text)'
                />
                <div className='flex flex-col gap-1'>
                    <p className='text-2xl font-extrabold'>
                        {roomName}
                    </p>
                    <AvatarGroup data={roomParticipants} size='sm' />
                </div>
            </div>
            <div className='h-35 w-full flex gap-4 text-7xl items-center justify-center border rounded-md relative'>
                <p className='absolute -top-4 left-4 text-lg bg-(--color-pale) dark:bg-(--color-dark-pale) px-2 '>Shortcut</p>
                <Link href={`/user/rooms/${room.id}`}><FaHome className='cursor-pointer' /></Link>
                <MdLeaderboard className='cursor-pointer' />
                <Link href={`/user/rooms/${room.id}/all-participants`}><IoPeopleSharp className='cursor-pointer' /></Link>
            </div>
        </div>
    )
}