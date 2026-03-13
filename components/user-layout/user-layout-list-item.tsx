'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, ReactNode } from "react";

export default function UserLayoutListItem({children, href, icon}: {children: ReactNode, href: string, icon: JSX.Element}){

    const pathname = usePathname()
    const dataActive = pathname.startsWith(href) ? 'true' : 'false'

    return (
        <li data-active={dataActive}>
            <Link href={href} className='flex gap-2 justify-center items-center'>
                {icon}
                <p>{children}</p>
            </Link>
        </li>
    )
}