'use server'
import { GetUserDataPropsType } from "@/type/auth-type"
import { createClient } from "./supabase/server"
import { cache } from "react"


export const getUserData = cache(async ():Promise<GetUserDataPropsType> => {
    try{
        
        const supabase = await createClient()
        const { data, error } = await supabase.auth.getClaims()
        if (error) throw error

        if (data === null) return {data: null, error: null}
        else return {data, error: null}
    }
    catch(error){
        if (error instanceof Error) return {data: null, error}
        else return {data: null, error: 'Unknown Error'}
    }
})