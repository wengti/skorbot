export default async function MatchHomePage({params}: {params: Promise<{roomId: string, matchId: string}>}){

    const {roomId, matchId} = await params

    return (
        <h1>This is the match {matchId} in room {roomId} </h1>
    )
}