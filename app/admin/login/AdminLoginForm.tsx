"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Sign in failed.");
      }
      router.replace("/admin");
      router.refresh();
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : "Sign in failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={signIn}>
      <label className="admin-field">
        <span>Admin email</span>
        <input
          autoComplete="email"
          inputMode="email"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>Password</span>
        <input
          autoComplete="current-password"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {error && <p className="admin-login-error">{error}</p>}
      <button
        className="admin-button admin-button--primary"
        disabled={busy}
        type="submit"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
