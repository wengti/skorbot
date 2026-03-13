'use client'
import { searchUsers } from "@/lib/search-utils";
import { SearchResType, SearchType } from "@/type/search-type";
import { ChangeEvent, Suspense, useState } from "react"
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Avatar } from "../tailgrids/core/avatar";
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area";
import { MdPersonAdd } from "react-icons/md";
import Image from "next/image";


export default function SearchForm() {

    const [searchVal, setSearchVal] = useState<string>('')
    const [searchRes, setSearchRes] = useState<SearchType>({ res: null, error: null })
    const [participants, setParticipants] = useState<SearchResType[]>([])

    function handleSearchChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>) {

        const newSearchVal = event.target.value
        setSearchVal(newSearchVal)
        searchUsers(newSearchVal, participants)
            .then(result => {
                setSearchRes(result)
            })
    }

    function handleAddParticipants(entry: SearchResType) {
        setParticipants(prevParticipants => {
            if (!prevParticipants.includes(entry)) return [...prevParticipants, entry]
            else return prevParticipants
        })
    }

    let searchResultDisplay = null
    if (searchRes.res && searchRes.res.length > 0) {
        searchResultDisplay = searchRes.res.map((entry) => {

            const { id, picture, name, email } = entry
            return (
                <div key={id} className='flex justify-between items-center pr-4'>
                    <Avatar
                        src={picture}
                        fallback={name[0]}
                        size='md'
                        label={{ title: name, subtitle: email }}
                    />
                    <MdPersonAdd
                        className='text-2xl'
                        onClick={() => { handleAddParticipants(entry) }}
                    />
                </div>
            )
        })
    }

    const participantsList = participants.map(({id, picture, name, email}) => {
        <div>
            <Image
                height={16}
                width={16}
                src={picture}
                alt={`${name}'s profile picture.`}
                referrerPolicy="no-referrer"
                className="rounded-full"
            />
        </div>
    })




    return (
        <div className='w-full relative'>
            {
                searchRes.error instanceof Error ?
                    <p className='text-red-500'>Error: {searchRes.error.message}</p> :
                    searchRes.error !== null &&
                    <p className='text-red-500'>Error: {searchRes.error}</p>
            }
            <div className='flex justify-center items-center py-1 px-2 rounded-md bg-(--color-pale) dark:bg-(--color-dark-pale) dark:text-(--color-dark-text) w-full gap-2'>
                <input
                    type='text'
                    id='searchVal'
                    name='searchVal'
                    className='py-1 px-2 rounded-md bg-(--color-pale) dark:bg-(--color-dark-pale) dark:text-(--color-dark-text) w-full'
                    placeholder='i.e. John Doe'
                    value={searchVal}
                    onChange={(event) => { handleSearchChange(event) }}
                />
                <FaMagnifyingGlass />
            </div>
            {
                searchRes.res && searchRes.res.length > 0 ?
                    <ScrollArea className="absolute top-0 h-30">
                        <ScrollAreaViewport className="flex flex-col gap-2 px-2 py-2 bg-(--color-pale) dark:bg-(--color-dark-pale) opacity-85 rounded-md">
                            {searchResultDisplay}
                        </ScrollAreaViewport>
                        <ScrollBar orientation="vertical" keepMounted={false} />
                    </ScrollArea> :
                    null
            }


        </div>
    )
}