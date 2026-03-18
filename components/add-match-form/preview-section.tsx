import { ClientUserContextType } from "@/type/auth-type";
import { ScrollArea, ScrollAreaViewport, ScrollBar } from "../tailgrids/core/scroll-area";
import { PreviewType } from "./add-match-form";
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { VscPreview } from "react-icons/vsc";
import { Avatar } from "../tailgrids/core/avatar";
import { TbSwords } from "react-icons/tb";
import { TableBody, TableCell, TableHead, TableHeader, TableRoot, TableRow } from "../tailgrids/core/table";
import { FaGear } from "react-icons/fa6";


export default function PreviewSection({ preview, roomParticipants }: { preview: PreviewType, roomParticipants: ClientUserContextType[] }) {

    const { flatFullResult, profile } = preview

    /* Creating an array of cards for each player */
    let previewCards = []
    for (const playerId of Object.keys(profile)) {

        /* Create the teammate and opponent table */
        const rows = Object.keys(profile[playerId].opponent).map((otherPlayerId) => {
            const otherPlayer = roomParticipants.find( p => p.id === otherPlayerId)
            const otherPlayerName = (otherPlayer && otherPlayer?.name.length > 12) ? otherPlayer?.name.slice(0,12) + '..' : otherPlayer?.name

            return (
                <TableRow key={otherPlayer?.id}>
                    <TableCell className='text-black dark:text-(--color-dark-text)'>{otherPlayerName}</TableCell>
                    <TableCell className='text-black dark:text-(--color-dark-text)'>{profile[playerId].teammate[otherPlayerId]}</TableCell>
                    <TableCell className='text-black dark:text-(--color-dark-text)'>{profile[playerId].opponent[otherPlayerId]}</TableCell>
                </TableRow> 
            )
        })

        /* Create the card */
        const curPlayer: ClientUserContextType | undefined = roomParticipants.find(participant => participant.id === playerId)
        if (curPlayer) {
            previewCards.push(
                
                /* Card */
                <div key={curPlayer.id} className='flex flex-col border p-4 rounded-xl'>

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
                        <div className='flex flex-wrap justify-center'>
                            {
                                profile[playerId].schedule.map((entry, idx) => {
                                    if (entry === 'o') return <MdOutlineCheckBox key={idx} className='text-green-500 text-xl' />
                                    else return <MdOutlineCheckBoxOutlineBlank key={idx} className='text-gray-500 text-xl' />
                                })
                            }
                        </div>
                    </div>

                    {/* Teammate and Opponent Table */}
                    <TableRoot className='dark:border-(--color-dark-text)'>
                        <TableHeader>
                            <TableRow className='text-black dark:text-(--color-dark-text)'>
                                <TableHead>Player</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>VS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows}
                        </TableBody>
                    </TableRoot>
                </div>
            )
        }
    }

    /* Full Element to be returned */
    return (
        <section className='mt-4 mb-4'>

            {/* Title */}
            <div className="text-xl font-bold mb-2 flex gap-2 items-center">
                <VscPreview />
                <p>Game Profile Preview</p>
            </div>

            {/* Scroll Area */}
            <ScrollArea className="w-full h-250 sm:h-200 md:h-150 border px-2 py-4 rounded-xl">
                <ScrollAreaViewport className="">

                    {/* Total number of matches */}
                    <div className='flex gap-2 items-center font-bold text-xl mb-4'>
                        <FaGear />
                        <p>{flatFullResult.length} Matches | Estimated Playtime: {flatFullResult.length * 15 } mins</p>
                    </div>

                    {/* Card Grid */}
                    <div className='grid grid-cols-[repeat(auto-fill,300px)] gap-2 justify-center'>
                        {previewCards}
                    </div>
                </ScrollAreaViewport>
                <ScrollBar orientation="vertical"/>
            </ScrollArea>
        </section>
    )
}