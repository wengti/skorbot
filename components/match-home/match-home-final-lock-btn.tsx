'use client'
import { MatchDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import { PlayersRecordType } from "./match-home-leaderboard-server-component";
import { FaLockOpen, FaLock } from "react-icons/fa";
import { Popover, PopoverContent, PopoverDescription, PopoverHeading, PopoverTrigger } from "../tailgrids/core/popover";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../my-ui/button";
import updateStats from "@/lib/stats-utils";
import { createClient } from "@/lib/supabase/client";

export default function MatchHomeFinalLockBtn({ playersRecord, matchData }: { playersRecord: PlayersRecordType[], matchData: MatchDataType }) {

    const { is_pending } = matchData

    const [error, setError] = useState<Error | null>(null)
    const router = useRouter()

    async function handleFinalize() {

        const { error: updateError } = await updateStats(playersRecord)
        if(updateError) {
            setError(updateError)
            return
        }

        const supabase = createClient()
        const {error: lockError} = await supabase
            .from('matches')
            .update({is_pending: false})
            .eq('id', matchData.id)

        setError(null)
        router.push(`/user/rooms/${matchData.rooms.id}`)
    }

    return (
        is_pending ?
            <Popover placement='left'>
                <PopoverTrigger className='text-2xl'>
                    <FaLockOpen />
                </PopoverTrigger>
                <PopoverContent >
                    <PopoverHeading className='text-black dark:text-(--color-dark-text) font-bold'>Finalizing results</PopoverHeading>
                    <PopoverDescription className="mb-6 text-sm text-black dark:text-(--color-dark-text) font-bold">
                        {error ?
                            <span className='text-red-500'>{error.message}</span> :
                            `You can no longer amend the results after this action.`
                        }
                    </PopoverDescription>
                    <div className="flex gap-3">
                        <button onClick={() => { handleFinalize() }}>
                            <Button size='sm'>
                                Click here to proceed
                            </Button>
                        </button>
                    </div>
                </PopoverContent>
            </Popover> :
            <Popover placement='left'>
                <PopoverTrigger className='text-2xl'>
                    <FaLock />
                </PopoverTrigger>
                <PopoverContent className='p-0'>
                    <PopoverDescription className="text-sm font-bold text-black dark:text-(--color-dark-text)">
                        {
                            error ?
                                <span className='text-red-500'>{error.message}</span> :
                                `The results have been locked.`
                        }

                    </PopoverDescription>
                </PopoverContent>
            </Popover>

    )

}