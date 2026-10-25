"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AuthState } from "@/app/auth/actions";
import { isDeleteConfirmed } from "@/lib/delete-confirm";
import { createClient } from "@/lib/supabase/server";

export async function deleteAccount(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", data.claims.sub)
    .maybeSingle();

  const typed = String(formData.get("confirm") ?? "");
  if (!isDeleteConfirmed(typed, profile?.username ?? null)) {
    return { error: "That doesn't match. Nothing was deleted." };
  }

  const { error } = await supabase.rpc("delete_own_account");
  if (error) {
    console.error("[account] delete failed:", error.message);
    return { error: "Couldn't delete your account, try again." };
  }

  // user is gone on the server, just clear the cookies here
  await supabase.auth.signOut({ scope: "local" });

  revalidatePath("/", "layout");
  redirect("/signup");
}
