"use client";

import { useActionState } from "react";
import { signup } from "@/app/auth/actions";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, undefined);

  if (state?.message) return <p>{state.message}</p>;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label>
        Username
        <input
          className="block w-full border p-2"
          name="username"
          required
          minLength={3}
          maxLength={24}
          pattern="[a-zA-Z0-9_]+"
        />
      </label>
      <label>
        Email
        <input className="block w-full border p-2" name="email" type="email" required />
      </label>
      <label>
        Password
        <input
          className="block w-full border p-2"
          name="password"
          type="password"
          required
          minLength={6}
        />
      </label>
      {state?.error && <p role="alert">{state.error}</p>}
      <button type="submit" className="self-start border p-2" disabled={pending}>
        {pending ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
