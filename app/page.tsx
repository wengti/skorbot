import Button from "@/components/my-ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HeroPage() {
    return (
        <section className='mx-auto grow md:flex md:flex-row-reverse md:justify-center md:items-center'>
            <div>
                <Image 
                    width={595}
                    height={500}
                    alt='Greeting by the mascot, skorbot asking whether you are interested to setup a new game.'
                    src='/images/mascot_bubble.gif'
                    className='w-11/12 max-w-100 mx-auto md:w-100'
                    unoptimized
                />
            </div>
            <div className='text-shadow-xs'>
                <h1 className='text-4xl leading-12 font-extrabold text-left text-(--color-highlight)'>
                    Manage Your Game Sessions With Ease!
                </h1>
                <div className='my-4'>
                    <p className='font-semibold text-2xl'><span className='text-(--color-highlight)'>Arrange</span> matchups.</p>
                    <p className='font-semibold text-2xl'><span className='text-(--color-highlight)'>Track</span> score.</p>
                    <p className='font-semibold text-2xl'><span className='text-(--color-highlight)'>Monitor</span> payment.</p>
                </div>
                <div className='pb-4'>
                    <Link href='/'>
                        <Button size='md'>
                            Get Started Now!
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
