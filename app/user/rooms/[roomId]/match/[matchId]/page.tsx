import { redirect } from "next/navigation"

export default async function MatchHomePage({ params }: { params: Promise<{ roomId: string, matchId: string }> }) {

    try {
        const { roomId, matchId } = await params

        return (
            <h1>This is the match {matchId} in room {roomId} </h1>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }

}