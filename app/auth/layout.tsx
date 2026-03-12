import Image from "next/image";
import { ReactNode } from "react";

type AuthLayout = {
    children: ReactNode
}


export default function AuthLayout({children}: AuthLayout){
    return (
        <section className='grow flex justify-center items-center'>
            <Image
                src='/images/mascot.gif'
                alt='Skorbot looking to see if you need any help with login'
                width={400}
                height={500}
                unoptimized
                className='hidden md:block w-80'
            />
            {children}
        </section>
    )
}