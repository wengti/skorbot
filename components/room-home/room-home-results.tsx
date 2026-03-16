import { createClient } from "@/lib/supabase/server";
import { MdLeaderboard } from "react-icons/md";
import RoomHomeNewMatchesBtn from "./room-home-new-matches-btn";

export default async function RoomHomeResults({ownerId, roomId}: {ownerId: string, roomId: string}) {
        

    return (
        <section>
            <div className='text-xl font-bold mb-1 flex gap-2 items-center'>
                <MdLeaderboard />
                <h2>Results</h2>
            </div>
            <RoomHomeNewMatchesBtn ownerId={ownerId} roomId={roomId}/>
        </section>
    )

}