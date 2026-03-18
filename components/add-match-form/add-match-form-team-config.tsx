import { GiTeamIdea } from "react-icons/gi"
import { Label } from "../tailgrids/core/label"
import { RadioInput } from "../tailgrids/core/radio-input"
import { Dispatch, SetStateAction } from "react"
import { cn } from "@/utils/cn"

export default function AddMatchFormTeamConfig({ teamConfig, setTeamConfig, isPending }: { teamConfig: 'one' | 'two', setTeamConfig: Dispatch<SetStateAction<"one" | "two">>, isPending: boolean }) {
    const options: { label: string, value: 'one' | 'two' }[] = [
        { label: "1 vs 1", value: 'one' },
        { label: "2 vs 2", value: 'two' }
    ]

    return (
        <>
            <div className='mb-2 font-bold text-xl flex gap-2 items-center'>
                <GiTeamIdea />
                <p>Team Configuration</p>
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
                            name="team_config"
                            value={option.value}
                            checked={teamConfig === option.value}
                            onChange={(event) => { setTeamConfig(option.value) }}
                            aria-label={`Set the team config to ${option.label}`}
                            disabled={isPending}
                        />
                        <span>{option.label}</span>
                    </Label>
                ))}
            </div>
        </>
    )
}