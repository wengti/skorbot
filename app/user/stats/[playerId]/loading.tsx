import Image from "next/image";

export default function StatsLoading() {
    return (
        <div className='flex flex-col grow justify-center items-center h-full'>
            <Image
                src='/images/mascot.gif'
                height={500}
                width={400}
                alt='The skorbot is wandering around, waiting to load the fetch the page.'
                className='h-50 w-50'
            />
            <p>Loading...</p>
        </div>
    )
}