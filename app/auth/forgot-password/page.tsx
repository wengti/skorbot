import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Forgot Password',
    description: "The forgot password page for Skorbot, allowing the user to enter their email address used to sign up to receive a email to reset the password."
}

export default function Page() {
  return (
    <div className="flex items-center">
      <div className="flex items-center w-85 h-100">
        <ForgotPasswordForm className='mt-10'/>
      </div>
    </div>
  );
}
