'use client'
import { RoomHomeLayoutDataType } from "@/app/user/rooms/[roomId]/layout"
import { getARoomProfilePictureLink } from "@/lib/room-picture"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { usePathname } from "next/navigation"


export default function RoomHomeTitle({ roomData }: { roomData: RoomHomeLayoutDataType[]}) {

    const pathname = usePathname()
    const currentSection = pathname.split('/').at(-1)
    let currentSectionName = 'Home'
    if(currentSection === 'all-participants') currentSectionName = 'All Participants'
    if(currentSection === 'add-match') currentSectionName = 'New Match'
        
    const supabase = createClient()

    return (
        <div className='flex gap-2 items-center mb-4 w-fit'>
            <Image
                height={64}
                width={64}
                alt={`The picture for room ${roomData[0].id}`}
                src={getARoomProfilePictureLink(supabase, roomData[0].owner, roomData[0].picture)}
                className='w-10 h-10 rounded-full border border-black dark:border-(--color-dark-text)'
            />
            <h1 className='text-2xl font-extrabold'>{roomData[0].name} | {currentSectionName} </h1>
            
        </div>
    )


}