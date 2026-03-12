export type GetUserDataPropsType = {
    error: Error | null | string
    data: {
        claims: {
            sub: string
            session_id: string
        }
    } | null
}