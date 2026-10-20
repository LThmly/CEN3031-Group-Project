import { signOut } from "@/app/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="border p-2">
        Sign out
      </button>
    </form>
  );
}
