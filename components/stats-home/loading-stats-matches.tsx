import { FaLockOpen, FaRegCalendarAlt } from "react-icons/fa";
import { Skeleton } from "../tailgrids/core/skeleton";

export default function LoadingStatsMatches() {

    const matchCells = []
    for (let i = 0; i < 4; i++) {
        matchCells.push(
            <Skeleton className="h-20 w-full rounded-xl" key={i} />
        )
    }

    return (
        <div className="flex flex-col gap-2 mb-4">

            <div className='flex flex-col md:flex-row gap-2'>

                <div className='md:w-1/2 border rounded-xl p-2 flex flex-col gap-2 h-130'>
                    <div className='text-lg font-bold mb-1 flex gap-2 items-center'>
                        <FaRegCalendarAlt />
                        <h2>All Matches</h2>
                    </div>
                    <p className='text-sm text-slate-500 dark:text-gray-500 -mt-2'>All past matches.</p>
                    <div className="h-130 w-full mt-2 rounded-lg flex flex-col ">
                        <div className='grow flex flex-col gap-2'>
                            {matchCells}
                        </div>
                    </div>
                </div>

                <div className='md:w-1/2 border rounded-xl p-2 flex flex-col gap-2 h-130'>
                    <div className='text-lg font-bold mb-1 flex gap-2 items-center'>
                        <FaLockOpen />
                        <h2>Unfinalized Matches</h2>
                    </div>
                    <p className='text-sm text-slate-500 dark:text-gray-500 -mt-2'>Contact the room owner to finalize it.</p>
                    <div className="h-130 w-full mt-2 rounded-lg flex flex-col ">
                        <div className='grow flex flex-col gap-2'>
                            {matchCells}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}