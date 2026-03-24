import { Skeleton } from "../tailgrids/core/skeleton";

export default function LoadingRoomCard() {

    let displayedElement = []
    for (let i = 0; i < 3; i++) {
        let clsName = 'bg-(--color-pale) dark:bg-(--color-dark-pale) w-77 h-77 rounded-md p-2 shadow-2xl flex flex-col gap-2 border'
        if(i > 0) {
            clsName += ' hidden sm:flex'
        }
        displayedElement.push(
            <div className={clsName} key={i}>
                <div className='flex gap-4 p-4 items-center grow'>
                    <Skeleton className="size-16 rounded-full" />
                    <div className='flex flex-col gap-1'>
                        <Skeleton className="h-4 w-40 rounded-lg" />
                        <Skeleton className="h-4 w-20 rounded-lg" />
                        <Skeleton className="size-8 rounded-full" />
                    </div>
                </div>
                <div className='h-35 w-full flex gap-4 text-7xl items-center justify-center border rounded-md relative'>
                    <p className='absolute -top-4 left-4 text-lg bg-(--color-pale) dark:bg-(--color-dark-pale) px-2 '>Shortcut</p>
                    <Skeleton className="h-18 w-18 rounded-lg" />
                    <Skeleton className="h-18 w-18 rounded-lg" />
                </div>
            </div>
        )



    }

    return displayedElement
}