'use client'
import UserLoading from "@/app/user/loading";
import { createClient } from "@/lib/supabase/client";
import { ClientUserContextType } from "@/type/auth-type";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

const ClientUserContext = createContext<ClientUserContextType>(undefined!)

export function useClientUserContext() {
    return useContext(ClientUserContext)
}

export default function ClientUserContextProvdier({ children }: { children: ReactNode }) {

    const [userData, setUserData] = useState<ClientUserContextType>(undefined!)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    useEffect(() => {
        async function getClientUserData() {
            try {

                const supabase = createClient()
                const { data, error } = await supabase.auth.getClaims()
                if (error) throw error
                else {
                    if (data === null) {
                        setUserData({ id: '', name: '', email: '', picture: '' })
                    }

                    else {
                        const currentUserId = data.claims.sub
                        const { data: fetchedData, error: fetchedError } = await supabase
                            .from('users')
                            .select<'*', ClientUserContextType>()
                            .eq('id', currentUserId)
                        if (error) throw error
                        else if (fetchedData === null) {
                            setUserData({ id: '', name: '', email: '', picture: '' })
                        }
                        else {
                            setError(null)
                            setUserData(fetchedData[0])
                        }
                    }
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                    setTimeout(() => { router.push(`/auth/error?error=${error.message}`) }, 0)
                }
                else {
                    setError('Unknown error')
                    router.push(`/auth/error`)
                    setTimeout(() => { router.push(`/auth/error`) }, 0)
                }
            }
        }


        getClientUserData()
        const supabase = createClient()
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                getClientUserData()
            }
        })

        // Unsubscribe on unmount
        return () => {
            subscription.unsubscribe()
        }

    }, [])

    return (
        userData === undefined ?
            <UserLoading /> :
            <ClientUserContext value={userData}>
                {children}
            </ClientUserContext>
    )
}