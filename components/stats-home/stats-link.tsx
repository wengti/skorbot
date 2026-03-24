'use client'
import { JSX } from "react";
import UserLayoutListItem from "../user-layout/user-layout-list-item";
import { useClientUserContext } from "@/context/client-user-context-provider";
import { MdOutlineQueryStats } from "react-icons/md";

export default function StatsLink() {

    const currentUser = useClientUserContext()

    return (
        <UserLayoutListItem href={`/user/stats/${currentUser.id}`} icon={<MdOutlineQueryStats />}>
            Your Stats
        </UserLayoutListItem>
    )
}