import { SupabaseClient } from "@supabase/supabase-js"

export const defaultRoomPictures = [
    '/images/room_1_orange_blue_purple.png',
    '/images/room_2_red_green_blue.png',
    '/images/room_3_purple_orange_red.png',

]

export function getARoomProfilePicture() {
    const randIdx = Math.floor(Math.random() * defaultRoomPictures.length)
    return defaultRoomPictures[randIdx]
}

export function getARoomProfilePictureLink(supabase: SupabaseClient<any, "public", "public", any, any>, roomOwner:string, roomPicture:string ){
    let roomPictureLink = roomPicture
    if (!defaultRoomPictures.includes(roomPicture)) {
        const { data: roomPictureData } = supabase.storage.from('room-pictures').getPublicUrl(`${roomOwner}/${roomPicture}`)
        roomPictureLink = roomPictureData.publicUrl
    }
    return roomPictureLink
}