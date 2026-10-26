import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./reset-password-form";

// you get here from the reset email link, which logs you in first
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/forgot-password");

  return (
    <main className="flex max-w-sm flex-col gap-4 p-6">
      <h1 className="text-2xl">Choose a new password</h1>
      <ResetPasswordForm />
    </main>
  );
}
