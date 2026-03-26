import { FaFileUpload } from "react-icons/fa";
import PaymentUploadZone from "../image-dropzone/payment-upload-zone";
import { MatchDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FaHistory } from "react-icons/fa";
import Image from "next/image";
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area";
import Link from "next/link";

export default async function MatchHomePaymentNonOwner({ roomId, matchData, playerId }: { roomId: string, matchData: MatchDataType, playerId: string }) {

    try {

        /* Get the file name of player's uploaded receipt */
        const supabase = await createClient()
        const { data: fileNameData, error: fileNameError } = await supabase
            .from('match_players')
            .select('file_name')
            .eq('player', playerId)
            .eq('match', matchData.id)
        if (fileNameError) throw new Error(fileNameError.message)
        else if (fileNameData === null) throw new Error('Fail to fetch the uploaded receipt.')
        
        /* Check if there's a valid receipt path */
        const hasUploadedReceipt = fileNameData[0]?.file_name
        let imgSrc = ''
        if (hasUploadedReceipt) imgSrc = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payment/${roomId}/${matchData.id}/${playerId}/${fileNameData[0].file_name}`

        /* Decide if a visting client is part of the match and need to submit payment receipt */
        const isThisPlayerInTheGame = matchData.players.includes(playerId)

        /* Returned component */
        return (
            <section className='p-2 font-bold text-lg sm:text-xl grow flex flex-col justify-center mt-4'>

                <div className='flex flex-col gap-2'>

                    {/* Title of the receipt upload area */}
                    <div className='flex gap-2 justify-between'>
                        <div className='flex gap-2 items-center'>
                            <FaHistory />
                            <p>Previously uploaded receipt</p>
                        </div>
                        <Link href={imgSrc} target='_blank' className='self-end font-semibold'>
                            <p className='underline text-xs'>Expand</p>
                        </Link>
                    </div>

                    {/* View area of the uplaoded receipt */}
                    <ScrollArea className='h-30'>
                        <ScrollAreaViewport>
                            {
                                hasUploadedReceipt ?
                                    <Image
                                        src={imgSrc}
                                        alt='Your latest uploaded receipt.'
                                        height={100}
                                        width={100}
                                        className="w-full max-w-150 mx-auto"
                                    /> :
                                    <p className='text-sm text-center text-slate-500 dark:text-gray-500'>No record found</p>
                            }
                        </ScrollAreaViewport>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                </div>
                
                {/* Dropzone for uploading payment receipts */}
                <div className='flex flex-col gap-2 grow mt-4'>
                    <div className='flex gap-2 items-center'>
                        <FaFileUpload />
                        <p>Upload your payment receipt here</p>
                    </div>
                    {
                        isThisPlayerInTheGame ?
                            <PaymentUploadZone roomId={roomId} matchData={matchData} playerId={playerId} /> :
                            <p className='text-sm text-center text-slate-500 dark:text-gray-500'>You are not involved in this match.</p>
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

