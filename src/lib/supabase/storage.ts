import { createClient } from "@/lib/supabase/client";
import { getSupabaseMediaBucket } from "@/lib/supabase/env";

export async function uploadAdminImage(file: File, folder: "blog" | "projects" | "research") {
  const supabase = createClient();
  const extension = file.name.split(".").pop() || "jpg";
  const filePath = `${folder}/${crypto.randomUUID()}.${extension}`;
  const bucket = getSupabaseMediaBucket();

  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
