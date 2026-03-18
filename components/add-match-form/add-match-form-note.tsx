import { Dispatch, SetStateAction } from "react";
import { TextArea } from "../tailgrids/core/text-area";
import { CiStickyNote } from "react-icons/ci";

export default function AddMatchFormNote({ note, setNote, isPending }: { note: string, setNote: Dispatch<SetStateAction<string>>, isPending: boolean }) {

    return (
        <div className="w-full">
            <div className='mb-2 font-bold text-xl flex gap-2 items-center'>
                <CiStickyNote />
                <p>Note to Players</p>
            </div>
            <p className='text-sm h-fit -mt-3 mb-2 text-gray-500 font-bold'>Use this communicate payment and venue details</p>
            <TextArea
                placeholder='Pay me via TnG at 01x-xxxxxxx'
                value={note}
                onChange={(event) => setNote(event.currentTarget.value)}
                className='bg-(--color-pale) dark:bg-(--color-dark-pale) dark:border-(--color-dark-text) resize-none text-black dark:text-(--color-dark-text)'
                aria-label="A text area for the owner to enter details about the payment and game location details."
                disabled={isPending}
            />
        </div>
    )
}