'use client'
import { ClientUserContextType } from "@/type/auth-type";
import { useState } from "react";
import SearchForm from "../search-form/search-form";
import { IoPeopleSharp } from "react-icons/io5";

type RoomHomeSearchFormType = {
    initParticipants: ClientUserContextType[]
    roomId: string
    ownerId: string
}

export default function RoomHomeSearchForm({initParticipants, roomId, ownerId}: RoomHomeSearchFormType){

    const [participants, setParticipants] = useState<ClientUserContextType[]>(initParticipants)

    return (
        <section>
            <div className='text-xl font-bold mb-1 flex gap-2 items-center'>
                <IoPeopleSharp />
                <h2>Participants</h2>
            </div>
            <SearchForm participants={participants} setParticipants={setParticipants} roomId={roomId} ownerId={ownerId}/>
        </section>
    )

}