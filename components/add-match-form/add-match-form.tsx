'use client'
import { ClientUserContextType } from '@/type/auth-type'
import Form from 'next/form'
import { useState } from 'react';
import { Key } from 'react-aria-components';
import FormEntry from '../my-ui/form-entry';
import Image from 'next/image';
import AddMatchFormPlayers from './add-match-form-players';
import AddMatchFormTeamConfig from './add-match-form-team-config';
import AddMatchFormRounds from './add-match-form-rounds';
import AddMatchFormLength from './add-match-form-length';
import AddMatchFormNote from './add-match-form-note';

export default function AddMatchForm({ roomParticipants }: { roomParticipants: ClientUserContextType[] }) {

    const [players, setPlayers] = useState<Key[]>([]);
    const [teamConfig, setTeamConfig] = useState<'one' | 'two'>('one')
    const [rounds, setRounds] = useState<number>(1)
    const [length, setLength] = useState<'short' | 'medium' | 'long'>('short')
    const [note, setNote] = useState<string>('')


    return (
        <div className='flex gap-2 justify-center'>
            <Form action='/' className='flex flex-col gap-2 py-2 px-2 max-w-200 grow'>
                <FormEntry index={1}>
                    <AddMatchFormPlayers roomParticipants={roomParticipants} players={players} setPlayers={setPlayers} />
                </FormEntry>
                <FormEntry index={2}>
                    <AddMatchFormTeamConfig teamConfig={teamConfig} setTeamConfig={setTeamConfig} />
                </FormEntry>
                <FormEntry index={3}>
                    <AddMatchFormRounds rounds={rounds} setRounds={setRounds} />
                </FormEntry>
                {
                    teamConfig === 'two' &&
                    <FormEntry index={4}>
                        <AddMatchFormLength length={length} setLength={setLength} />
                    </FormEntry>
                }
                <FormEntry index={teamConfig === 'two' ? 5 : 4}>
                    <AddMatchFormNote note={note} setNote={setNote} />
                </FormEntry>


            </Form>
            <div className='justify-center items-center hidden md:flex min-w-80'>
                <Image
                    src='/images/mascot.gif'
                    alt='Skorbot looking to see if you need any help with creating a new room.'
                    width={400}
                    height={500}
                    unoptimized
                    className='hidden md:block w-80'
                />
            </div>
        </div>
    )
}