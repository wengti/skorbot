import { IoPeopleSharp } from "react-icons/io5";
import { Button } from "../tailgrids/core/button";
import { MultiCombobox, MultiComboboxDisplay } from "../tailgrids/core/multi-combobox";
import { ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxInputWrapper, ComboboxItem, ComboboxList, ComboboxTrigger } from "../tailgrids/core/combobox";
import { Key } from "react-aria-components";
import { Dispatch, SetStateAction } from "react";
import { ClientUserContextType } from "@/type/auth-type";

export default function AddMatchFormPlayers({ roomParticipants, players, setPlayers }: { roomParticipants:ClientUserContextType[], players: Key[], setPlayers: Dispatch<SetStateAction<Key[]>> }) {

    const playerList = roomParticipants.map(participant => {
        return (
            <ComboboxItem key={participant.id} id={participant.name}>
                {participant.name}
            </ComboboxItem>
        )
    })
    return (
        <>
            <div className='mb-2 font-bold text-xl flex gap-2 items-center'>
                <IoPeopleSharp />
                <p>Players</p>
            </div>
            <div className="flex w-full flex-col gap-4">
                <div className="w-full flex items-end justify-between">
                    <p className="text-sm">Selected: {players.length} players</p>
                    <Button
                        variant="primary"
                        appearance="outline"
                        size="sm"
                        onClick={() => setPlayers([])}
                        disabled={players.length === 0}
                        className='bg-(--color-pale) dark:bg-(--color-dark-pale) text-black dark:text-(--color-dark-text) dark:border-(--color-dark-text)'
                    >
                        Clear Selection
                    </Button>
                </div>

                <MultiCombobox value={players} onChange={setPlayers} className='w-full'>
                    <ComboboxInputWrapper>
                        <ComboboxInput placeholder="Select players" className='bg-(--color-pale) dark:bg-(--color-dark-pale) rounded-lg' />
                        <ComboboxTrigger />
                    </ComboboxInputWrapper>
                    <MultiComboboxDisplay className="capitalize" />
                    <ComboboxContent className='bg-(--color-pale) dark:bg-(--color-dark-pale)'>
                        <ComboboxList>
                            {playerList}
                        </ComboboxList>
                        <ComboboxEmpty>No results found</ComboboxEmpty>
                    </ComboboxContent>
                </MultiCombobox>
            </div>
        </>
    )
}