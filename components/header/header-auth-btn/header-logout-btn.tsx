'use client'

import { createClient } from "@/lib/supabase/client"
import Button from "../../my-ui/button"
import { useRouter } from "next/navigation"

export default function HeaderLogoutBtn() {

    const router = useRouter()

    async function handleLogout() {
        const supabase = createClient()
        const { error } = await supabase.auth.signOut()

        // window.location.href = '/auth/login'
        router.push('/auth/login')
        
    }

    return (
        <button
            onClick={() => { handleLogout() }}
        >
            <Button size='sm'>
                Logout
            </Button>
        </button>

    )
}