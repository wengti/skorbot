'use server'

import { ResultDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page"
import { createClient } from "./supabase/server"
import { getRoomOwnerId, getUserData } from "./auth-utils"


export async function handleScoreChangeBE(tableName: string, entry: { score_a?: number, score_b?: number }, resultData: ResultDataType, roomId: string) {

    try {
        const supabase = await createClient()

        const { data: userData, error: userError } = await getUserData()
        if (userError instanceof Error) throw new Error(userError.message)
        else if (userError !== null) throw new Error(userError)
        else if (userData === null) throw new Error('Unknown current user.')
        
        const {data: ownerId, error: ownerError} = await getRoomOwnerId(roomId)
        if(ownerError) throw new Error(ownerError.message)
        else if(ownerId === null) throw new Error('Fail to identify the room id.')
        
        if (userData.claims.sub !== ownerId) throw new Error('This action is only executable by the room owner.')

        const { error: changeScoreError } = await supabase
            .from(tableName)
            .update(entry)
            .eq('id', resultData.id)
        return changeScoreError
    }
    catch (error) {
        if (error instanceof Error) return error
        else return new Error('Unknown error.')
    }


}