import { MdLeaderboard } from "react-icons/md";
import MatchHomeLeaderboardComponent from "./match-home-leaderboard-component";
import { PlayersDataType, ResultDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import { ClientUserContextType } from "@/type/auth-type";
import { redirect } from "next/navigation";


type PlayersRecordType = {
    user: ClientUserContextType
    wins: number
    losses: number
    scoreDiff: number
}

export default async function MatchHomeLeaderboard({ playersData, resultData }: { playersData: PlayersDataType[], resultData: ResultDataType[] }) {

    const playersRecord = playersData.map( data => {
        return ({
            user: data.users,
            wins: 0,
            losses: 0,
            scoreDiff: 0
        })
    })

    for (const {player_a1, player_a2, player_b1, player_b2, score_a, score_b} of resultData){

        const diff = score_a - score_b
        // if(score_a > score_b)
    }

    try {
        return (
            <section>
                <div className='text-xl font-bold mb-1 flex gap-2 items-center mt-4'>
                    <MdLeaderboard />
                    <h2>Leaderboard</h2>
                </div>
                <MatchHomeLeaderboardComponent />
            </section>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }




}


