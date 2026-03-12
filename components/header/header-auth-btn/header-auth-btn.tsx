'use client'
import { getUserData } from "@/lib/auth-utils";
import HeaderLoginBtn from "./header-login-btn";
import { useEffect, useState } from "react";
import HeaderLogoutBtn from "./header-logout-btn";
import LoadingHeaderAuthBtn from "./loading-header-auth-btn";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle1, Xmark2x } from "@tailgrids/icons";
import Alert from "@/components/tailgrids/core/alert";



export default function HeaderAuthBtn() {

    console.log('Header Auth Btn is rendering...')
    /* Mounted for the first time - state in undefined to show loading state*/
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(undefined!)
    const [error, setError] = useState<string>(null!)

    /* Effect to check if there's a current signed-in user */
    useEffect(() => {
        async function checkIsLoggedIn() {
            const { data, error: userError } = await getUserData()
            if (userError && userError instanceof Error) {
                setIsLoggedIn(false)
                setError(userError.message)
            }
            else if (userError) {
                setIsLoggedIn(false)
                setError(userError)
            }
            else if (data?.claims.sub) setIsLoggedIn(true)
            else if (data === null) setIsLoggedIn(false)
        }
        checkIsLoggedIn()
    }, [])

    /* Effect to setup to listen to signIn / signout event */
    useEffect(() => {
        const supabase = createClient()
        supabase.auth.onAuthStateChange((event, _session) => {
            if (event === 'SIGNED_IN') setIsLoggedIn(true)
            else if (event === 'SIGNED_OUT') setIsLoggedIn(false)
        })
    }, [])

    return (
        <>
            {
                error &&
                <div className='bg-red-50 rounded-xl border-[#facbca] border-2 fixed top-5 left-0 opacity-90 z-3'>
                    <Alert
                        variant="danger"
                        title="Error"
                        message={`There was a problem with the authentication. \n ${error}`}
                        icon={<Xmark2x />}
                        onClose={()=> {setError(null!)}}
                    />
                </div>
            }
            {
                isLoggedIn === undefined ?
                    <LoadingHeaderAuthBtn /> :
                    isLoggedIn ?
                        <HeaderLogoutBtn /> :
                        <HeaderLoginBtn />
            }
        </>

    )

}