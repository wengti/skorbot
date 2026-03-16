'use server'

import { ClientUserContextType } from "@/type/auth-type"
import { createClient } from "./supabase/server"
import { PostgrestError } from "@supabase/supabase-js"
import { Dispatch, SetStateAction } from "react"

export async function createANewRoom(roomName: string, participants:ClientUserContextType[], roomPicture: string){
    try{

        /* Data Sanitization */
        if(roomName.trim() === '') {
            throw new Error('Room name cannot be empty.')
        }
        
        if(roomPicture.trim() === ''){
            throw new Error('Room picture cannot be empty.')
        }

        if(participants.length < 2) {
            throw new Error('Must have at least 2 participants.')
        }

        /* Enter data for the room */
        const supabase = await createClient()
        const { data: roomData, error: roomError } = await supabase
                                    .from('rooms')
                                    .insert({name: roomName, picture: roomPicture, owner: participants[0].id})
                                    .select<'id', {id: string}>('id')
        if(roomError) throw new Error(roomError.message)
        
        /* Enter data for all the involved participants */
        const allRoomParticipantsEntries = participants.map((p, idx) => {
            return {
                room: roomData[0].id,
                participant: p.id,
                is_owner: idx === 0 
            } //Only set the first participant as the owner
        })
        const { error: roomParticipantError } = await supabase
                                                        .from('room_participants')
                                                        .insert(allRoomParticipantsEntries)
        if(roomParticipantError) throw new Error(roomParticipantError.message)
        
        /* Return a state */
        return null // Required, as it is used in useActionState

    }
    catch(error){
        if (error instanceof Error) return error
        else return new Error('Unknown error')
    }
}