import "./globals.css";
import { ReactNode } from "react";
import { Lato } from 'next/font/google'
import Header from "@/components/header/header";
import Image from "next/image";
import DarkModeContextProvider from "@/context/dark-mode-context-provider";
import Footer from "@/components/footer/footer";
import Body from "@/components/body/body";
import FbHashFix from "@/components/body/fb-hash-fix";
import { Metadata } from "next";

const lato = Lato({
    subsets: ['latin'],
    weight: ['100', '300', '400', '700', '900'],
    variable: '--lato',
    display: 'swap'
})

export const metadata: Metadata = {
    title: {
        template: '%s | Skorbot',
        default: 'Skorbot'
    },
    description: 'The landing page for Skorbot, a simple web app designed to arrange matchups, track score and monitor payment for self-arranged pickleball sessions.',
    keywords: ['Next.js ', 'Pickleball ', 'Scoreboard ', 'Arrange Matchups ', 'Track Score ', 'Monitor Payment ', 'Skorbot ']
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" className={lato.variable}>
            <head>
                <link rel='icon' href='/images/mascot_static.png' type='image/png' />
            </head>
            <DarkModeContextProvider>
                <Body>
                    <FbHashFix /> 
                    <Header />
                    <main className='px-4 relative min-h-(--min-content-height) flex flex-col sm:px-12 overflow-hidden'>
                        <Image
                            alt='A background image on the top right'
                            src='/images/tr_props.png'
                            height={520}
                            width={520}
                            loading='eager'
                            className='absolute -top-1/5 right-0 z-0'
                        />
                        <div className='z-1 relative flex flex-col grow'>
                            {children}
                        </div>
                        <Image
                            alt='A background image on the bottom left'
                            src='/images/bl_props.png'
                            height={520}
                            width={520}
                            loading='eager'
                            className='absolute top-2/5 left-0 z-0 hidden lg:block'
                        />
                    </main>
                    <Footer />
                </Body>
            </DarkModeContextProvider>

        </html>
    );
}
