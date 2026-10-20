import { SignOutButton } from "@/components/sign-out-button";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPage() {
  const { claims } = await requireAdmin();

  return (
    <main className="flex max-w-xl flex-col gap-4 p-6">
      <h1 className="text-2xl">Admin</h1>
      <p>Signed in as {claims.email}</p>
      {/* TODO: puzzle management */}
      <SignOutButton />
    </main>
  );
}
