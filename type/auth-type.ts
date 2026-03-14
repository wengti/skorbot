export type GetUserDataPropsType = {
    error: Error | null | string
    data: {
        claims: {
            sub: string
            session_id: string
        }
    } | null
}

export type ClientUserContextType = {
    id: string,
    name: string,
    email: string,
    picture: string
}