import { MdLeaderboard } from "react-icons/md";
import MatchHomeLeaderboardComponent from "./match-home-leaderboard-component";



export default function MatchHomeLeaderboard() {
    




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


