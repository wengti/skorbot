import { Dispatch, SetStateAction } from "react";
import { FiMaximize2 } from "react-icons/fi";

export default function AddMatchFormMaxLength({ maxLength, setMaxLength, isPending }: { maxLength: number, setMaxLength: Dispatch<SetStateAction<number>>, isPending: boolean }) {

    return (
        <div className='flex flex-col justify-start mt-2'>
            <div className='mb-2 font-bold text-xl flex gap-2 items-center'>
                <FiMaximize2 />
                <p>Maximum number of matches</p>    
            </div>
            <p className='text-sm h-fit -mt-2 mb-2 text-gray-500 font-bold'>Max number of matches at 0 indicates that there's no upper bound.</p>
            <input
                type='number'
                name='maxLength'
                id='maxLength'
                className='bg-(--color-pale) dark:bg-(--color-dark-pale) text-black dark:text-(--color-dark-text) rounded-lg border-black dark:border-(--color-dark-text) w-20 text-center'
                value={maxLength}
                onChange={(event) => setMaxLength(Number(event.target.value))}
                disabled={isPending}
            />
        </div>
    )
}