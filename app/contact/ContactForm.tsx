"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Your message could not be sent.");
      }
      form.reset();
      setStatus({
        type: "success",
        message: "Thank you. Your message has been received.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Your message could not be sent.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="contact-form__grid">
        <label>
          <span>Name *</span>
          <input name="name" required maxLength={120} />
        </label>
        <label>
          <span>Email *</span>
          <input
            name="email"
            required
            type="email"
            inputMode="email"
            maxLength={180}
          />
        </label>
        <label>
          <span>Phone or WhatsApp</span>
          <input name="phone" type="tel" maxLength={60} />
        </label>
        <label>
          <span>Subject *</span>
          <input name="subject" required maxLength={160} />
        </label>
      </div>
      <label>
        <span>Message *</span>
        <textarea name="message" required rows={6} maxLength={5000} />
      </label>
      <label className="contact-form__trap" aria-hidden="true">
        <span>Website</span>
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button className="button button--gold" disabled={busy} type="submit">
        {busy ? "Sending…" : "Send message"}
      </button>
      {status && (
        <p
          className={`contact-form__status contact-form__status--${status.type}`}
          role="status"
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
