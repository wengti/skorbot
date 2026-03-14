'use client'
import FormEntry from "@/components/my-ui/form-entry";
import SearchForm from "@/components/search-form/search-form";
import { SearchResType } from "@/type/search-type";
import { useState } from "react";

export default function AddRoom() {

    const [roomName, setRoomName] = useState('')
    const [participants, setParticipants] = useState<SearchResType[]>([])

    return (
        <section>
            <h1 className="text-2xl font-extrabold text-(--color-highlight)">Add A New Room</h1>
            <form className='py-2'>
                <FormEntry index={1}>
                    <div className='flex flex-col justify-center z-2'>
                        <label
                            htmlFor="roomName"
                            className='mb-2 font-bold text-xl'
                        >
                            Room Name
                        </label>
                        <input
                            type='text'
                            id='roomName'
                            name='roomName'
                            className='py-1 px-2 rounded-md bg-(--color-pale) dark:bg-(--color-dark-pale) dark:text-(--color-dark-text)'
                            placeholder='i.e. Room with Jackson'
                            value = {roomName}
                            onChange={(event) => {setRoomName(event.target.value)}}
                        />
                    </div>
                </FormEntry>

                <FormEntry index={2}>
                    <p className='mb-2 font-bold text-xl'>
                        Room Participants
                    </p>
                    <SearchForm participants={participants} setParticipants={setParticipants}/>
                </FormEntry>


            </form>
        </section>
    )
}