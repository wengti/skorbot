'use client'

import { createClient } from "@/lib/supabase/client"
import Button from "../../my-ui/button"
import { useRouter } from "next/navigation"
import { BiDoorOpen } from "react-icons/bi";
import { useState } from "react";
import Alert from "@/components/tailgrids/core/alert";
import { Xmark2x } from "@tailgrids/icons";

export default function HeaderLogoutBtn() {

    const router = useRouter()
    const [error, setError] = useState<string>(null!)

    async function handleLogout() {
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()
        if (error) {
            setError(error.message)
        }
        else {
            window.location.href = '/auth/login' // Resort to this to trigger full cache reset to prevent un-updated state that cause data leakage across users on the same device

        }

    }

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
            <button
                onClick={() => { handleLogout() }}
                className='flex gap-2 items-center w-full'
            >
                <BiDoorOpen />
                <p>Logout</p>
            </button>
        </>
    )
}