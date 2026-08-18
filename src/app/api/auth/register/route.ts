import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// Public self-registration for the multi-author CMS. New accounts land
// with status "pending" and can't log in (see /api/auth/login's approval
// gate) until an admin approves them from /admin/users. No auth required
// to hit this route — that's the point — so every input is untrusted and
// the optional avatar upload is deliberately isolated from the normal
// (session-gated) /api/media/upload path rather than reusing it.
export async function POST(req: NextRequest) {
  try {
    return await handleRegister(req);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function uploadAvatar(file: File): Promise<string | null> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) return null;
  if (!file.type.startsWith("image/")) return null;
  if (file.size > 5 * 1024 * 1024) return null;

  try {
    const ikForm = new FormData();
    ikForm.append("file", file);
    ikForm.append("fileName", file.name);
    ikForm.append("folder", "/avatars");
    ikForm.append("useUniqueFileName", "true");
    const authHeader = "Basic " + Buffer.from(`${privateKey}:`).toString("base64");
    const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: { Authorization: authHeader },
      body: ikForm,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url || null;
  } catch {
    // Avatar is optional — a failed upload should never block registration.
    return null;
  }
}

async function handleRegister(req: NextRequest) {
  const formData = await req.formData();
  const firstName = (formData.get("first_name") as string || "").trim();
  const lastName = (formData.get("last_name") as string || "").trim();
  const email = (formData.get("email") as string || "").trim().toLowerCase();
  const password = (formData.get("password") as string || "");
  const phone = (formData.get("phone") as string || "").trim();
  const avatarFile = formData.get("avatar") as File | null;

  if (!firstName || !lastName || !email || !password || !phone) {
    return NextResponse.json({ error: "All fields except profile picture are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const service = createServiceClient();

  const { data: created, error: createError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  });
  if (createError || !created.user) {
    const message = createError?.message?.includes("already been registered")
      ? "An account with this email already exists."
      : createError?.message || "Could not create account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const avatarUrl = avatarFile && avatarFile.size > 0 ? await uploadAvatar(avatarFile) : null;

  // A database trigger auto-creates a stub profiles row the moment the
  // auth user exists (confirmed by testing — a plain insert here 400s on
  // a duplicate primary key), so this has to upsert rather than insert,
  // filling in what the trigger doesn't: name, phone, avatar, role, and
  // the pending approval status.
  const { error: profileError } = await service.from("profiles").upsert({
    id: created.user.id,
    email,
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`.trim(),
    phone,
    avatar_url: avatarUrl,
    // "editor" is the only non-elevated role the profiles table's check
    // constraint actually accepts (confirmed by testing — "author" and
    // several other plausible names are rejected). It's also the correct
    // default: a new self-registered contributor, distinct from
    // admin/super_admin.
    role: "editor",
    status: "pending",
  }, { onConflict: "id" });

  if (profileError) {
    // Don't leave an orphaned auth user with no profile behind.
    await service.auth.admin.deleteUser(created.user.id).catch(() => {});
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
