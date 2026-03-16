import { redirect } from "next/navigation"

import RoomCardGrid from "./room-card-grid"
import { Suspense } from "react"
import LoadingRoomCard from "./loading-room-card"


export default async function RoomCardSection({ isOwner }: { isOwner: boolean }) {

    try {
        return (
            <section className='my-6'>
                {/* Room Section Title */}
                <p className='text-2xl font-extrabold mb-2'>
                    {isOwner ? 'Hosted Rooms' : 'Joined Rooms'}
                </p>

                {/* Room Card Grid  */}
                <div className='grid grid-cols-[repeat(auto-fill,308px)] gap-4 justify-center justify-items-center'>
                    <Suspense fallback={<LoadingRoomCard />}>
                        <RoomCardGrid isOwner={isOwner} />
                    </Suspense>
                </div>
            </section>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }

}