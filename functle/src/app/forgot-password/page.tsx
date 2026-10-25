import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="flex max-w-sm flex-col gap-4 p-6">
      <h1 className="text-2xl">Reset your password</h1>
      <ForgotPasswordForm />
      <p>
        <Link href="/login" className="underline">
          Back to log in
        </Link>
      </p>
    </main>
  );
}
