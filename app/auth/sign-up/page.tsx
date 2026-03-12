import { SignUpForm } from "@/components/auth/sign-up-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Sign-up',
    description: "The sign-up page for Skorbot."
}

export default function Page() {
    return (
        <div className="">
            <div className='w-85 my-8'>
                <SignUpForm />
            </div>
        </div>
    );
}
