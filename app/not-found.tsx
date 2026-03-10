import Button from "@/components/my-ui/button";
import Image from "next/image";
import Link from "next/link";

export default function GeneralNotFound() {
    return (
        <section className='flex flex-col items-center my-auto'>

            <Image
                src='/images/mascot_404.png'
                alt='A confused-looking Skorbot.'
                height={437}
                width={249}
                className='w-40'
            />
            <div className='flex flex-col items-center gap-4 mb-4'>
                <h1 className='text-4xl font-extrabold text-center text-(--color-highlight)'>
                    404 Page Not Found
                </h1>
                <Link href='/'>
                    <Button size='sm'>
                        Back to Home
                    </Button>
                </Link>
            </div>
            
        </section>
    )
}