'use client'
import RoomPictursUploadZone from "@/components/image-dropzone/room-pictures-upload-zone";
import Button from "@/components/my-ui/button";
import FormEntry from "@/components/my-ui/form-entry";
import SearchForm from "@/components/search-form/search-form";
import { useClientUserContext } from "@/context/client-user-context-provider";
import { createANewRoom } from "@/lib/room-form-utils";
import { getARoomProfilePicture } from "@/lib/room-picture";
import { ClientUserContextType } from "@/type/auth-type";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { AiFillPicture } from "react-icons/ai";
import Form from 'next/form'

export default function AddRoom() {

    /* User Context */
    const userContext = useClientUserContext()

    /* State */
    const [roomName, setRoomName] = useState('')
    const [participants, setParticipants] = useState<ClientUserContextType[]>([userContext])
    const [roomPicture, setRoomPicture] = useState<string>(() => getARoomProfilePicture())
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    /* Pathname - for remounting the photo upload zone */
    const pathname = usePathname()

    /* Router - for redirection upon successful form submission */
    const router = useRouter()

    /* Action state - for uploading room */
    const [error, formAction, isPending] = useActionState(async () => {
        const returnedState = await createANewRoom(roomName, participants, roomPicture)
        if (returnedState === null) setIsSubmitted(true)
        else setIsSubmitted(false)
        return returnedState
    }, 
    null)

    /* Effect - resetting state */
    useEffect(() => {
        if (isSubmitted) {
            setRoomName('')
            setParticipants([userContext])
            setRoomPicture( () => getARoomProfilePicture())
            setIsSubmitted(false)
            router.push('/user/rooms')
        }
    }, [isSubmitted])


    /* Returned component */
    return (
        <section>
            {/* Title of the page */}
            <h1 className="text-2xl font-extrabold text-(--color-highlight)">Add A New Room</h1>

            {/* Left Right Split */}
            <div className='flex gap-2 justify-center'>

                {/* Left Side - Form */}
                <Form className='py-2 px-2 max-w-200 grow' action={formAction}>

                    {/* Form Entry - Room Name */}
                    <FormEntry index={1}>
                        <div className='flex flex-col justify-center z-2'>
                            <label
                                htmlFor="roomName"
                                className='mb-2 font-bold text-xl flex gap-2 items-center'
                            >
                                <FaPencilAlt />
                                <p>Room Name</p>
                            </label>
                            <input
                                type='text'
                                id='roomName'
                                name='roomName'
                                className='py-1 px-2 rounded-md bg-(--color-pale) dark:bg-(--color-dark-pale) dark:text-(--color-dark-text)'
                                placeholder='i.e. Room with Jackson'
                                value={roomName}
                                onChange={(event) => { setRoomName(event.target.value) }}
                                disabled={isPending}
                            />
                        </div>
                    </FormEntry>


                    {/* Form Entry - Room Participants */}
                    <FormEntry index={2}>
                        <div className='mb-2 font-bold text-xl flex gap-2 items-center'>
                            <IoPeopleSharp />
                            <p>Room Participants</p>
                        </div>
                        <SearchForm participants={participants} setParticipants={setParticipants} isPending={isPending} isSubmitted={isSubmitted}/>
                    </FormEntry>

                    {/* Form Entry - Room Picture */}
                    <FormEntry index={3}>
                        <div className='font-bold text-xl flex gap-2 items-center'>
                            <AiFillPicture />
                            <p>Room Picture</p>
                        </div>
                        <RoomPictursUploadZone
                            key={pathname} 
                            ownerId={userContext.id} 
                            setRoomPicture={setRoomPicture} 
                            isPending={isPending} 
                        />
                    </FormEntry>

                    {/* Error Message & Submit Button */}
                    <div className="my-8">
                        {
                            error &&
                            <p className='text-red-500 mx-auto w-2/3 block'>Error: {error.message} </p>
                        }
                        <Button size='sm' className='mx-auto w-2/3 text-center'>
                            <button type='submit' disabled={isPending}>
                                {isPending ? 'Creating...' : 'Create a new group'}
                            </button>
                        </Button>
                    </div>
                </Form>

                {/* Right Side - Skorbot */}
                <div className='justify-center items-center hidden md:flex min-w-80'>
                    <Image
                        src='/images/mascot.gif'
                        alt='Skorbot looking to see if you need any help with creating a new room.'
                        width={400}
                        height={500}
                        unoptimized
                        className='hidden md:block w-80'
                    />
                </div>

            </div>
        </section>
    )
}