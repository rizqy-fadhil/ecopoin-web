import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const admin = createAdminSupabaseClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Server belum dikonfigurasi (SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 500 },
    );
  }

  const body = await request.json();
  const email = String(body.email || "").trim();
  const password = String(body.password || "");
  const fullName = String(body.fullName || "").trim();
  const phoneNumber = String(body.phoneNumber || "").trim();

  if (!email || !password || !fullName || !phoneNumber) {
    return NextResponse.json(
      { error: "Semua field wajib diisi." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Kata sandi minimal 8 karakter." },
      { status: 400 },
    );
  }

  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone_number: phoneNumber,
      },
    });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message || "Gagal membuat akun." },
      { status: 400 },
    );
  }

  const userId = authData.user.id;

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: userId,
      full_name: fullName,
      phone_number: phoneNumber,
      email,
      role: "user",
      total_points: 0,
    },
    { onConflict: "id" },
  );

  if (profileError) {
    await admin.auth.admin.deleteUser(userId);
    return NextResponse.json(
      { error: `Gagal menyimpan profil: ${profileError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
