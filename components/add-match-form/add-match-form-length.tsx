import { cn } from "@/utils/cn"
import { TbRulerMeasure } from "react-icons/tb";
import { RadioInput } from "../tailgrids/core/radio-input"
import { Label } from "../tailgrids/core/label"
import { Dispatch, SetStateAction } from "react"

export default function AddMatchFormLength({length, setLength}:{length: 'short' | 'medium' | 'long', setLength: Dispatch<SetStateAction<'short' | 'medium' | 'long'>>}) {

    const options: { label: string, value: 'short' | 'medium' | 'long'}[] = [
        { label: "Short", value: 'short' },
        { label: "Medium", value: 'medium'},
        { label: "Long", value: 'long'}
    ]


    return (
        <>
            <div className='mb-2 font-bold text-xl flex gap-2 items-center'>
                <TbRulerMeasure />
                <p>Length of Each Round</p>
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
                            name="length"
                            value={option.value}
                            checked={length === option.value}
                            onChange={(event) => { setLength(option.value) }}
                            aria-label={`Set the game length to ${option.value}`}
                        />
                        <span>{option.label}</span>
                    </Label>
                ))}
            </div>
        </>
    )
}