import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "waste-photos";
const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadEcopickPhoto(
  db: SupabaseClient,
  userId: string,
  transactionId: number,
  file: File,
): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran foto maksimal 10MB.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${transactionId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await db.storage
    .from(BUCKET)
    .upload(path, file, {
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = db.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
