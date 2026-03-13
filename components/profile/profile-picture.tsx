'use client'
import { createClient } from "@/lib/supabase/client"
import { GetUserDataPropsType } from "@/type/auth-type"
import Image from "next/image"
import { useEffect, useState } from "react"
import Menu from "../menu/menu"

export default function ProfilePicture({ userData }: { userData: GetUserDataPropsType }) {

    /* State */
    const [profilePicture, setProfilePicture] = useState<string>(undefined!)
    const [userName, setUserName] = useState<string>(undefined!)
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    /* Function */
    function handleExpandMenu(){
        setIsMenuOpen( (prevIsMenuOpen) => !prevIsMenuOpen)
    }

    /* Effect */
    useEffect(() => {
        async function getUserProfile() {
            const defaultPictureSrc = '/images/profile_orange.png'
            if (userData.data !== null) {

                const supabase = createClient()
                const { data, error } = await supabase
                    .from('users')
                    .select(`picture, name`)
                    .eq('id', userData.data.claims.sub)

                if (error || data.length === 0) {
                    setUserName('User')
                    setProfilePicture(defaultPictureSrc)
                }
                else {
                    setUserName(data[0].name)
                    setProfilePicture(data[0].picture)
                }

            }
            else {
                setUserName('User')
                setProfilePicture(defaultPictureSrc)
            }
        }
        getUserProfile()

    }, [userData])


    /* Decide returned displayed element */
    let displayedElement
    if (profilePicture === undefined || userName === undefined) {
        displayedElement = (
            <div className='flex gap-2 justify-center items-center'>
                <div className='w-8 h-8 rounded-full animate-pulse bg-(--color-pale) dark:bg-(--color-dark-pale)'>
                    <p className="whitespace-pre">   </p>
                </div>
                <p className='hidden whitespace-pre animate-pulse bg-(--color-pale) dark:bg-(--color-dark-pale) md:block md:rounded-lg md:w-20'>  </p>
            </div>
        )
    }
    else {
        displayedElement = (
            <div 
                className='flex gap-2 justify-center items-center cursor-pointer relative'
            >
                <div className='w-8 h-8 rounded-full flex justify-center items-center border dark:border-white'>
                    <Image
                        height={32}
                        width={32}
                        src={profilePicture}
                        alt="Clickable user's profile picture to expand into a menu."
                        referrerPolicy="no-referrer"
                        className="rounded-full"
                        onError={(e) => e.currentTarget.src = '/images/profile_orange.png'}
                        onClick={() => {handleExpandMenu()}}
                    />
                </div>
                <p className='hidden md:block font-bold' onClick={() => {handleExpandMenu()}}>{userName}</p>
                { isMenuOpen && <Menu />}
            </div>
        )
    }

    return displayedElement
}