import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function Page() {
  return (
    <div className="flex items-center">
      <div className="flex items-center w-85 h-100">
        <ForgotPasswordForm className='mt-10'/>
      </div>
    </div>
  );
}
