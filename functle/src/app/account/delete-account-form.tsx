"use client";

import { useActionState } from "react";
import { deleteAccount } from "./actions";

export function DeleteAccountForm({ username }: { username: string | null }) {
  const [state, formAction, pending] = useActionState(deleteAccount, undefined);
  const word = username ?? "delete";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p>
        This deletes your account and all your attempts. It can&apos;t be undone. Type{" "}
        <strong>{word}</strong> to confirm.
      </p>
      <input className="block w-full border p-2" name="confirm" autoComplete="off" required />
      {state?.error && <p role="alert">{state.error}</p>}
      <button type="submit" className="self-start border p-2" disabled={pending}>
        {pending ? "Deleting..." : "Delete my account"}
      </button>
    </form>
  );
}
