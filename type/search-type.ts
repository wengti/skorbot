export type SearchResType = {
    id: string,
    picture: string
    name: string,
    email: string
}

export type SearchType = {
    res: SearchResType[] | null
    error: Error | null | string
}