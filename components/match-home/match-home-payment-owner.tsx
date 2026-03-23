import { MatchDataType, PlayersDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import MatchHomePaymentOwnerTable from "./match-home-payment-owner-table";

export type PaymentDataType = {
    player: string,
    file_name: string | null,
    has_paid: boolean
}

export default async function MatchHomePaymentOwner({matchData, playersData, ownerId, roomId}: {matchData:MatchDataType, playersData:PlayersDataType[], ownerId:string, roomId:string}) {

    try {

        const supabase = await createClient()
        const {data: paymentData, error: paymentError} = await supabase
            .from('match_players')
            .select('player, file_name, has_paid')
            .eq('match', matchData.id)
            .neq('player', ownerId)
            .order('player', {ascending: false})
        if(paymentError) throw new Error(paymentError.message)
        else if(paymentData === null) throw new Error('Unable to fetch the payment data by the participants.')

        const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payment/${roomId}/${matchData.id}`
        
        

        return (
            <section className='mt-4 p-2 grow flex flex-col'>
                <div className='text-xl font-bold mb-1 flex gap-2 items-center mt-4'>
                    <MdDashboard />
                    <h2>Verify the payments</h2>
                </div>
                <MatchHomePaymentOwnerTable paymentData={paymentData} playersData={playersData} baseUrl={baseUrl} matchData={matchData}/>
            </section>
        )
    }
    catch (error) {
        if (error instanceof Error) redirect(`/auth/error?error=${error.message}`)
        else redirect(`/auth/error`)
    }
}