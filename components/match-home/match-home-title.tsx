import { MatchDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import { FaGear } from "react-icons/fa6";

export default function MatchHomeTitle({ matchData }: { matchData: MatchDataType }) {

    const datetime = new Date(matchData.created_at)
    return (
        <div className='flex gap-2 flex-wrap -mt-2'>
            <p className='text-gray-500 font-bold'>Created at {datetime.toLocaleDateString('en-GB')}</p>
            <p> / </p>
            <div className='flex gap-2 items-center text-md font-bold'>
                <FaGear />
                <p>{matchData.team_config === 'one' ? '1v1' : '2v2'} |</p>
                <p>{matchData.length[0].toUpperCase() + matchData.length.slice(1)} |</p>
                <p>{matchData.num_of_rounds} Round</p>
            </div>
        </div>
    )
}