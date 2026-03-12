import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export default function Page() {
  return (
    <div className="flex items-center">
      <div className="flex justify-center items-center w-85 h-100">
        <UpdatePasswordForm className='mt-10'/>
      </div>
    </div>
  );
}
