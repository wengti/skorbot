import { createClient } from "@/lib/supabase/server"
import { ClientUserContextType } from "@/type/auth-type"
import { redirect } from "next/navigation"
import StatsDetails from "./stats-details"
import { MdLeaderboard } from "react-icons/md"
import { MdOutlineWatchLater } from "react-icons/md";
import StatsMatches from "./stats-matches"
import Image from "next/image"

export default async function StatsHome({ playerId }: { playerId: string }) {

    try {


        /* Supabase */
        const supabase = await createClient()

        /* Fetch the user profile */
        const { data: currentPlayerData, error: currentPlayerError } = await supabase
            .from('users')
            .select('id, name, picture, email')
            .eq('id', playerId)
        if (currentPlayerError) throw new Error(currentPlayerError.message)
        else if (currentPlayerData === null) throw new Error('Unknown error in verifying the identity of this requested player.')
        const currentPlayer = currentPlayerData[0] as ClientUserContextType


        return (
            <section>

                <div className='flex gap-2 items-center mb-4 w-fit'>
                    <Image
                        height={64}
                        width={64}
                        alt={`The picture for ${currentPlayer.name}`}
                        src={currentPlayer.picture}
                        className='w-10 h-10 rounded-full border border-black dark:border-(--color-dark-text)'
                    />
                    <h1 className='text-2xl font-extrabold'>{currentPlayer.name}'s Stats </h1>
                </div>

                <div>
                    <div className='text-xl font-bold mb-1 flex gap-2 items-center mt-4'>
                        <MdLeaderboard />
                        <h2>Stats</h2>
                    </div>
                    <StatsDetails playerId={playerId}/>
                </div>

                <div className='mt-8'>
                    <div className='text-xl font-bold mb-2 flex gap-2 items-center mt-4'>
                        <MdOutlineWatchLater />
                        <h2>Latest Matches</h2>
                    </div>
                    <StatsMatches playerId={playerId}/>
                </div>

            </section>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }
}