import Image from "next/image";
import Link from "next/link";
import DarkModeToggle from "./dark-mode-toggle";
import HeaderAuthBtn from "./header-auth-btn/header-auth-btn";

export default async function Header() {

    return (
        <header className="bg-(--color-banner) dark:bg-(--color-dark-banner) p-2 h-(--header-height) sm:px-12 md:relative top-0 z-3 sticky">
            <nav className='flex justify-between items-center list-none'>
                <li>
                    <Link href='/'>
                        <Image
                            src='/images/skorbot_logo.png'
                            width={258}
                            height={90}
                            alt='The logo of the site with its mascot standing next to it'
                        />
                    </Link>
                </li>
                <div className='flex items-center gap-4'>
                    <li>
                        <DarkModeToggle />
                    </li>
                    <li>
                        <HeaderAuthBtn />
                    </li>
                </div>
            </nav>
        </header>
    )

}