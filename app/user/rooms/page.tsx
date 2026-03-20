import Button from "@/components/my-ui/button";
import RoomCardSection from "@/components/room-card/room-card-section";
import Link from "next/link";
import { BsClipboard2PlusFill } from "react-icons/bs";

export default function RoomsPage() {

    return (
        <>
            {/* Add Room Button */}
            <section className='w-fit'>
                <Link href='/user/rooms/add-room' >
                    <Button
                        size='sm'
                        className='mt-2 flex gap-2 justify-center items-center bg-(--color-pale) dark:bg-(--color-dark-pale) hover:bg-(--color-highlight) active:bg-(--color-highlight) hover:text-black active:text-black'
                    >
                        <BsClipboard2PlusFill />
                        <p>Add a new room</p>
                    </Button>
                </Link>
            </section>

            {/* Hosted Room */}
            <RoomCardSection isOwner={true} />

            {/* Joined Room */}
            <RoomCardSection isOwner={false} />
        </>
    )
}