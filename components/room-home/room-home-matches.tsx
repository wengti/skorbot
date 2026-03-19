import { TbSwords } from "react-icons/tb";
import RoomHomeNewMatchesBtn from "./room-home-new-matches-btn";
import RoomHomeMatchesOverview from "./room-home-matches-overview";
import { ClientUserContextType } from "@/type/auth-type";

export default async function RoomHomeMatches({ownerId, roomId, roomParticipants}: {ownerId: string, roomId: string, roomParticipants: ClientUserContextType[]}) {


    return (
        <section className='md:w-1/2'>
            <div className='text-xl font-bold mb-1 flex gap-2 items-center'>
                <TbSwords />
                <h2>Matches</h2>
            </div>
            <RoomHomeNewMatchesBtn ownerId={ownerId} roomId={roomId}/>
            <RoomHomeMatchesOverview roomId={roomId} roomParticipants={roomParticipants}/>
        </section>
    )

}