import LoadingParticipantsSection from "@/components/all-participants/loading-participants-section"
import ParticipantsSection from "@/components/all-participants/participants-section"
import { createClient } from "@/lib/supabase/server"
import { ClientUserContextType } from "@/type/auth-type"
import { redirect } from "next/navigation"
import { Suspense } from "react"

type participantsDataType = {
    participant: string,
    is_owner: boolean,
    users: ClientUserContextType
}

export default async function AllParticipantsPage({ params }: { params: Promise<{ roomId: string }> }) {

    try {

        const { roomId } = await params

        const supabase = await createClient()
        const { data, error } = await supabase
            .from('room_participants')
            .select(
                `
                    participant, is_owner,
                    users(
                        id, email, name, picture
                    )
                `
            )
            .eq('room', roomId)
        let participantsData = data as participantsDataType[] | null
        if (error) throw new Error(error.message)
        else if (participantsData === null) participantsData = []

        const owners = participantsData.filter(p => p.is_owner).map(p => p.users)
        const participants = participantsData.filter(p => !p.is_owner).map(p => p.users)

        return (
            <section className='flex flex-col gap-4'>
                <Suspense fallback={<LoadingParticipantsSection isParticipants={false} />}>
                    <ParticipantsSection isParticipants={false} initParticipants={owners} roomId={roomId} owners={owners} />
                </Suspense>
                <Suspense fallback={<LoadingParticipantsSection isParticipants={true} />}>
                    <ParticipantsSection isParticipants={true} initParticipants={participants} roomId={roomId} owners={owners} />
                </Suspense>
            </section>
        )


    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }


}