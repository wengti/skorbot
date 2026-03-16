import Image from "next/image";

export default function CustomAvatar({id, name, picture}: {id: string, name: string, picture: string}) {
    return (
        <div key={id} className='flex gap-2 items-center bg-(--color-pale) dark:bg-(--color-dark-pale) w-fit px-3 py-1 rounded-full'>
            <div>
                <Image
                    height={32}
                    width={32}
                    src={picture}
                    alt={`${name}'s profile picture.`}
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                />
            </div>
            <div>{name}</div>
        </div>
    )
}