import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// only allow relative paths so ?next= can't send people to another site
export function safeNext(next: FormDataEntryValue | string | null | undefined) {
  if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/";
}

// use at the top of every admin page (proxy.ts only checks that you're logged in)
export async function requireAdmin() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login?next=/admin");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) notFound();

  return { supabase, claims: data.claims };
}
