'use client'
import { searchUsers } from "@/lib/search-utils";
import { SearchType } from "@/type/search-type";
import { ChangeEvent, Dispatch, SetStateAction, Suspense, useEffect, useState } from "react"
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Avatar } from "../tailgrids/core/avatar";
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area";
import { MdPersonAdd } from "react-icons/md";
import CustomAvatar from "../my-ui/custom-avatar";
import { MdOutlineClear } from "react-icons/md";
import { ClientUserContextType } from "@/type/auth-type";


type SearchFormPropsType = {
    participants: ClientUserContextType[]
    setParticipants: Dispatch<SetStateAction<ClientUserContextType[]>>
    isPending: boolean
    isSubmitted: boolean
}

export default function SearchForm({ participants, setParticipants, isPending, isSubmitted=false }: SearchFormPropsType) {

    const [searchVal, setSearchVal] = useState<string>('')
    const [searchRes, setSearchRes] = useState<SearchType>({ res: null, error: null })

    /* Effect */
    useEffect( () => {
        if(isSubmitted){
            setSearchVal('')
            setSearchRes({ res: null, error: null })
        }
    }, [isSubmitted])


    /* Function */
    /* Triggered when a search input is changed */
    function handleSearchChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>) {

        if (!isPending) {
            const newSearchVal = event.target.value
            setSearchVal(newSearchVal)
            searchUsers(newSearchVal, participants)
                .then(result => {
                    setSearchRes(result)
                })
        }

    }

    /* Triggered when the search input is cleared */
    function handleSearchClear() {

        if (!isPending) {
            setSearchVal('')
            searchUsers('', participants)
                .then(result => {
                    setSearchRes(result)
                })
        }


    }

    /* Triggered when a new participant is added */
    function handleAddParticipants(entry: ClientUserContextType) {

        if (!isPending) {
            const alreadyExists = participants.some(p => p.id === entry.id)
            const newParticipants = alreadyExists ? participants : [...participants, entry]
            setParticipants(newParticipants)

            searchUsers(searchVal, newParticipants)
                .then(result => {
                    setSearchRes(result)
                })
        }


    }

    /* Triggered when a participant is removed */
    function handleRemoveParticipant(entry: ClientUserContextType) {

        if (!isPending) {
            const newParticipants = participants.filter(p => p.id !== entry.id)

            setParticipants(newParticipants)
            /* Only update search result if there's no search value */
            if (searchVal !== '') {
                searchUsers(searchVal, newParticipants)
                    .then(result => {
                        setSearchRes(result)
                    })
            }
        }

    }

    /* Components */
    /* The search result overlay */
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
                        className='text-2xl hover:cursor-pointer'
                        onClick={() => { handleAddParticipants(entry) }}
                    />

                </div>
            )
        })
    }

    /* The added participants */
    const participantsList = participants.map((participant, idx) => {
        const { id, picture, name } = participant
        return (
            <div className="flex relative items-center hover:cursor-pointer" key={id}>
                {
                    idx !== 0 &&
                    <MdOutlineClear className="text-lg" onClick={() => { handleRemoveParticipant(participant) }} />
                }
                <CustomAvatar id={id} picture={picture} name={idx === 0 ? 'You' : name} />
            </div>
        )
    })

    /* The full returned search form */
    return (
        <div className='w-full relative'>
            {/* Error Message*/}
            {
                searchRes.error instanceof Error ?
                    <p className='text-red-500'>Error: {searchRes.error.message}</p> :
                    searchRes.error !== null &&
                    <p className='text-red-500'>Error: {searchRes.error}</p>
            }

            {/* Search Bar*/}
            <div className='flex justify-center items-center py-1 px-2 rounded-md bg-(--color-pale) dark:bg-(--color-dark-pale) dark:text-(--color-dark-text) w-full gap-2'>
                <input
                    type='text'
                    id='searchVal'
                    name='searchVal'
                    className='py-1 px-2 rounded-md bg-(--color-pale) dark:bg-(--color-dark-pale) dark:text-(--color-dark-text) w-full'
                    placeholder='i.e. John Doe'
                    value={searchVal}
                    onChange={(event) => { handleSearchChange(event) }}
                    disabled={isPending}
                />
                <MdOutlineClear
                    className='absolute right-10 cursor-pointer'
                    onClick={() => { handleSearchClear() }}
                />
                <FaMagnifyingGlass />
            </div>

            {/* Search Result Display*/}
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

            {/* Added Participants */}
            <div className="my-2 flex gap-2 flex-wrap">
                {participantsList}
            </div>


        </div>
    )
}