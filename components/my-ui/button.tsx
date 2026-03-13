import clsx from "clsx"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type ButtonPropsType = {
    children: ReactNode
    size: 'sm' | 'md' | 'lg' 
    className?: string
}

export default function Button({children, size='sm', className = ''}: ButtonPropsType){
    
    const buttonCls = twMerge(clsx({
        'py-2 px-4 bg-(--color-highlight) rounded-xl font-semibold border border-(--color-border) dark:border-(--color-dark-border) size-fit hover:cursor-pointer': true,
        [className]: className !== '',
        'text-2xl font-extrabold py-3 px-5': size === 'md',
        'text-3xl font-extrabold py-4 px-6': size === 'lg'
    }))


    return (
        <div className={buttonCls}>
            {children}
        </div>
    )
}