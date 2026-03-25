import { FaHandshake } from "react-icons/fa";
import { Skeleton } from "../tailgrids/core/skeleton";
import { TableBody, TableCell, TableHead, TableHeader, TableRoot, TableRow } from "../tailgrids/core/table";
import { GiSwordsEmblem } from "react-icons/gi";

export default function LoadingStatsDetail() {

    const headerClsName = 'text-black font-bold dark:text-(--color-dark-text) p-1.5 lg:text-base'
    const itemsPerPage = 5
    const tableRows = []

    for (let i = 0; i < itemsPerPage; i++) {
        tableRows.push(
            <TableRow key={i}>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-1 w-full" />
                </TableCell>
            </TableRow>
        )
    }

    return (
        <div className="flex flex-col gap-2">

            <div className='flex flex-wrap gap-2 mx-auto justify-center'>
                <Skeleton className='h-35 w-35 rounded-xl' />
                <Skeleton className='h-35 w-35 rounded-xl' />
                <Skeleton className='h-35 w-35 rounded-xl' />
                <Skeleton className='h-35 w-35 rounded-xl' />
            </div>

            <div className='flex flex-col md:flex-row gap-2'>

                <div className='md:w-1/2 border rounded-xl p-2 flex flex-col gap-2 h-78 lg:h-88'>
                    <div className='text-lg font-bold mb-1 flex gap-2 items-center'>
                        <FaHandshake />
                        <h2>Record with these teammates</h2>
                    </div>
                    <div className='flex flex-col grow'>
                        <div className='mx-2 grow items-center'>
                            <TableRoot className="w-full px-4 dark:border-white p-0">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className={`${headerClsName}`}>Rank</TableHead>
                                        <TableHead className={`${headerClsName}`}>Name</TableHead>
                                        <TableHead className={`${headerClsName}`}>Win</TableHead>
                                        <TableHead className={`${headerClsName}`}>Lose</TableHead>
                                        <TableHead className={`${headerClsName}`}>+/-</TableHead>
                                        <TableHead className={`${headerClsName}`}>%</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tableRows}
                                </TableBody>
                            </TableRoot>
                        </div>
                    </div>
                </div>

                <div className='md:w-1/2 border rounded-xl p-2 flex flex-col gap-2 h-78 lg:h-88'>
                    <div className='text-lg font-bold mb-1 flex gap-2 items-center'>
                        <GiSwordsEmblem />
                        <h2>H2H versus these opponents</h2>
                    </div>
                    <div className='flex flex-col grow'>
                        <div className='mx-2 grow items-center'>
                            <TableRoot className="w-full px-4 dark:border-white p-0">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className={`${headerClsName}`}>Rank</TableHead>
                                        <TableHead className={`${headerClsName}`}>Name</TableHead>
                                        <TableHead className={`${headerClsName}`}>Win</TableHead>
                                        <TableHead className={`${headerClsName}`}>Lose</TableHead>
                                        <TableHead className={`${headerClsName}`}>+/-</TableHead>
                                        <TableHead className={`${headerClsName}`}>%</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tableRows}
                                </TableBody>
                            </TableRoot>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}