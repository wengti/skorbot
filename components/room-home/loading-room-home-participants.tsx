import Link from "next/link"
import { Skeleton } from "../tailgrids/core/skeleton"

export default function LoadingRoomHomeParticipants({roomId}: {roomId: string}) {

    const placeholder = []
    for (let i = 0; i < 6; i++) {
        placeholder.push(
            <div className="flex w-full max-w-sm items-center gap-3" key={i}>
                <Skeleton className="size-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        )
    }

    return (
        <div className='border my-2 rounded-lg px-2 py-2'>
            <div className='flex justify-center items-center'>
                <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
                    {placeholder}
                </div>
            </div>
            <div className='flex justify-center'>
                <Link href={`/user/rooms/${roomId}/all-participants`}>
                    <p className='underline w-fit text-sm font-bold mt-2'>
                        See All
                    </p>
                </Link>
            </div>
        </div>
    )
}