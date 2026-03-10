import Image from "next/image";
import Link from "next/link";
import Button from "./my-ui/button";
import DarkModeToggle from "./dark-mode-toggle";

export default function Header(){

    return (
        <header className="bg-(--color-banner) dark:bg-(--color-dark-banner) p-2 relative z-1 h-(--header-height) sm:px-12">
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
                        <Link href='/auth/login'>
                            <Button size='sm'>Login</Button>
                        </Link>
                    </li>
                </div>
            </nav>
        </header>
    )
}