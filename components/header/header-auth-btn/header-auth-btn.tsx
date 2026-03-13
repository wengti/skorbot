'use client'
import { getUserData } from "@/lib/auth-utils";
import HeaderLoginBtn from "./header-login-btn";
import { useEffect, useState } from "react";
import LoadingHeaderAuthBtn from "./loading-header-auth-btn";
import { createClient } from "@/lib/supabase/client";
import {Xmark2x } from "@tailgrids/icons";
import Alert from "@/components/tailgrids/core/alert";
import ProfilePicture from "@/components/profile/profile-picture";
import { GetUserDataPropsType } from "@/type/auth-type";



export default function HeaderAuthBtn() {

    /* Mounted for the first time - state in undefined to show loading state*/
    const [userData, setUserData] = useState<GetUserDataPropsType>({ data: null, error: null })
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(undefined!)
    const [error, setError] = useState<string>(null!)

    /* Effect to setup to listen to signIn / signout event */
    /* Subsequently, check the user's ID with checkIsLoggedIn */
    useEffect(() => {
        async function checkIsLoggedIn() {
            const foundUserData = await getUserData()
            setUserData(foundUserData)
            const { data, error: userError } = foundUserData
            if (userError && userError instanceof Error) {
                setIsLoggedIn(false)
                setError(userError.message)
            }
            else if (userError) {
                setIsLoggedIn(false)
                setError(userError)
            }
            else if (data?.claims.sub) {
                setIsLoggedIn(true)
                setError(null!)
            }
            else if (data === null) {
                setIsLoggedIn(false)
                setError(null!)
            }
        }

        /* Check when the component is mounted for the first time */
        checkIsLoggedIn() 

        /* Set up to check every time there's a change of auth event - sign in or out */
        const supabase = createClient()
        supabase.auth.onAuthStateChange((event, _session) => {
            if (event === 'SIGNED_IN') checkIsLoggedIn()
            else if (event === 'SIGNED_OUT') checkIsLoggedIn()
        })
    }, [])

    return (
        <>
            {
                error &&
                <div className='bg-red-50 rounded-xl border-[#facbca] border-2 fixed top-5 left-0 opacity-90 z-3 sm:ml-4'>
                    <Alert
                        variant="danger"
                        title="Error"
                        message={`There was a problem with the authentication. \n ${error}`}
                        icon={<Xmark2x />}
                        onClose={() => { setError(null!) }}
                    />
                </div>
            }
            {
                isLoggedIn === undefined ?
                    <LoadingHeaderAuthBtn /> :
                    isLoggedIn ?
                        <ProfilePicture userData={userData} /> :
                        <HeaderLoginBtn />
            }
        </>

    )

}