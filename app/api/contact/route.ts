import { saveContactSubmission } from "@/lib/supabase-cms";

export const dynamic = "force-dynamic";

function text(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    if (text(payload.website, 100)) {
      return Response.json({ ok: true });
    }

    const submission = {
      name: text(payload.name, 120),
      email: text(payload.email, 180).toLowerCase(),
      phone: text(payload.phone, 60),
      subject: text(payload.subject, 160),
      message: text(payload.message, 5000),
    };
    if (
      !submission.name ||
      !submission.subject ||
      !submission.message ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)
    ) {
      return Response.json(
        { error: "Please complete all required fields." },
        { status: 400 },
      );
    }

    await saveContactSubmission(submission);
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Your message could not be sent.",
      },
      { status: 400 },
    );
  }
}
