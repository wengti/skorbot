'use client'
import { searchUsers } from "@/lib/search-utils";
import { SearchType } from "@/type/search-type";
import { ChangeEvent, Dispatch, JSX, SetStateAction, Suspense, useEffect, useRef, useState } from "react"
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Avatar } from "../tailgrids/core/avatar";
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area";
import { MdPersonAdd } from "react-icons/md";
import CustomAvatar from "../my-ui/custom-avatar";
import { MdOutlineClear } from "react-icons/md";
import { ClientUserContextType } from "@/type/auth-type";
import { createClient } from "@/lib/supabase/client";
import { useClientUserContext } from "@/context/client-user-context-provider";
import { FaCrown } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RealtimeChannel } from "@supabase/supabase-js";


type SearchFormPropsType = {
    participants: ClientUserContextType[]
    setParticipants: Dispatch<SetStateAction<ClientUserContextType[]>>
    isPending?: boolean
    isSubmitted?: boolean
    roomId?: string
    ownerId?: string
}

export default function SearchForm({ participants, setParticipants, isPending = false, isSubmitted = false, roomId = '', ownerId = '' }: SearchFormPropsType) {

    /* State - Maintain internal state */
    const [searchVal, setSearchVal] = useState<string>('')
    const [searchRes, setSearchRes] = useState<SearchType>({ res: null, error: null })
    const [databaseUserError, setDatabaseUserError] = useState<Error | null>(null)

    /* Context - get the current user information */
    const currentUser = useClientUserContext()
    const isRoomExisting = roomId && ownerId

    /* Router */
    const router = useRouter()

    /* Ref */
    const channel = useRef<RealtimeChannel | null>(null)

    /* Effect - resetting the search form for new participants after the room have been created*/
    useEffect(() => {
        if (isSubmitted) {
            setSearchVal('')
            setSearchRes({ res: null, error: null })
        }
    }, [isSubmitted])

    /* Subscribe to if there's any room participant changes */
    useEffect(() => {

        if (channel.current) {
            channel.current.unsubscribe()
            channel.current = null
        }

        async function subscribeToRPchanges() {
            const supabase = createClient()
            await supabase.realtime.setAuth() // Needed for Realtime Authorization
            channel.current = supabase
                .channel(`topic-rp:${roomId}`, { config: { private: true } })
                .on('broadcast', { event: '*' }, () => handleRPChangesinDB())
                .subscribe()
        }

        subscribeToRPchanges()


    }, [])


    /* Function */
    /* Handle new user in db */
    async function handleRPChangesinDB() {
        console.log('Trig')
        const supabase = createClient()
        const { data: RPData, error: RPError } = await supabase
            .from('room_participants')
            .select(`
                participant,
                users(
                 id, name, email, picture)
                `
            )
            .eq('room', roomId)
        if (RPError) {
            setDatabaseUserError(Error(RPError.message))
            return
        }
        else if (RPData === null) {
            setDatabaseUserError(Error('Unable to update the participant list according to the latest update in the database.'))
            return
        }

        const newParticipants = RPData.map((data) => data.users) as unknown as ClientUserContextType[]
        setParticipants(newParticipants)

    }


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
    async function handleAddParticipants(entry: ClientUserContextType) {

        try {
            if (!isPending) {

                /* This code block is only run for when adding new user to an existing room */
                /* This action is protected on Supabase with a constraint to prevent repeated row that has same room and user */
                /* So it can avoid duplication */
                if (isRoomExisting) {
                    const supabase = createClient()
                    const { error } = await supabase
                        .from('room_participants')
                        .insert({ room: roomId, participant: entry.id, is_owner: false })
                    if (error) throw new Error(error.message)
                    router.refresh()

                }

                /* This code block is run for when creating new room AND when adding new user to an existing room */
                /* This is for self maintained state, without having to keep query from database to get the latest participant list */
                const alreadyExists = participants.some(p => p.id === entry.id) // check whether this entry is already part of the participant list to prevent duplication
                const newParticipants = alreadyExists ? participants : [...participants, entry]
                setParticipants(newParticipants)
                const result = await searchUsers(searchVal, newParticipants)
                setSearchRes(result)
                setDatabaseUserError(null)


            }
        }
        catch (error) {
            if (error instanceof Error) setDatabaseUserError(error)
            else setDatabaseUserError(new Error('Unknown Error in adding new participant to the room'))
        }
    }




    /* Triggered when a participant is removed */
    async function handleRemoveParticipant(entry: ClientUserContextType) {
        try {
            if (!isPending) {



                /* Remove room participants from the database if Room Existed already */
                if (isRoomExisting) {

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
                    router.refresh()
                }

                /* This code block is run for when creating new room and when removing user from an existing room */
                /* This is for self maintained state, without having to keep query from database to get the latest participant list */
                const newParticipants = participants.filter(p => p.id !== entry.id)
                setParticipants(newParticipants)


                /* Only update search result if there's no search value */
                if (searchVal !== '') {
                    const result = await searchUsers(searchVal, newParticipants)
                    setSearchRes(result)
                }
                setDatabaseUserError(null)
            }
        }
        catch (error) {
            if (error instanceof Error) setDatabaseUserError(error)
            else setDatabaseUserError(new Error('Unknown Error in removing participant from the room'))
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
    let participantsList: JSX.Element[] = []


    /* Different appearance of existing list depending on whether its used before or after the room exists */
    if (isRoomExisting) {
        participantsList = participants.slice(0, 10).map((participant, idx) => {
            const { id, picture, name } = participant

            return (
                <div className="flex relative items-center hover:cursor-pointer" key={id}>
                    {/* If the user is the owner of this room, he can remove anyone but the first user which is admin */}
                    {
                        currentUser.id === ownerId && participant.id !== ownerId &&
                        <MdOutlineClear className="text-lg" onClick={() => { handleRemoveParticipant(participant) }} />
                    }
                    {/* If the user is the owner of this room, he has a crown next to his name */}
                    {
                        (id === ownerId) && <FaCrown className='text-md mr-1' />
                    }
                    <CustomAvatar id={id} picture={picture} name={name === currentUser.name ? 'You' : name} />

                </div>
            )
        })
    }
    else {
        participantsList = participants.map((participant, idx) => {
            const { id, picture, name } = participant
            return (
                <div className="flex relative items-center hover:cursor-pointer" key={id}>
                    {/* Anyone beside the first person in the list, which is admin can be removed when creating the room */}
                    {
                        idx !== 0 &&
                        <MdOutlineClear className="text-lg" onClick={() => { handleRemoveParticipant(participant) }} />
                    }
                    <CustomAvatar id={id} picture={picture} name={name === currentUser.name ? 'You' : name} />
                </div>
            )
        })
    }


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
            {
                databaseUserError instanceof Error &&
                <p className='text-red-500'>Error: {databaseUserError.message}</p>
            }

            {/* Search Bar - Can only be seen if the room does not exist (creating room) or the room exists and the user is the owner of the room*/}
            {
                ((!isRoomExisting) || (isRoomExisting && ownerId === currentUser.id)) &&
                <div className='relative flex justify-center items-center py-1 px-2 rounded-md bg-(--color-pale) dark:bg-(--color-dark-pale) dark:text-(--color-dark-text) w-full gap-2'>
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
            }


            {/* Search Result Display - Can only be seen if the room does not exist (creating room) or the room exists and the user is the owner of the room*/}
            {
                ((!isRoomExisting) || (isRoomExisting && ownerId === currentUser.id)) &&
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
            {
                (isRoomExisting) ?
                    <div className='mt-3 pt-6 pb-2 px-6 relative border rounded-lg'>
                        <div className="flex gap-2 flex-wrap ">
                            {participantsList}
                        </div>
                        <Link href={`/user/rooms/${roomId}/all-participants`}><p className='underline text-center'>See More</p></Link>
                    </div> :
                    <div className="my-2 flex gap-2 flex-wrap">
                        {participantsList}
                    </div>
            }



        </div>
    )
}