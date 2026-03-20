import { MdLeaderboard } from "react-icons/md";
import { PlayersDataType, ResultDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import { redirect } from "next/navigation";
import MatchHomeLeaderboardServerComponent from "./match-home-leaderboard-server-component";




export default async function MatchHomeLeaderboard({ playersData, resultData }: { playersData: PlayersDataType[], resultData: ResultDataType[] }) {

    try {
        return (
            <section>
                <div className='text-xl font-bold mb-1 flex gap-2 items-center mt-4'>
                    <MdLeaderboard />
                    <h2>Leaderboard</h2>
                </div>
                <MatchHomeLeaderboardServerComponent playersData={playersData} resultData={resultData}/>
            </section>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }




}


