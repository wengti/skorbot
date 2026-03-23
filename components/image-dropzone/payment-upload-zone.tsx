'use client'
import { MatchDataType } from "@/app/user/rooms/[roomId]/match/[matchId]/page"
import { useSupabaseUpload } from "@/lib/hooks/use-supabase-upload"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./dropzone"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

type PaymentUploadZoneProps = {
    roomId: string
    matchData: MatchDataType
    playerId: string
}

export default function PaymentUploadZone({ roomId, matchData, playerId }: PaymentUploadZoneProps) {

    const [error, setError] = useState<Error | null>(null)
    const [isUploaded, setIsUploaded] = useState<boolean>(false)

    const router = useRouter()

    const props = useSupabaseUpload({
        bucketName: 'payment',
        path: `${roomId}/${matchData.id}/${playerId}`,
        allowedMimeTypes: ['image/*'],
        maxFiles: 1,
        maxFileSize: 1000 * 1000 * 5, // 5MB,
    })

    useEffect(() => {
        const { acceptedFiles, isSuccess } = props
        if (acceptedFiles[0] && isSuccess) {
            if (acceptedFiles[0].path) {

                async function syncReceiptWithDatabase() {
                    const fileName = String(acceptedFiles[0].path).slice(2) /* Removing ./ */
                    const supabase = createClient()
                    const { error } = await supabase
                        .from('match_players')
                        .update({file_name: fileName})
                        .eq('match', matchData.id)
                        .eq('player', playerId)

                    if(error) {
                        setError(error)
                        return
                    }
                    
                    setError(null)
                    setIsUploaded(true)
                    router.refresh()
                }

                if(!isUploaded) {
                    syncReceiptWithDatabase()
                }

            }
        }
    }, [props])

    return (
        <div className="w-full px-4 sm:px-0">
            {
                error &&
                <p className='text-red-500 text-sm'>{error.message}</p>
            }
            <p></p>
            <Dropzone {...props} className="bg-(--color-pale) dark:bg-(--color-dark-pale)">
                <DropzoneEmptyState />
                <DropzoneContent />
            </Dropzone>
        </div>
    )
}