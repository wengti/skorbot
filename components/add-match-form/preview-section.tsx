import { ClientUserContextType } from "@/type/auth-type";
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area";
import { PreviewType } from "./add-match-form";
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import { Avatar } from "../tailgrids/core/avatar";
import { TbSwords } from "react-icons/tb";
import { TableBody, TableCell, TableHead, TableHeader, TableRoot, TableRow } from "../tailgrids/core/table";
import { FaGear } from "react-icons/fa6";
import PreviewPagination from "./preview-pagination";


export default function PreviewSection({ preview, roomParticipants, showEstimation = true }: { preview: PreviewType, roomParticipants: ClientUserContextType[], showEstimation?: boolean }) {

    /* Destructure preview */
    const { flatFullResult, profile } = preview

    /* Class Name for cell rows */
    const headerClsName = 'text-black font-bold dark:text-(--color-dark-text) p-1.5 sm:text-base'
    const rowClsName = 'text-black font-bold dark:text-(--color-dark-text) text-xs p-1.5 sm:text-base'

    /* Creating an array of cards for each player */
    let previewCards = []
    for (const playerId of Object.keys(profile)) {

        /* Create the teammate and opponent table */
        const rows = Object.keys(profile[playerId].opponent).map((otherPlayerId) => {
            const otherPlayer = roomParticipants.find(p => p.id === otherPlayerId)
            const otherPlayerName = (otherPlayer && otherPlayer?.name.length > 12) ? otherPlayer?.name.slice(0, 12) + '..' : otherPlayer?.name

            return (
                <TableRow key={otherPlayer?.id}>
                    <TableCell className={`${rowClsName}`}>{otherPlayerName}</TableCell>
                    <TableCell className={`${rowClsName}`}>{profile[playerId].teammate[otherPlayerId]}</TableCell>
                    <TableCell className={`${rowClsName}`}>{profile[playerId].opponent[otherPlayerId]}</TableCell>
                </TableRow>
            )
        })

        /* Create the card */
        const curPlayer: ClientUserContextType | undefined = roomParticipants.find(participant => participant.id === playerId)
        if (curPlayer) {
            previewCards.push(

                /* Card */

                <ScrollArea key={curPlayer.id} className='flex flex-col border rounded-xl h-113.25'>
                    <ScrollAreaViewport className='p-4'>

                        {/* Avatar */}
                        <Avatar
                            key={curPlayer.id}
                            src={curPlayer.picture}
                            alt={`The profile picture of ${curPlayer.name}`}
                            fallback={curPlayer.name.slice(0, 1)}
                            size='lg'
                            label={{
                                title: curPlayer.name,
                                subtitle: curPlayer.email
                            }}
                            className='bg-(--color-pale) dark:bg-(--color-dark-pale) pr-6 pl-4 py-2 w-62.5 rounded-full mx-auto'
                        />

                        {/* Summary */}
                        <div className="flex flex-col my-4">

                            {/* Num of Matches Played */}
                            <div className='flex gap-2 items-center text-md'>
                                <TbSwords className='text-sm' />
                                <p>{profile[playerId].numMatchesPlayed} matches</p>
                            </div>

                            {/* Back to Back Matches */}
                            <div className='flex gap-2 items-center text-md'>
                                <TbSwords className='text-sm' />
                                <p>{profile[playerId].longestStreak} b2b matches at most</p>
                            </div>

                            {/* Schedule */}
                            <div className='flex flex-wrap justify-center w-55 mx-auto'>
                                {
                                    profile[playerId].schedule.map((entry, idx) => {
                                        const hasGap = (idx + 1) % 5 === 0 ? 'mr-2' : ''
                                        if (entry === 'o') return <MdOutlineCheckBox key={idx} className={`text-green-500 text-xl ${hasGap}`} />
                                        else return <MdOutlineCheckBoxOutlineBlank key={idx} className={`text-gray-500 text-xl ${hasGap}`} />
                                    })
                                }
                            </div>
                        </div>

                        {/* Teammate and Opponent Table */}
                        <TableRoot className='dark:border-(--color-dark-text)'>
                            <TableHeader>
                                <TableRow className='text-black dark:text-(--color-dark-text)'>
                                    <TableHead className={`${headerClsName}`}>Player</TableHead>
                                    <TableHead className={`${headerClsName}`}>Team</TableHead>
                                    <TableHead className={`${headerClsName}`}>VS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows}
                            </TableBody>
                        </TableRoot>
                    </ScrollAreaViewport>
                    <ScrollBar orientation='vertical' />
                </ScrollArea>
            )
        }
    }

    /* Full Element to be returned */
    return (
        <section className='mt-4 mb-4 w-full'>

            {/* Title */}
            <div className="text-xl font-bold mb-2 flex gap-2 items-center">
                <VscPreview />
                <p>Game Profile Preview</p>
            </div>

            {/* Inner Container */}
            <div className="w-full h-145 border px-2 py-4 rounded-xl flex flex-col">

                {/* Total number of matches */}
                {
                    showEstimation &&
                    <div className='flex gap-2 items-center font-bold text-xl mb-4'>
                        <FaGear />
                        <p>{flatFullResult.length} Matches | Estimated Playtime: {flatFullResult.length * 15} mins</p>
                    </div>
                }

                {/* The preview cards and pagination */}
                <PreviewPagination previewCards={previewCards} />
            </div>
        </section>
    )
}