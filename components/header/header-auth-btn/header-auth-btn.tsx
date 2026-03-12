'use client'
import Button from "../../my-ui/button";
import { getUserData } from "@/lib/auth-utils";
import HeaderLoginBtn from "./header-login-btn";
import { useEffect, useState } from "react";
import HeaderLogoutBtn from "./header-logout-btn";
import LoadingHeaderAuthBtn from "./loading-header-auth-btn";
import { createClient } from "@/lib/supabase/client";


export default function HeaderAuthBtn() {

    /* Mounted for the first time - state in undefined to show loading state*/
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(undefined!)

    /* Effect to check if there's a current signed-in user */
    useEffect(() => {
        async function checkIsLoggedIn() {
            const { data, error } = await getUserData()
            if (data?.claims.sub) setIsLoggedIn(true)
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
        isLoggedIn === undefined ?
            <LoadingHeaderAuthBtn /> :
            isLoggedIn ?
                <HeaderLogoutBtn /> :
                <HeaderLoginBtn /> 

    )

}