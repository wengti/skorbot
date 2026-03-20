import { MatchDataType, PlayersDataType, ResultDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import { ClientUserContextType } from "@/type/auth-type";
import MatchHomeLeaderboardUserComponent from "./match-home-leaderboard-user-component";
import { redirect } from "next/navigation";

export type PlayersRecordType = {
    user: ClientUserContextType
    wins: number
    losses: number
    scoreDiff: number
}

export default function MatchHomeLeaderboardServerComponent({ playersData, resultData }: { playersData: PlayersDataType[], resultData: ResultDataType[] }) {

    try {
        const playersRecord = playersData.map(data => {
            return ({
                user: data.users,
                wins: 0,
                losses: 0,
                scoreDiff: 0,
            })
        })

        for (const { player_a1, player_a2, player_b1, player_b2, score_a, score_b } of resultData) {

            const playerA1Record = playersRecord.find(p => p.user.id === player_a1)
            const playerA2Record = player_a2 ? playersRecord.find(p => p.user.id === player_a2) : null
            const playerB1Record = playersRecord.find(p => p.user.id === player_b1)
            const playerB2Record = player_b2 ? playersRecord.find(p => p.user.id === player_b2) : null

            // if ((player_a2 && !playerA2Record) || (player_b2 && !playerB2Record)) throw new Error('Unable to identify a player in this match.')
            // if (!playerA1Record || !playerB1Record) throw new Error('Unable to identify a player in this match.')


            if (score_a > score_b) {
                const diff = score_a - score_b

                if (playerA1Record) {
                    playerA1Record.wins += 1
                    playerA1Record.scoreDiff += diff
                }

                if (playerA2Record) {
                    playerA2Record.wins += 1
                    playerA2Record.scoreDiff += diff
                }

                if(playerB1Record) {
                    playerB1Record.losses += 1
                    playerB1Record.scoreDiff -= diff
                }

                if (playerB2Record) {
                    playerB2Record.losses += 1
                    playerB2Record.scoreDiff -= diff
                }
            }
            else if (score_a < score_b) {
                const diff = score_b - score_a

                if(playerB1Record){
                    playerB1Record.wins += 1
                    playerB1Record.scoreDiff += diff
                }

                if (playerB2Record) {
                    playerB2Record.wins += 1
                    playerB2Record.scoreDiff += diff
                }

                if (playerA1Record){
                    playerA1Record.losses += 1
                    playerA1Record.scoreDiff -= diff
                }
                
                if (playerA2Record) {
                    playerA2Record.losses += 1
                    playerA2Record.scoreDiff -= diff
                }

            }
        }

        playersRecord.sort((a, b) => {
            if (a.wins !== b.wins) return b.wins - a.wins
            else if (a.scoreDiff !== b.scoreDiff) return b.scoreDiff - a.scoreDiff
            else return (b.wins / (b.losses + b.wins)) - (a.wins / (a.losses + a.wins))
        })

        return <MatchHomeLeaderboardUserComponent playersRecord={playersRecord} />
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }

}