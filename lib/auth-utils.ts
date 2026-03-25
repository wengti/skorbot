'use server'
import { GetUserDataPropsType } from "@/type/auth-type"
import { createClient } from "./supabase/server"
import { cache } from "react"


export const getUserData = async ():Promise<GetUserDataPropsType> => {
    try{
        const supabase = await createClient()
        const { data, error } = await supabase.auth.getClaims()
        if (error) throw new Error(error.message)

        if (data === null) return {data: null, error: null}
        else return {data, error: null}
    }
    catch(error){
        if (error instanceof Error) return {data: null, error}
        else return {data: null, error: 'Unknown Error'}
    }
}

type GetRoomOwnerIdType = {
    data: string | null
    error: Error | null
}


export async function getRoomOwnerId(roomId: string): Promise<GetRoomOwnerIdType>{
    try{
        const supabase = await createClient()
        const {data, error} = await supabase
            .from('room_participants')
            .select('participant')
            .eq('room', roomId)
            .eq('is_owner', true)
        if(error) throw new Error(error.message)
        else if (data === null || data.length === 0) throw new Error('Fail to identify the room owner.')

        return {data: data[0].participant, error: null}
    }
    catch(error){
        if(error instanceof Error) return {data: null, error: error}
        else return {data: null, error: new Error('Unknown Error.')}
    }
}
