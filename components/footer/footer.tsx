import { Suspense } from "react";
import DateYear from "./date-year";

export default function Footer() {
    return (
        <footer className='p-4 text-center font-bold bg-(--color-banner) relative z-1 h-(--footer-height) dark:bg-(--color-dark-banner)'>
            <Suspense fallback={<p>Skorbot</p>}>
                <DateYear />
            </Suspense>
        </footer>
    )
}