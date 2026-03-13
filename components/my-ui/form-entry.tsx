import { ReactNode } from "react";

export default function FormEntry({ children, index }: { children: ReactNode, index: number }) {
    return (
        <div className='min-h-30 relative flex flex-col justify-center '>
            <div className='text-9xl font-extrabold absolute h-full flex text-(--color-highlight) z-1 opacity-25 sm:-left-12'>
                {index}
            </div>
            <div className='flex flex-col justify-center z-2'>
                {children}
            </div>
        </div>
    )
}