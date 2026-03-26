'use client'
import { MatchDataType, PlayersDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page";
import { PaymentDataType } from "./match-home-payment-owner";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area";
import { IoMdCheckboxOutline } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { createClient } from "@/lib/supabase/client";
import { startTransition, useOptimistic, useState } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "../tailgrids/core/pagination";
import { TableBody, TableCell, TableHead, TableHeader, TableRoot, TableRow } from "../tailgrids/core/table";

export default function MatchHomePaymentOwnerTable({ paymentData, playersData, baseUrl, matchData }: { paymentData: PaymentDataType[], playersData: PlayersDataType[], baseUrl: string, matchData: MatchDataType }) {

    /* State for pagination */
    const [error, setError] = useState<Error | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const totalPages = paymentData.length + 1

    /* Optimistic State */
    const [rawPaymentData, setRawPaymentData] = useState<PaymentDataType[]>(paymentData)
    const [optimisticPaymentData, setOptimisticPaymentData] = useOptimistic<PaymentDataType[]>(rawPaymentData)

    /* Router */
    const router = useRouter()

    /* Function - Toggle Payment Status */
    async function handleTogglePaymentStatus(matchId: string, playerId: string, newStatus: boolean) {

        startTransition(async () => {

            /* Optimistic state change - set to tick / untick instantly */
            setOptimisticPaymentData((prevData) => {
                const newData = JSON.parse(JSON.stringify(prevData)) as unknown as PaymentDataType[]
                const target = newData.find(d => d.player === playerId)
                if (!target) return prevData
                target.has_paid = newStatus
                return newData
            })

            /* Update the database accordingly */
            const supabase = createClient()
            const { error } = await supabase
                .from('match_players')
                .update({ has_paid: newStatus })
                .eq('match', matchId)
                .eq('player', playerId)
            if (error) {
                setRawPaymentData((prevData) => prevData) /* If any error, reset the state, which lead to optimistic state being reverted */
                setError(new Error(error.message))
                return
            }

            /* Get the latest updated state in database */
            const { data: newPaymentData, error: newPaymentError } = await supabase
                .from('match_players')
                .select('player, file_name, has_paid')
                .eq('match', matchData.id)
                .neq('player', matchData.rooms.owner)
                .order('player', { ascending: false })
            if (newPaymentError) {
                setRawPaymentData((prevData) => prevData) /* If any error, reset the state, which lead to optimistic state being reverted */
                setError(new Error(newPaymentError.message))
                return
            }

            setRawPaymentData(newPaymentData) /* Finally updated the state to align with the optimistic state */
            setError(null)
        })
    }


    /* If current page === 1, return a table */
    /* Else return a full page displaying the player's submitted receipt */
    let displayElement
    if (currentPage === 1) {

        const headerClsName = 'text-black font-bold dark:text-(--color-dark-text) p-1.5 sm:text-base'
        const rowClsName = 'text-black font-bold dark:text-(--color-dark-text) text-xs p-1.5 py-2 sm:text-base'

        const rows = rawPaymentData.map((data, idx) => {
            const rawPlayerProfile = playersData.find(p => p.player === data.player)
            const playerProfile = rawPlayerProfile ? rawPlayerProfile.users : { id: String(Math.round(Math.random() * 1000)), name: 'Unknown', picture: '/images/profile_inactive.png', email: 'unknown@email.com' }
            const imgSrc = data.file_name ? `${baseUrl}/${data.player}/${data.file_name}` : ''

            return (
                <TableRow key={playerProfile.id}>
                    <TableCell className={`${rowClsName}`}>{idx + 1}</TableCell>
                    <TableCell className={`${rowClsName}`}>{playerProfile.name}</TableCell>
                    <TableCell className={`${rowClsName}`}>
                        {
                            imgSrc &&
                            <Link className='underline' href={imgSrc} target='_blank'>
                                Receipt image
                            </Link>
                        }
                    </TableCell>
                    <TableCell className={`${rowClsName}`}>
                        <button onClick={() => { handleTogglePaymentStatus(matchData.id, playerProfile.id, !data.has_paid) }}>
                            {
                                data.has_paid ?
                                    <IoMdCheckboxOutline className='text-green-500 text-xl' /> :
                                    <MdCheckBoxOutlineBlank className='text-xl'/>
                            }
                        </button>
                    </TableCell>
                </TableRow>
            )
        })


        displayElement = (
            <div className=''>
                <ScrollArea className='h-90'>
                    <ScrollAreaViewport>
                        <TableRoot className='border-0'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={`${headerClsName}`}>#</TableHead>
                                    <TableHead className={`${headerClsName}`}>Name</TableHead>
                                    <TableHead className={`${headerClsName}`}>Receipt</TableHead>
                                    <TableHead className={`${headerClsName}`}>Y/N</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows}
                            </TableBody>
                        </TableRoot>
                    </ScrollAreaViewport>
                    <ScrollBar orientation='vertical' />
                </ScrollArea>
            </div>
        )
    }
    else if (currentPage > 1) {
        const data = rawPaymentData[currentPage - 2]
        const rawPlayerProfile = playersData.find(p => p.player === data.player)
        const playerProfile = rawPlayerProfile ? rawPlayerProfile.users : { id: String(Math.round(Math.random() * 1000)), name: 'Unknown', picture: '/images/profile_inactive.png', email: 'unknown@email.com' }
        const imgSrc = data.file_name ? `${baseUrl}/${data.player}/${data.file_name}` : ''

        displayElement = (
            <div className='grow flex flex-col'>

                {/* Title of the payment receipt zone */}
                <div className='flex gap-2 justify-between mb-2'>
                    <div className='flex gap-2 items-center'>
                        <Image
                            src={playerProfile.picture}
                            alt={`The profile picture of ${playerProfile.name}`}
                            height={64}
                            width={64}
                            className='rounded-full w-8'
                        />
                        <p className='font-bold'>{playerProfile.name}</p>
                    </div>

                    {
                        imgSrc &&
                        <Link className='underline font-bold text-sm self-end' target='_blank' href={imgSrc}>
                            Expand
                        </Link>
                    }
                </div>

                {/* View area for the uploaded payment receipt */}
                <ScrollArea className='h-60 my-auto'>
                    <ScrollAreaViewport>
                        {
                            imgSrc ?
                                <Image
                                    src={imgSrc}
                                    alt={`The payment receipt of ${playerProfile.name}`}
                                    height={64}
                                    width={64}
                                    className='w-full max-w-150 mx-auto'
                                /> :
                                <p className='text-slate-500 dark:text-gray-500 text-center'>No payment receipt</p>
                        }
                    </ScrollAreaViewport>
                    <ScrollBar orientation='vertical' />
                </ScrollArea>
                
                {/* Checkbox */}
                <div className='text-3xl text-center'>
                    <button onClick={() => { handleTogglePaymentStatus(matchData.id, playerProfile.id, !data.has_paid) }}>
                        {
                            data.has_paid ?
                                <IoMdCheckboxOutline className='text-green-500' /> :
                                <MdCheckBoxOutlineBlank />
                        }
                    </button>
                </div>
            </div>
        )
    }


    /* Full returned component with pagination */
    return (
        <section className='grow flex flex-col border p-2 rounded-lg'>
            {
                error &&
                <p className='text-red-500'>{error.message}</p>
            }
            {displayElement}
            <div className='mt-4 mb-2'>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    sideLayout="icon"
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </section>

    )
}