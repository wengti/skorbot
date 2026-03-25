import { FaCrown } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { Skeleton } from "../tailgrids/core/skeleton";

export default function LoadingParticipantsSection({ isParticipants }: { isParticipants: boolean }) {

    const numItems = isParticipants ? 3 : 1
    const participantsList = []
    for (let i = 0; i < numItems; i++) {
        participantsList.push(
            <div className="flex w-full max-w-sm items-center gap-3" key={i}>
                <Skeleton className="size-12 rounded-full bg-(--color-pale) dark:bg-(--color-dark-pale)" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24 bg-(--color-pale) dark:bg-(--color-dark-pale)" />
                    <Skeleton className="h-3 w-32 bg-(--color-pale) dark:bg-(--color-dark-pale)" />
                </div>
            </div>
        )
    }

    return (
        <div className='mb-4'>
            <div className='text-xl font-bold mb-1 flex gap-2 items-center'>
                {isParticipants ? <IoPeopleSharp /> : <FaCrown />}
                <h2>{isParticipants ? 'Participants' : 'Owners'}</h2>
            </div>
            <div className='grid grid-cols-[repeat(auto-fill,250px)] w-full gap-4 justify-center'>
                {participantsList}
            </div>
        </div>
    )
}