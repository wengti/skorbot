'use server'

import { SearchResType, SearchType } from "@/type/search-type"
import { createClient } from "./supabase/server"
import { getUserData } from "./auth-utils"

export async function searchUsers(searchVal: string, participants: SearchResType[]) {

    try{
        if(searchVal === '') {
            return {res:[ ], error: null}
        }

        const {data: userData, error: authError} = await getUserData()
        if(authError instanceof Error) throw authError
        else if (authError !== null) throw new Error(authError)
        
        
        const supabase = await createClient()
        const {data, error: searchError} = await supabase
                                .from('users')
                                .select<'*', SearchResType>()
                                .ilike('name', `%${searchVal}%`)
                                .neq('id', userData?.claims.sub)
                                .not('id', 'in', `(${participants.map(participant => participant.id).join(',')})`)
        if(searchError) throw searchError

        return {res: data, error: null}

    }
    catch(error){
        if (error instanceof Error) return {res: null, error}
        else return {res: null, error: new Error('Unknown error')}
    }
}