import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(value: unknown, min: number, max: number) {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: unknown;
      email?: unknown;
      subject?: unknown;
      message?: unknown;
      website?: unknown;
    };

    if (typeof body.website === "string" && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!validateField(body.name, 2, 120)) {
      return NextResponse.json({ error: "Please provide a valid name." }, { status: 400 });
    }

    if (typeof body.email !== "string" || !EMAIL_REGEX.test(body.email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!validateField(body.subject, 3, 200)) {
      return NextResponse.json({ error: "Please provide a valid subject." }, { status: 400 });
    }

    if (!validateField(body.message, 10, 5000)) {
      return NextResponse.json({ error: "Please provide a message between 10 and 5000 characters." }, { status: 400 });
    }

    const name = String(body.name).trim();
    const email = String(body.email).trim().toLowerCase();
    const subject = String(body.subject).trim();
    const message = String(body.message).trim();

    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("contact_submissions").insert({
      name,
      email,
      subject,
      message,
      status: "new",
    });

    if (error) {
      console.error("Failed to store contact submission", error);
      return NextResponse.json({ error: "Could not send message right now." }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Contact API error", error);
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }
}
