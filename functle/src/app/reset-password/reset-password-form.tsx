"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/auth/actions";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label>
        New password
        <input
          className="block w-full border p-2"
          name="password"
          type="password"
          required
          minLength={6}
        />
      </label>
      <label>
        Confirm new password
        <input
          className="block w-full border p-2"
          name="confirm"
          type="password"
          required
          minLength={6}
        />
      </label>
      {state?.error && <p role="alert">{state.error}</p>}
      <button type="submit" className="self-start border p-2" disabled={pending}>
        {pending ? "Saving..." : "Save password"}
      </button>
    </form>
  );
}
