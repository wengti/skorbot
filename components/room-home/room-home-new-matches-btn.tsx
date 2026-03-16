'use client'

import { useClientUserContext } from "@/context/client-user-context-provider"
import Link from "next/link"
import Button from "../my-ui/button"

export default function RoomHomeNewMatchesBtn({ownerId, roomId}: {ownerId: string, roomId: string}){

    const currentUser = useClientUserContext()

    return (
        currentUser.id === ownerId ?
        <Link href={`/user/rooms/${roomId}/add-match`}>
            <Button size='sm'>
                Create a new match
            </Button>
        </Link>:
        null
    )

}