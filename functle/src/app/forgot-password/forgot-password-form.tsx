"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/app/auth/actions";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, undefined);

  if (state?.message) return <p>{state.message}</p>;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label>
        Email
        <input className="block w-full border p-2" name="email" type="email" required />
      </label>
      {state?.error && <p role="alert">{state.error}</p>}
      <button type="submit" className="self-start border p-2" disabled={pending}>
        {pending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
