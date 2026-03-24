import { JSX } from "react";

export default function StatsBadge({children, title, subtitle}: {title: string, children: JSX.Element, subtitle: string}) {

    return (
        <div className='rounded-xl bg-(--color-pale) dark:bg-(--color-dark-pale) p-2 h-35 flex flex-col grow min-w-40'>
            <p className='font-bold text-black dark:text-(--color-dark-text) text-sm'>
                {title}
            </p>
            <div className='font-bold text-black dark:text-(--color-dark-text) text-4xl my-2 grow flex items-center justify-center'>
                {children}
            </div>
            <p className='text-slate-500 dark:text-gray-500 text-xs font-bold text-right sm:text-sm'>
                {subtitle}
            </p>
        </div>
    )
}