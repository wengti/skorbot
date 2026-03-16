import { ClientUserContextType } from "./auth-type"
/* 
{
    id: string
    name: string
    email: string
    picture: string
}
*/

type RoomParticipantsType = {
    participant: string
    users: ClientUserContextType // which is same as ClientUserContextType
}

export type RoomDataType = {
    id: string
    name: string
    picture: string
    owner: string
    room_participants: RoomParticipantsType[]
}