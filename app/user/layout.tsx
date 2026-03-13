import { List } from "@/components/tailgrids/core/list";
import UserLayoutListItem from "@/components/user-layout/user-layout-list-item";
import { ReactNode } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineQueryStats } from "react-icons/md";


export default function UserLayout({ children }: { children: ReactNode }) {

    return (
        <>
            <List
                hideDividers={true}
                direction='horizontal'
                className='
                    mt-4 mb-6 font-bold text-sm bg-(--color-banner) dark:bg-(--color-dark-banner) 
                    text-black dark:text-(--color-dark-text) [&>li]:data-[active=true]:bg-(--color-highlight) 
                    [&>li]:data-[active=true]:text-black [&>li]:hover:bg-(--color-highlight) [&>li]:hover:text-black
                    dark:border-(--color-dark-border)
                    '
            >
                <UserLayoutListItem href='/user/rooms' icon={<FaUserGroup />}>Rooms</UserLayoutListItem>
                <UserLayoutListItem href='/user/stats' icon={<MdOutlineQueryStats />}>Stats</UserLayoutListItem>
            </List>
            {children}
        </>
    )
}