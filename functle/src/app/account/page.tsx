import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { createClient } from "@/lib/supabase/server";
import { DeleteAccountForm } from "./delete-account-form";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", data.claims.sub)
    .maybeSingle();

  return (
    <main className="flex max-w-sm flex-col gap-4 p-6">
      <h1 className="text-2xl">Account</h1>
      <p>Username: {profile?.username ?? "-"}</p>
      <p>Email: {data.claims.email}</p>
      <SignOutButton />

      <h2 className="mt-6 text-xl">Delete account</h2>
      <DeleteAccountForm username={profile?.username ?? null} />
    </main>
  );
}
