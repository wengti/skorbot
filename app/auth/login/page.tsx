import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Login',
    description: "The login page for Skorbot."
}


export default function Page() {
    return (
        <div className="">
            <div className="">
                <LoginForm className="rounded-xl w-85"/>
            </div>
        </div>
    );
}
