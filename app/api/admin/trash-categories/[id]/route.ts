import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

async function verifyAdmin() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { supabase };
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const categoryId = Number(params.id);
  if (!Number.isFinite(categoryId) || categoryId <= 0) {
    return NextResponse.json({ error: "ID kategori tidak valid" }, { status: 400 });
  }

  const auth = await verifyAdmin();
  if ("error" in auth && auth.error) return auth.error;

  const adminClient = createAdminSupabaseClient();
  const db = adminClient ?? auth.supabase!;

  // Lepaskan referensi kategori dari transaksi historis agar kategori bisa dihapus
  const { error: unlinkError } = await db
    .from("transactions")
    .update({ trash_category_id: null })
    .eq("trash_category_id", categoryId);

  if (unlinkError) {
    return NextResponse.json({ error: unlinkError.message }, { status: 500 });
  }

  const { data, error } = await db
    .from("trash_categories")
    .delete()
    .eq("id", categoryId)
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data?.length) {
    return NextResponse.json(
      {
        error:
          "Gagal menghapus kategori. Pastikan akun admin memiliki izin DELETE pada tabel trash_categories.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json({ success: true });
}
