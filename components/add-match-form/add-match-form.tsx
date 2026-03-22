'use client'
import { ClientUserContextType } from '@/type/auth-type'
import Form from 'next/form'
import { useActionState, useRef, useState } from 'react';
import { Key } from 'react-aria-components';
import FormEntry from '../my-ui/form-entry';
import AddMatchFormPlayers from './add-match-form-players';
import AddMatchFormTeamConfig from './add-match-form-team-config';
import AddMatchFormRounds from './add-match-form-rounds';
import AddMatchFormLength from './add-match-form-length';
import AddMatchFormNote from './add-match-form-note';
import Button from '../my-ui/button';
import arrangeMatchups, { ProfileType } from '@/lib/match-algo';
import PreviewSection from './preview-section';
import AddMatchFormMaxLength from './add-match-form-max-length';
import { createANewMatch } from '@/lib/match-form-utils';
import { useRouter } from 'next/navigation';


export type PreviewType = {
    flatFullResult: Record<string, string>[];
    profile: ProfileType
}

export default function AddMatchForm({ roomParticipants, roomId }: { roomParticipants: ClientUserContextType[], roomId: string }) {

    /* State - Form Data */
    const [players, setPlayers] = useState<Key[]>([]);
    const [teamConfig, setTeamConfig] = useState<'one' | 'two'>('one')
    const [rounds, setRounds] = useState<number>(1)
    const [length, setLength] = useState<'short' | 'medium' | 'long'>('short')
    const [maxLength, setMaxLength] = useState<number>(0)
    const [note, setNote] = useState<string>('')

    /* State - Preview */
    const [preview, setPreview] = useState<PreviewType>(null!)

    /* Ref - For Auto Scrolling */
    const previewSection = useRef<HTMLDivElement>(null!)

    /* Router - For navigation */
    const router = useRouter()

    /* Action State  */
    const [state, formAction, isPending] = useActionState(async () => {
        const castPlayers = players as string[]
        const {errorState, matchId} =  await createANewMatch({
            room: roomId,
            players: castPlayers,
            team_config: teamConfig,
            num_of_rounds: rounds,
            length,
            maxLength,
            note
        })

        if(errorState === null) {
            setPlayers([])
            setTeamConfig('one')
            setRounds(1)
            setLength('short')
            setMaxLength(0)
            setNote('')
            router.push(`/user/rooms/${roomId}/match/${matchId}`)
        }

        return errorState

    }, null)


    /* Function - Handle Preview */
    function handlePreview() {
        const castPlayers = players as string[]
        const preview = arrangeMatchups(castPlayers, teamConfig, length, rounds, maxLength, false)
        const previewResult = preview?.flatFullResult
        const previewProfile = preview?.profile
        if (previewResult && previewProfile) {
            setPreview(preview)
            setTimeout(() => { previewSection.current.scrollIntoView({ behavior: 'smooth' }) }, 500)
        }

    }


    /* Returned Form Component */
    return (
        <section className='w-full flex flex-col'>
            <div className='flex justify-center'>

                {/* Form */}
                <Form action={formAction} className='flex flex-col gap-2 py-2 px-2 max-w-200 grow'>
                    <FormEntry index={1}>
                        <AddMatchFormPlayers roomParticipants={roomParticipants} players={players} setPlayers={setPlayers} />
                    </FormEntry>
                    <FormEntry index={2}>
                        <AddMatchFormTeamConfig teamConfig={teamConfig} setTeamConfig={setTeamConfig} isPending={isPending} />
                    </FormEntry>
                    <FormEntry index={3}>
                        <AddMatchFormRounds rounds={rounds} setRounds={setRounds} isPending={isPending} />
                    </FormEntry>
                    {
                        teamConfig === 'two' &&
                        <>
                            <FormEntry index={4}>
                                <AddMatchFormLength length={length} setLength={setLength} isPending={isPending} />
                            </FormEntry>
                            <FormEntry index={5}>
                                <AddMatchFormMaxLength maxLength={maxLength} setMaxLength={setMaxLength} isPending={isPending} />
                            </FormEntry>
                        </>
                    }
                    <FormEntry index={teamConfig === 'two' ? 6 : 4}>
                        <AddMatchFormNote note={note} setNote={setNote} isPending={isPending} />
                    </FormEntry>

                    {/* Error message */}
                    {   state &&
                        <div className='-mb-6 text-center text-red-500'>
                            {state.message}
                        </div>
                    }

                    {/* Button Group */}
                    <div className='flex gap-2 justify-center mt-4 mb-4'>
                        <button type='submit' disabled={isPending}>
                            <Button size='sm'>
                                {isPending ? `Creating...` : `Create New Matches`}
                            </Button>
                        </button>

                        <button type='button' onClick={(event) => { handlePreview() }} disabled={isPending}>
                            <Button size='sm'>
                                Preview Matches
                            </Button>
                        </button>
                    </div>
                </Form>
            </div>

            {/* Preview Section */}
            <div ref={previewSection} className='lg-100'>
                {
                    preview &&
                    <PreviewSection preview={preview} roomParticipants={roomParticipants} />
                }
            </div>
        </section>
    )
}