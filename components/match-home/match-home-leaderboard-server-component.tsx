import { MatchDataType, PlayersDataType, ResultDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import { ClientUserContextType } from "@/type/auth-type";
import MatchHomeLeaderboardUserComponent from "./match-home-leaderboard-user-component";
import { redirect } from "next/navigation";

export type PlayersRecordType = {
    user: ClientUserContextType
    wins: number
    losses: number
    scoreDiff: number
    teammates: {
        id: string
        wins: number
        losses: number
        scoreDiff: number
    }[]
    opponents: {
        id: string
        wins: number
        losses: number
        scoreDiff: number
    }[]
}

function updateTeammatesAndOpponentsRecord(
    result: 'win' | 'loss',
    diff: number,
    yourRecord: PlayersRecordType,
    teammateRecord: PlayersRecordType | undefined,
    opponent1Record: PlayersRecordType | undefined,
    opponent2Record: PlayersRecordType | undefined) {

    if (teammateRecord) {
        const targetId = teammateRecord.user.id
        const targetObj = yourRecord.teammates.find(p => p.id === targetId)
        if (targetObj) {
            if (result === 'win') {
                targetObj.wins += 1
                targetObj.scoreDiff += diff
            }
            else if (result === 'loss') {
                targetObj.losses += 1
                targetObj.scoreDiff -= diff
            }
        }
    }

    if (opponent1Record) {
        const targetId = opponent1Record.user.id
        const targetObj = yourRecord.opponents.find(p => p.id === targetId)
        if (targetObj) {
            if (result === 'win') {
                targetObj.wins += 1
                targetObj.scoreDiff += diff
            }
            else if (result === 'loss') {
                targetObj.losses += 1
                targetObj.scoreDiff -= diff
            }
        }
    }

    if (opponent2Record) {
        const targetId = opponent2Record.user.id
        const targetObj = yourRecord.opponents.find(p => p.id === targetId)
        if (targetObj) {
            if (targetObj) {
                if (result === 'win') {
                    targetObj.wins += 1
                    targetObj.scoreDiff += diff
                }
                else if (result === 'loss') {
                    targetObj.losses += 1
                    targetObj.scoreDiff -= diff
                }
            }
        }
    }


}

export default function MatchHomeLeaderboardServerComponent({ playersData, resultData, matchData }: { playersData: PlayersDataType[], resultData: ResultDataType[], matchData: MatchDataType | null }) {

    try {

        /* Create placeholder obejct to record all player stats */
        const playersRecord = playersData.map(curP => {
            return ({
                user: curP.users,
                wins: 0,
                losses: 0,
                scoreDiff: 0,
                teammates: playersData.filter(p => p.player !== curP.player).map(p => {
                    return {
                        id: p.player,
                        wins: 0,
                        losses: 0,
                        scoreDiff: 0
                    }
                }),
                opponents: playersData.filter(p => p.player !== curP.player).map(p => {
                    return {
                        id: p.player,
                        wins: 0,
                        losses: 0,
                        scoreDiff: 0
                    }
                })

            })
        })

        /* Loop through each result row and add the stats accordingly */
        for (const { player_a1, player_a2, player_b1, player_b2, score_a, score_b } of resultData) {

            /* Confirm the identity of each entry */
            /* If the identity cannot be found (due to being a 1v1 result or the player has been removed from the room), their stats will not be accounted for */
            const playerA1Record = playersRecord.find(p => p.user.id === player_a1)
            const playerA2Record = player_a2 ? playersRecord.find(p => p.user.id === player_a2) : undefined
            const playerB1Record = playersRecord.find(p => p.user.id === player_b1)
            const playerB2Record = player_b2 ? playersRecord.find(p => p.user.id === player_b2) : undefined

            /* If score a more score b, add wins and score diff accordingly */
            if (score_a > score_b) {
                const diff = score_a - score_b

                if (playerA1Record) {
                    playerA1Record.wins += 1
                    playerA1Record.scoreDiff += diff
                    updateTeammatesAndOpponentsRecord('win', diff, playerA1Record, playerA2Record, playerB1Record, playerB2Record)
                }

                if (playerA2Record) {
                    playerA2Record.wins += 1
                    playerA2Record.scoreDiff += diff
                    updateTeammatesAndOpponentsRecord('win', diff, playerA2Record, playerA1Record, playerB1Record, playerB2Record)

                }

                if (playerB1Record) {
                    playerB1Record.losses += 1
                    playerB1Record.scoreDiff -= diff
                    updateTeammatesAndOpponentsRecord('loss', diff, playerB1Record, playerB2Record, playerA1Record, playerA2Record)
                }

                if (playerB2Record) {
                    playerB2Record.losses += 1
                    playerB2Record.scoreDiff -= diff
                    updateTeammatesAndOpponentsRecord('loss', diff, playerB2Record, playerB1Record, playerA1Record, playerA2Record)
                }
            }
            else if (score_a < score_b) {
                const diff = score_b - score_a

                if (playerB1Record) {
                    playerB1Record.wins += 1
                    playerB1Record.scoreDiff += diff
                    updateTeammatesAndOpponentsRecord('win', diff, playerB1Record, playerB2Record, playerA1Record, playerA2Record)
                }

                if (playerB2Record) {
                    playerB2Record.wins += 1
                    playerB2Record.scoreDiff += diff
                    updateTeammatesAndOpponentsRecord('win', diff, playerB2Record, playerB1Record, playerA1Record, playerA2Record)
                }

                if (playerA1Record) {
                    playerA1Record.losses += 1
                    playerA1Record.scoreDiff -= diff
                    updateTeammatesAndOpponentsRecord('loss', diff, playerA1Record, playerA2Record, playerB1Record, playerB2Record)
                }

                if (playerA2Record) {
                    playerA2Record.losses += 1
                    playerA2Record.scoreDiff -= diff
                    updateTeammatesAndOpponentsRecord('loss', diff, playerA2Record, playerA1Record, playerB1Record, playerB2Record)
                }

            }
        }

        /* Sort the result in the following order */
        /* 1. Wins count */
        /* 2. Score Difference */
        /* 3. Win Rate */
        playersRecord.sort((a, b) => {
            if (a.wins !== b.wins) return b.wins - a.wins
            else if (a.scoreDiff !== b.scoreDiff) return b.scoreDiff - a.scoreDiff
            else return (b.wins / (b.losses + b.wins)) - (a.wins / (a.losses + a.wins))
        })

        /* Pass on the calculated result to the user side for UI */
        return <MatchHomeLeaderboardUserComponent playersRecord={playersRecord} matchData={matchData} />
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }

}