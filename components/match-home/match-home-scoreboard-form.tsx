'use client'
import { PlayersDataType, ResultDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import { AvatarGroup } from "../tailgrids/core/avatar";
import { FaLockOpen, FaLock } from "react-icons/fa";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

function shortenName(name: string): string {
    return name.length > 11 ? name.slice(0, 9) + '..' : name
}



export default function MatchHomeScoreboardForm({ resultData, playersData, idx, tableName }: { resultData: ResultDataType, playersData: PlayersDataType[], idx: number, tableName: string }) {

    const [scoreA, setScoreA] = useState<number>(resultData['score_a'])
    const [scoreB, setScoreB] = useState<number>(resultData['score_b'])
    const [isLocked, setIsLocked] = useState<boolean>(resultData['is_locked'])
    const [error, setError] = useState<Error | null>(null)

    const debounceTimerA = useRef<NodeJS.Timeout>(undefined!)
    const debounceTimerB = useRef<NodeJS.Timeout>(undefined!)
    const channel = useRef<RealtimeChannel | null>(null)

    async function handleScoreChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>, team: string, scoreState: number, setScore: Dispatch<SetStateAction<number>>) {

        if (!(/^\d+$/.test(event.target.value))) return

        const oldScore = scoreState
        const newScore = Number(event.target.value)
        setScore(newScore)

        let entry = {}
        let debounceTimer = team === 'teamA' ? debounceTimerA.current : debounceTimerB.current
        if (team === 'teamA') entry = { score_a: newScore }
        else if (team === 'teamB') entry = { score_b: newScore }

        /* Every time a user gives a keystroke (change event), first clear the previous timer */
        /* To prevent it firing off to the database */
        if (debounceTimer) clearTimeout(debounceTimer)

        /* Only if the user stop typing for at least 500ms, it fireoff to the database */
        debounceTimer = setTimeout(async () => {
            const supabase = createClient()
            const { error: changeScoreError } = await supabase
                .from(tableName)
                .update(entry)
                .eq('id', resultData.id)
            if (changeScoreError) {
                setScore(oldScore)
                setError(new Error(changeScoreError.message))
            }
            else {
                setError(null)
            }
        }, 500)
    }

    async function fetchLatestResultData() {
        const supabase = createClient()
        const { data: latestResultData, error: resultError } = await supabase
            .from(tableName)
            .select('score_a, score_b, is_locked')
        if(resultError) setError(new Error(resultError.message))
        else if (latestResultData === null) setError(new Error('Failure to fetch the latest result data'))
        else if (latestResultData.length === 0) setError(new Error('Failure to fetch the latest result data'))
        else {
            setScoreA(latestResultData[0].score_a)
            setScoreB(latestResultData[0].score_b)
            setIsLocked(latestResultData[0].is_locked)
            setError(null)
        }
    }

    useEffect(() => {
        async function subscribeToResultRow() {
            const supabase = createClient()
            await supabase.realtime.setAuth()

            channel.current = supabase
                .channel(`topic:${resultData.id}`, { config: { private: true } })
                .on('broadcast', { event: 'UPDATE' }, (payload => { fetchLatestResultData() }))
                .subscribe()
        }

        subscribeToResultRow()

        return () => {
            if (channel.current) {
                channel.current.unsubscribe()
                channel.current = null
            }
        }

    }, [])

    const playerA1 = playersData.find(p => p.player === resultData['player_a1'])?.users
    const playerA2 = resultData['player_a2'] ? playersData.find(p => p.player === resultData['player_a2'])?.users : undefined
    const playerB1 = playersData.find(p => p.player === resultData['player_b1'])?.users
    const playerB2 = resultData['player_b2'] ? playersData.find(p => p.player === resultData['player_b2'])?.users : undefined

    const teamAAvatarData = []
    let playerA1Name = ''
    let playerA2Name = ''
    if (playerA1) {
        teamAAvatarData.push({
            src: playerA1.picture,
            alt: `The profile picture of ${playerA1.name}.`
        })
        playerA1Name = shortenName(playerA1.name)

    }
    if (playerA2) {
        teamAAvatarData.push({
            src: playerA2.picture,
            alt: `The profile picture of ${playerA2.name}.`
        })
        playerA2Name = shortenName(playerA2.name)
    }


    const teamBAvatarData = []
    let playerB1Name = ''
    let playerB2Name = ''
    if (playerB1) {
        teamBAvatarData.push({
            src: playerB1.picture,
            alt: `The profile picture of ${playerB1.name}.`
        })
        playerB1Name = shortenName(playerB1.name)
    }
    if (playerB2) {
        teamBAvatarData.push({
            src: playerB2.picture,
            alt: `The profile picture of ${playerB2.name}.`
        })
        playerB2Name = shortenName(playerB2.name)
    }



    return (
        <div className='w-72.5 bg-(--color-pale) dark:bg-(--color-dark-pale) rounded-xl px-2 pt-8 pb-4 relative'>
            <div className='flex gap-1 justify-between'>
                <div className='flex flex-col w-1/3 text-sm font-bold items-center z-1'>
                    <AvatarGroup data={teamAAvatarData} size="sm" />
                    <p>{playerA1Name}</p>
                    <p>{playerA2Name}</p>
                </div>
                <div className='flex flex-col w-1/3 items-center gap-2'>
                    {isLocked ? <FaLock /> : <FaLockOpen />}
                    <div className='flex'>
                        <input
                            type='text'
                            name='scoreA'
                            id='scoreA'
                            value={scoreA}
                            onChange={(event) => { handleScoreChange(event, 'teamA', scoreA, setScoreA) }}
                            className='w-full rounded-md bg-(--color-main) dark:bg-(--color-dark-main) text-center'
                        />
                        <input
                            type='text'
                            name='scoreB'
                            id='scoreB'
                            value={scoreB}
                            onChange={(event) => { handleScoreChange(event, 'teamB', scoreB, setScoreB) }}
                            className='w-full rounded-md bg-(--color-main) dark:bg-(--color-dark-main) text-center'
                        />
                    </div>
                </div>
                <div className='flex flex-col w-1/3 text-sm font-bold items-center z-1'>
                    <AvatarGroup data={teamBAvatarData} size="sm" />
                    <p>{playerB1Name}</p>
                    <p>{playerB2Name}</p>
                </div>
                <div className='absolute text-black dark:text-white font-bold text-xl z-2 top-0'>{resultData.match_index}</div>
            </div>
            {error && <p className='text-center text-red-500 font-bold'>{error.message}</p>}
        </div>
    )

}
