'use client'
import { ClientUserContextType } from "@/type/auth-type";
import { Avatar } from "../tailgrids/core/avatar";
import { FaCrown } from "react-icons/fa6";
import { useClientUserContext } from "@/context/client-user-context-provider";
import { IoPeopleSharp } from "react-icons/io5";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { MdOutlineClear } from "react-icons/md";
import SearchForm from "../search-form/search-form";

export default function ParticipantsSection({ isParticipants, initParticipants, roomId, owners }: { isParticipants: boolean, initParticipants: ClientUserContextType[], roomId: string, owners: ClientUserContextType[] }) {


    const [error, setError] = useState<Error | null>(null)
    const [participants, setParticipants] = useState<ClientUserContextType[]>(initParticipants)

    const currentUser = useClientUserContext()
    const isCurrentUserOwner = owners.map(owner => owner.id).includes(currentUser.id)



    /* Triggered when a participant is removed */
    async function handleRemoveParticipant(entry: ClientUserContextType) {
        try {
            console.log('triggered')
            /* Disallow move for making a room to have less than 3 participants */
            if (participants.length <= 3) {
                throw new Error('Cannot have less than 3 participants in a room')
            }

            const supabase = createClient()
            const response = await supabase
                .from('room_participants')
                .delete()
                .eq('room', roomId)
                .eq('participant', entry.id)
                .eq('is_owner', false)
            
            setParticipants((prevParticipant) => prevParticipant.filter(p => p.id !== entry.id))
            setError(null)
        }
        catch (error) {
            if (error instanceof Error) setError(error)
            else setError(new Error('Unknown Error in removing participant from the room'))
        }
    }

    const participantsList = participants.map(participant => {
        const participantName = participant.id === currentUser.id ? 'You' : participant.name
        return (
            <div className="flex relative" key={participant.id}>
                {
                    isCurrentUserOwner && isParticipants && 
                    <MdOutlineClear 
                        className="text-lg absolute right-4 top-2 hover:cursor-pointer" 
                        onClick={() => { handleRemoveParticipant(participant) }} />
                }
                <Avatar
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
            </div>
        )
    })

    return (
        <div className='mb-4'>
            <div className='text-xl font-bold mb-1 flex gap-2 items-center'>
                {isParticipants ? <IoPeopleSharp /> : <FaCrown />}
                <h2>{isParticipants ? 'Participants' : 'Owners'}</h2>
            </div>
            {   
                error &&
                <p className='text-red-500'>{error.message}</p>
            }
            {
                isParticipants &&
                <SearchForm participants={participants} setParticipants={setParticipants} roomId={roomId} ownerId={owners[0].id}/>
            }
            <div className='grid grid-cols-[repeat(auto-fill,250px)] w-full gap-4 justify-center'>
                {participantsList}
            </div>
        </div>
    )
}