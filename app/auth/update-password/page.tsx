import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Update Password',
    description: "The update password page for Skorbot, the user is redirected here after clicking the link sent to their email for resetting password."
}

export default function Page() {
  return (
    <div className="flex items-center">
      <div className="flex justify-center items-center w-85 h-100">
        <UpdatePasswordForm className='mt-10'/>
      </div>
    </div>
  );
}
