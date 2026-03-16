'use client'

import { useSupabaseUpload } from "@/lib/hooks/use-supabase-upload"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./dropzone"
import { Dispatch, SetStateAction, useEffect } from "react"

type RoomPictursUploadZonePropsType = {
    ownerId: string
    setRoomPicture: Dispatch<SetStateAction<string>>
    isPending: boolean
}

export default function RoomPictursUploadZone({ ownerId, setRoomPicture, isPending }: RoomPictursUploadZonePropsType) {
    const props = useSupabaseUpload({
        bucketName: 'room-pictures',
        path: ownerId,
        allowedMimeTypes: ['image/*'],
        maxFiles: 1,
        maxFileSize: 1000 * 1000 * 5, // 5MB,
    })

    useEffect(() => {
        const { acceptedFiles, isSuccess } = props
        if (acceptedFiles[0] && isSuccess && !isPending) {
            if (acceptedFiles[0].path) {
                const fileName = String(acceptedFiles[0].path.slice(2)) /* Removing ./ */
                setRoomPicture(fileName)
            }
        }

    }, [props])

    return (
        <div className="w-full px-4 sm:px-0">
            <Dropzone {...props} className="bg-(--color-pale) dark:bg-(--color-dark-pale)">
                <DropzoneEmptyState />
                <DropzoneContent />
            </Dropzone>
        </div>
    )
}