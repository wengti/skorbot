import "./globals.css";
import { ReactNode } from "react";
import { Lato } from 'next/font/google'

const lato = Lato({
    subsets: ['latin'],
    weight: ['100', '300', '400', '700', '900'],
    variable: '--lato',
    display: 'swap'
})

export default function RootLayout({children}: Readonly<{children: ReactNode}>) {
  return (
    <html lang="en"  className={lato.variable}>
      <body className='text-4xl font-extrabold'>
          {children}
      </body>
    </html>
  );
}
