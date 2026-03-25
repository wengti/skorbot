'use client'
import Link from "next/link";
import HeaderLogoutBtn from "../header/header-auth-btn/header-logout-btn";
import { JSX, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineQueryStats } from "react-icons/md";

function MenuItem({ children, href = null, icon=null }: { children: ReactNode, href?: string | null, icon?: JSX.Element | null }) {

    let menuItemClsName = 'hover:bg-(--color-pale) dark:hover:bg-(--color-dark-pale) active:bg-(--color-pale) dark:active:bg-(--color-dark-pale) pl-2 mr-2 py-1 rounded-lg font-bold'

    if (href && icon) {
        const pathname = usePathname()
        if (href !== null && pathname.startsWith(href)) menuItemClsName += ' underline'

        return (
            <li className={menuItemClsName}>
                <Link href={href} className="flex w-full gap-2 items-center">
                    {icon}
                    <p>{children}</p>
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

export default function Menu({userId}: {userId: string | undefined}) {
    return (
        <nav className='bg-(--color-banner) dark:bg-(--color-dark-banner) absolute top-15.5 w-50 -right-2 sm:-right-12 md:-right-12 pl-4 pb-4 rounded-bl-xl border-l border-b'>
            <ul className='flex flex-col justify-center pt-2'>
                <MenuItem href='/user/rooms' icon={<FaUserGroup />}>Rooms</MenuItem>
                <MenuItem href={`/user/stats/${userId}`} icon={<MdOutlineQueryStats />}>Stats</MenuItem>
                <MenuItem ><HeaderLogoutBtn /></MenuItem>
            </ul>
        </nav>
    )
}