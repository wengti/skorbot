'use client'
import { MatchDataType, PlayersDataType, ResultDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import { AvatarGroup } from "../tailgrids/core/avatar";
import { FaLockOpen, FaLock } from "react-icons/fa";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useClientUserContext } from "@/context/client-user-context-provider";
import { LiaStarSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";

/* Payload - Returned data type upon receving an update from the subscribed table */
/* Used to sync all users/devices on the latest score */
type PayloadType = {
    payload: {
        record: {
            score_a: number
            score_b: number
            is_locked: boolean
        }
    }
}

/* A simple util to shorten the username */
function shortenName(name: string): string {
    return name.length > 11 ? name.slice(0, 9) + '..' : name
}

export default function MatchHomeScoreboardForm({ resultData, playersData, idx, tableName, matchData, currentPage, itemsPerPage }: { resultData: ResultDataType, playersData: PlayersDataType[], idx: number, tableName: string, matchData: MatchDataType, currentPage: number, itemsPerPage: number }) {

    /* State - scoreboard variable */
    /* --- Using the initial fetched data as the starting state --- */
    const [scoreA, setScoreA] = useState<number>(resultData['score_a'])
    const [scoreB, setScoreB] = useState<number>(resultData['score_b'])
    const [isLocked, setIsLocked] = useState<boolean>(resultData['is_locked'])

    /* State - Error variable */
    const [error, setError] = useState<Error | null>(null)

    /* Router */
    const router = useRouter()



    /* Effect subscribe to the database */
    useEffect(() => {

        async function subscribeToResultRow() {
            const supabase = createClient()
            await supabase.realtime.setAuth()

            channel.current = supabase
                .channel(`topic:${resultData.id}`, { config: { private: true } })
                .on('broadcast', { event: 'UPDATE' }, (payload) => { setLatestResultData(payload as unknown as PayloadType) })
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

    /* Ref - Debounce Timer: to prevent frequent communication with database */
    /* Only fire off the changes to the database after the user stop changing for a fixed amount of time (500ms) */
    const debounceTimerA = useRef<NodeJS.Timeout>(undefined!)
    const debounceTimerB = useRef<NodeJS.Timeout>(undefined!)
    const debounceTimerLock = useRef<NodeJS.Timeout>(undefined!)

    /* Ref - channel to subscribe to database */
    const channel = useRef<RealtimeChannel | null>(null)

    /* Function - Respond to subscribed table's changes by sync with the state */
    function setLatestResultData(payload: PayloadType) {
        setScoreA(payload.payload.record.score_a)
        setScoreB(payload.payload.record.score_b)
        setIsLocked(payload.payload.record.is_locked)
        router.refresh() /* Key to also refresh the leaderboard */
    }

    /* Function - to handle score change */
    async function handleScoreChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>, team: string, scoreState: number, setScore: Dispatch<SetStateAction<number>>) {

        /* Identify with regex whether the input contains non-number character */
        if (!(/^\d+$/.test(event.target.value))) return

        /* Record the current old score and new score */
        const oldScore = scoreState
        const newScore = Number(event.target.value)

        /* Immediately update the UI */
        setScore(newScore)

        /* The following codeblock are similar, for teamA's score and teamB's score respectively */
        if (team === 'teamA') {
            /* Every time a user gives a keystroke (change event), first clear the previous timer */
            /* To prevent it firing off to the database */
            if (debounceTimerA) clearTimeout(debounceTimerA.current)

            /* Only if the user stop typing for at least 500ms, it fireoff to the database */
            const entry = { score_a: newScore }
            debounceTimerA.current = setTimeout(async () => {
                const supabase = createClient()
                const { error: changeScoreError } = await supabase
                    .from(tableName)
                    .update(entry)
                    .eq('id', resultData.id)

                /* If there's an error - set to old score and raise an error message */
                if (changeScoreError) {
                    setScore(oldScore)
                    setError(new Error(changeScoreError.message))
                }
                else {
                    setError(null)
                }
            }, 500)
        }
        else if (team === 'teamB') {
            /* Every time a user gives a keystroke (change event), first clear the previous timer */
            /* To prevent it firing off to the database */
            if (debounceTimerB) clearTimeout(debounceTimerB.current)

            /* Only if the user stop typing for at least 500ms, it fireoff to the database */
            const entry = { score_b: newScore }
            debounceTimerB.current = setTimeout(async () => {

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



    }

    /* Function - handle the lock features */
    async function handleLock() {

        /* Not allow changing status anymore once it has been finalized */
        if(!matchData.is_pending) return

        /* Update UI by setting the state */
        setIsLocked((prevIsLocked) => !prevIsLocked)

        /* Only fire off the changes to the UI after the user stop toggling for more than 500ms */
        if (debounceTimerLock.current) clearTimeout(debounceTimerLock.current)

        debounceTimerLock.current = setTimeout(async () => {

            const supabase = createClient()
            const { error: setLockError } = await supabase
                .from(tableName)
                .update({ is_locked: !isLocked })
                .eq('id', resultData.id)
            if (setLockError) {
                setIsLocked(isLocked)
                setError(new Error(setLockError.message))
            }
            else {
                setError(null)
            }
        }, 500)
    }







    /* ---------------------------------- */
    /* Main Code - Run on every rendering */
    /* ---------------------------------- */

    /* Get the user profile for each player */
    const playerA1 = playersData.find(p => p.player === resultData['player_a1'])?.users
    const playerA2 = resultData['player_a2'] ? playersData.find(p => p.player === resultData['player_a2'])?.users : undefined
    const playerB1 = playersData.find(p => p.player === resultData['player_b1'])?.users
    const playerB2 = resultData['player_b2'] ? playersData.find(p => p.player === resultData['player_b2'])?.users : undefined

    /* Get current user's profile */
    const currentUser = useClientUserContext()

    /* Check if its owner and hide certain features from non-room-owner's user */
    /* This is only UI block, the feature block is done via RLS on supabase */
    const isRoomOwner = matchData.rooms.owner === currentUser.id
    const lockClsNameIfNotOwner = isRoomOwner ? '' : 'hidden'
    const scoreClsNameIfNotOwner = isRoomOwner ? 'disabled:bg-slate-400' : ''

    /* Check whether the current user is one of the player in this match */
    const isPlayer = [playerA1?.id, playerA2?.id, playerB1?.id, playerB2?.id].includes(currentUser.id)

    /* Get team A's avatar data and shorten the players name */
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

    /* Get team A's avatar data and shorten the players name */
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


    /* Class Name */
    /* Decide whether to show or not based on the navigate page */
    const lowerBound = (currentPage - 1) * (itemsPerPage)
    const upperBound = ((currentPage - 1) * (itemsPerPage) + itemsPerPage) - 1
    let showClsName = ''
    if (!(idx >= lowerBound && idx <= upperBound)) {
        showClsName = 'hidden'
    }

    /* ------------------ */
    /* Returned Component */
    /* ------------------ */
    return (
        /* Outer scoreboard section - to house error */
        <div className={`w-72.5 bg-(--color-pale) dark:bg-(--color-dark-pale) rounded-xl px-2 pt-8 pb-4 relative ${showClsName}`}>

            {/* Inner scoreboard section */}
            <div className='flex gap-1 justify-between'>

                {/* Team A section */}
                <div className='flex flex-col w-1/3 text-sm font-bold items-center z-1'>
                    <AvatarGroup data={teamAAvatarData} size="sm" />
                    <p>{playerA1Name}</p>
                    <p>{playerA2Name}</p>
                </div>

                {/* Score section */}
                <div className='flex flex-col w-1/3 items-center gap-2'>

                    {/* Lock action props */}
                    {
                        (isLocked || !matchData.is_pending) ?
                            <FaLock onClick={() => handleLock()} className={`${lockClsNameIfNotOwner}`} /> :
                            <FaLockOpen onClick={() => handleLock()} className={`${lockClsNameIfNotOwner}`} />
                    }

                    {/* Score division */}
                    <div className='flex grow'>

                        {/* Team A's score */}
                        <input
                            type='text'
                            name={`${resultData.id}-scoreA`}
                            id={`${resultData.id}-scoreA`}
                            value={scoreA}
                            onChange={(event) => { handleScoreChange(event, 'teamA', scoreA, setScoreA) }}
                            className={`w-full rounded-md bg-(--color-main) dark:bg-(--color-dark-main) text-center ${scoreClsNameIfNotOwner}`}
                            disabled={isLocked || !isRoomOwner || !matchData.is_pending}
                        />

                        {/* Team B's score */}
                        <input
                            type='text'
                            name={`${resultData.id}-scoreB`}
                            id={`${resultData.id}-scoreB`}
                            value={scoreB}
                            onChange={(event) => { handleScoreChange(event, 'teamB', scoreB, setScoreB) }}
                            className={`w-full rounded-md bg-(--color-main) dark:bg-(--color-dark-main) text-center ${scoreClsNameIfNotOwner}`}
                            disabled={isLocked || !isRoomOwner || !matchData.is_pending}
                        />
                    </div>
                </div>

                {/* Team B section */}
                <div className='flex flex-col w-1/3 text-sm font-bold items-center z-1'>
                    <AvatarGroup data={teamBAvatarData} size="sm" />
                    <p>{playerB1Name}</p>
                    <p>{playerB2Name}</p>
                </div>

                {/* Match Index, absolute */}
                <div className='absolute text-black dark:text-white font-bold text-xl z-2 top-0'>{resultData.match_index}</div>

                {/* isPlayerIndicator (Green star), absolute */}
                {
                    isPlayer &&
                    <div className='absolute text-black dark:text-white font-bold text-xl z-2 top-1 right-2'><LiaStarSolid className='text-green-500' /></div>
                }
            </div>

            {/* Error message */}
            {error && <p className='text-center text-red-500 font-bold'>{error.message}</p>}
        </div>
    )

}
