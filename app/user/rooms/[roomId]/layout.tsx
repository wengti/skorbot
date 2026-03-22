import RoomHomeSearchForm from "@/components/room-home/room-home-participants"
import RoomHomeTitle from "@/components/room-home/room-home-title"
import { createClient } from "@/lib/supabase/server"
import { RoomDataType } from "@/type/room-data-type"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ReactNode } from "react"


export type RoomHomeLayoutDataType = {
    id: string,
    owner: string,
    name: string,
    picture: string
}

export default async function RoomHomeLayout({ params, children }: { params: Promise<{ roomId: string }>, children: ReactNode }) {
    try {
        const { roomId } = await params

        const supabase = await createClient()
        const { data, error } = await supabase
            .from('rooms')
            .select(
                `
                    id, owner, name, picture
                `
            )
            .eq('id', roomId)
        let roomData = data as RoomHomeLayoutDataType[] | null
        if (error) throw new Error(error.message)
        else if (roomData === null) notFound()

        return (
            <section>
                <Link href={`/user/rooms/${roomId}`} className='block w-fit'>
                    <RoomHomeTitle roomData={roomData}/>
                </Link>
                {children}
            </section>
        )

    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }


}