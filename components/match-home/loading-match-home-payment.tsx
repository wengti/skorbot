import { BsCashCoin } from "react-icons/bs";
import { CiStickyNote } from "react-icons/ci";
import { Skeleton } from "../tailgrids/core/skeleton";

export default function LoadingMatchHomePayment() {

    return (
        <section>
            <div className='text-xl font-bold mb-1 flex gap-2 items-center mt-4'>
                <BsCashCoin />
                <h2>Payment</h2>
            </div>
            <div className="h-145 w-full border my-2 rounded-xl flex flex-col">
                <div className="h-10 p-2 my-2">
                    <div className='text-lg sm:text-xl font-bold mb-1 flex gap-2 items-center'>
                        <CiStickyNote />
                        <h2>Note from the room owner:</h2>
                    </div>
                    <div className="w-full max-w-sm space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </div>

                <section className='mt-4 p-2 grow flex flex-col w-full'>
                    <div className='text-xl font-bold mb-1 flex gap-2 items-center mt-12'>
                        <Skeleton className="size-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                    <div className="w-full max-w-sm space-y-3 mt-4 flex flex-col items-center shrink-0">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                </section>


            </div>

        </section>
    )
}