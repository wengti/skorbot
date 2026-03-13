'use client'
import Link from "next/link";
import HeaderLogoutBtn from "../header/header-auth-btn/header-logout-btn";
import { ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";

function MenuItem({ children, href = null }: { children: ReactNode, href?: string | null }) {

    let menuItemClsName = 'hover:bg-(--color-pale) dark:hover:bg-(--color-dark-pale) pl-2 mr-2 py-1 rounded-lg font-bold'

    if (href) {
        const pathname = usePathname()
        if (href !== null && pathname.startsWith(href)) menuItemClsName += ' underline'

        return (
            <li className={menuItemClsName}>
                <Link href={href} className="block w-full">
                    {children}
                </Link>
            </li>
        )
    }
    else {
        return (
            <li className={menuItemClsName}>
                {children}
            </li>
        )
    }
}

export default function Menu() {
    return (
        <nav className='bg-(--color-banner) dark:bg-(--color-dark-banner) absolute top-15 w-50 -right-2 sm:-right-12 md:-right-12 pl-4 pb-4 rounded-bl-xl'>
            <ul className='flex flex-col justify-center pt-2'>
                <MenuItem href='/private'>Private</MenuItem>
                <MenuItem><HeaderLogoutBtn /></MenuItem>
            </ul>
        </nav>
    )
}