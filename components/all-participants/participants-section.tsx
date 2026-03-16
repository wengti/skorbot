'use client'
import { ClientUserContextType } from "@/type/auth-type";
import { Avatar } from "../tailgrids/core/avatar";
import { FaCrown } from "react-icons/fa6";
import { useClientUserContext } from "@/context/client-user-context-provider";
import { IoPeopleSharp } from "react-icons/io5";

export default function ParticipantsSection({ isParticipants, participants }: { isParticipants:boolean, participants: ClientUserContextType[] }) {

    const currentUser = useClientUserContext()

    const participantsList = participants.map(participant => {
        const participantName = participant.id === currentUser.id ? 'You' : participant.name
        return (
            <Avatar
                key={participant.id}
                src={participant.picture}
                alt={`The profile picture of ${participantName}`}
                fallback={participant.name.slice(0, 1)}
                size='lg'
                label={{
                    title: participantName,
                    subtitle: participant.email
                }}
                className='bg-(--color-pale) dark:bg-(--color-dark-pale) pr-6 pl-4 py-2 w-62.5 rounded-full'
            />
        )
    })

    return (
        <div>
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