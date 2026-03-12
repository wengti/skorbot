import PrivateComponent from "@/components/auth/private-component"
import { Suspense } from "react"

export default async function Private() {

    

    return (
        <>
            <h1>This is A Private Page for</h1>
            <Suspense fallback={<h1>Loading...</h1>} >
                <PrivateComponent />
            </Suspense>
        </>
    )
}