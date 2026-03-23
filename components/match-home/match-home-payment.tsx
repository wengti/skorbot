import { MatchDataType, PlayersDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page"
import { getUserData } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import MatchHomePaymentNonOwner from "./match-home-payment-non-owner"
import { BsCashCoin } from "react-icons/bs";
import MatchHomePaymentOwner from "./match-home-payment-owner";
import { CiStickyNote } from "react-icons/ci";

export default async function MatchHomePaymenmt({ matchData, playersData, roomId }: { matchData: MatchDataType, playersData: PlayersDataType[], roomId: string }) {

    try {
        const { data, error } = await getUserData()
        if (error instanceof Error) throw new Error(error.message)
        else if (error !== null) throw new Error(error)
        else if (data === null) throw new Error('Fail to verify the identity of the current user.')

        const currentUserId = data.claims.sub
        const ownerId = matchData.rooms.owner

        return (
            <section>
                <div className='text-xl font-bold mb-1 flex gap-2 items-center mt-4'>
                    <BsCashCoin />
                    <h2>Payment</h2>
                </div>
                <div className="h-145 w-full border my-2 rounded-xl flex flex-col">
                    <div className="h-10 p-2 my-2">
                        <div className='text-xl font-bold mb-1 flex gap-2 items-center'>
                            <CiStickyNote />
                            <h2>Note from the room owner:</h2>
                        </div>
                        <p className='italic text-slate-500 dark:text-gray-500'>"{matchData.note}"</p>
                    </div>
                    {
                        currentUserId === ownerId ?
                            <MatchHomePaymentOwner matchData={matchData} playersData={playersData} ownerId={ownerId} roomId={roomId}/> :
                            <MatchHomePaymentNonOwner roomId={roomId} matchData={matchData} playerId={currentUserId} />
                    }
                </div>
            </section>
        )

    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }

}