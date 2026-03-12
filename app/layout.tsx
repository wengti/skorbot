import "./globals.css";
import { ReactNode } from "react";
import { Lato } from 'next/font/google'
import Header from "@/components/header/header";
import Image from "next/image";
import DarkModeContextProvider from "@/context/dark-mode-context-provider";
import Footer from "@/components/footer/footer";
import Body from "@/components/body/body";
import Script from "next/script";
import FbHashFix from "@/components/body/fb-hash-fix";

const lato = Lato({
    subsets: ['latin'],
    weight: ['100', '300', '400', '700', '900'],
    variable: '--lato',
    display: 'swap'
})

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en" className={lato.variable}>
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
                            className='absolute top-2/5 left-0 z-0 hidden lg:block'
                        />
                    </main>
                    <Footer />
                </Body>
            </DarkModeContextProvider>

        </html>
    );
}
