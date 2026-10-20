"use client";

import { useActionState } from "react";
import { login } from "@/app/auth/actions";

export function LoginForm({ next, linkError }: { next?: string; linkError?: boolean }) {
  const [state, formAction, pending] = useActionState(login, undefined);
  const error = state?.error ?? (linkError ? "That link is invalid or expired." : undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next ?? "/"} />
      <label>
        Email
        <input className="block w-full border p-2" name="email" type="email" required />
      </label>
      <label>
        Password
        <input className="block w-full border p-2" name="password" type="password" required />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" className="self-start border p-2" disabled={pending}>
        {pending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
