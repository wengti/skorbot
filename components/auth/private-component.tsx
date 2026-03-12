import { getUserData } from "@/lib/auth-utils"

export default async function PrivateComponent() {

    const { data } = await getUserData()

    return (
        <p>
            {data?.claims.sub}
        </p>
    )
}