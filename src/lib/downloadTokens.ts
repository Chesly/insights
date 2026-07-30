import { createServiceClient } from "./supabase/service";

function randomToken(): string {
  // URL-safe, short enough to be a clean link, long enough not to be
  // guessable by brute force within its lifetime.
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 36).toString(36)).join("");
}

export async function createDownloadToken({
  downloadId,
  email,
  orderId,
  maxUses,
  expiresInDays,
}: {
  downloadId: string;
  email: string;
  orderId?: string | null;
  maxUses: number;
  expiresInDays: number;
}): Promise<string> {
  const supabase = createServiceClient();
  const token = randomToken();
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from("download_tokens").insert({
    token,
    download_id: downloadId,
    order_id: orderId ?? null,
    email,
    max_uses: maxUses,
    expires_at: expiresAt,
  });
  if (error) throw new Error(error.message);

  return token;
}

/** Free downloads: generous — this isn't a piracy-prevention control,
    it's just "don't hand out the raw file URL." */
export const FREE_TOKEN_CONFIG = { maxUses: 5, expiresInDays: 30 };

/** Paid downloads: tighter, but still forgiving of a genuine re-download. */
export const PAID_TOKEN_CONFIG = { maxUses: 5, expiresInDays: 7 };
