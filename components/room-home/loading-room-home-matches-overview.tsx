import { RoomDataType } from "@/type/room-data-type";
import RoomHomeNewMatchesBtn from "./room-home-new-matches-btn";
import { Skeleton } from "../tailgrids/core/skeleton";

export default function LoadingRoomHomeMatchesOverview({ roomData }: { roomData: RoomDataType }) {

    const matchCells = []
    for (let i = 0; i < 4; i++) {
        matchCells.push(
            <Skeleton className="h-20 w-full rounded-xl" key={i} />
        )
    }

    return (
        <div className="h-130 w-full mt-2 border rounded-lg flex flex-col ">
            <div className='mt-2 mx-2'>
                <RoomHomeNewMatchesBtn ownerId={roomData.owner} roomId={roomData.id} />
            </div>
            <div className='grow'>
                <div className='flex flex-col gap-2 px-2 pt-4 pb-1 h-full'>
                    <div className='grow flex flex-col gap-4'>
                        {matchCells}
                    </div>
                </div>
            </div>
        </div>
    )
}