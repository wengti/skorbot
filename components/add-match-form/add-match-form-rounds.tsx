import { cn } from "@/utils/cn"
import { IoTimerOutline } from "react-icons/io5"
import { RadioInput } from "../tailgrids/core/radio-input"
import { Label } from "../tailgrids/core/label"
import { Dispatch, SetStateAction } from "react"

export default function AddMatchFormRounds({rounds, setRounds}:{rounds: number, setRounds: Dispatch<SetStateAction<number>>}) {

    const options: { label: string, value: number}[] = [
        { label: "One", value: 1 },
        { label: "Two", value: 2 },
        { label: "Three", value: 3 }
    ]


    return (
        <>
            <div className='mb-2 font-bold text-xl flex gap-2 items-center'>
                <IoTimerOutline />
                <p>Number of Rounds</p>
            </div>
            <div className="flex gap-3">
                {options.map(option => (
                    <Label
                        key={option.value}
                        className={cn(
                            "group flex cursor-pointer items-center gap-3 select-none rounded-lg text-black dark:text-(--color-dark-text) has-checked:text-black border dark:border-(--color-dark-text) border-black bg-(--color-pale) dark:bg-(--color-dark-pale) p-4 transition-colors has-checked:bg-(--color-highlight) font-bold text-md"
                        )}
                    >
                        <RadioInput
                            name="rounds"
                            value={option.value}
                            checked={rounds === option.value}
                            onChange={(event) => { setRounds(option.value) }}
                            aria-label={`Set the game rounds to ${option.value}`}
                        />
                        <span>{option.label}</span>
                    </Label>
                ))}
            </div>
        </>
    )
}