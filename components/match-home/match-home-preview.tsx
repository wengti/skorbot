import { MatchDataType, PlayersDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import PreviewSection from "../add-match-form/preview-section";
import arrangeMatchups from "@/lib/match-algo";
import { redirect } from "next/navigation";

export default function MatchHomePreview({ matchData, playersData }: { matchData: MatchDataType, playersData: PlayersDataType[] }) {

    try {
        const { id, team_config, num_of_rounds, length, maxLength, note, players } = matchData
        const preview = arrangeMatchups(players, team_config, length, num_of_rounds, maxLength, false)

        if (!preview || !(preview?.flatFullResult) || !(preview?.profile) ) {
            throw new Error('Failure in generating the game profile.')
        }

        return (
            <PreviewSection preview={preview} roomParticipants={playersData.map(p => p.users)} showEstimation={false}/>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }


}