import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

// Generate EDP reference: EDP-DDMMYY-XXXX
function generateReferenceNumber() {
  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");
  const d = new Date();
  const dd = pad(d.getDate());
  const mm = pad(d.getMonth() + 1);
  const yy = d.getFullYear().toString().slice(-2);
  const rand = pad(Math.floor(1000 + Math.random() * 9000), 4);
  return `EDP-${dd}${mm}${yy}-${rand}`;
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const adminClient = createAdminSupabaseClient();
  const db = adminClient ?? supabase;

  // 1. Auth check
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse form data
  const formData = await request.formData();

  const trashCategoryId = Number(formData.get("trash_category_id"));
  const weight = Number(formData.get("weight"));
  const locationAddress = String(formData.get("location_address") || "").trim();
  const pickupDatetime = String(formData.get("pickup_datetime") || "");
  const notes = String(formData.get("notes") || "");

  // 3. Validate required fields
  if (
    !Number.isFinite(trashCategoryId) ||
    trashCategoryId <= 0 ||
    !Number.isFinite(weight) ||
    weight <= 0 ||
    !pickupDatetime
  ) {
    return NextResponse.json(
      { error: "Data setoran tidak lengkap atau tidak valid." },
      { status: 400 },
    );
  }

  // 4. Calculate total_points SERVER-SIDE from database
  const { data: category, error: catError } = await db
    .from("trash_categories")
    .select("point_per_unit")
    .eq("id", trashCategoryId)
    .single();

  if (catError || !category) {
    return NextResponse.json(
      { error: "Kategori sampah tidak ditemukan." },
      { status: 400 },
    );
  }

  const totalPoints = Math.round(weight * Number(category.point_per_unit));

  // 5. Generate reference number SERVER-SIDE
  const referenceNumber = generateReferenceNumber();

  // 6. Handle photo upload
  const photo = formData.get("photo");
  const photoFile =
    photo instanceof File && photo.size > 0 ? photo : null;

  let photoUrl: string | null = null;

  if (photoFile) {
    // Validate file
    if (photoFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran foto maksimal 10MB." },
        { status: 400 },
      );
    }
    if (!photoFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File harus berupa gambar." },
        { status: 400 },
      );
    }

    const ext = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/ecodrop-${Date.now()}.${ext}`;

    const { error: uploadError } = await db.storage
      .from("waste-photos")
      .upload(path, photoFile, {
        upsert: false,
        contentType: photoFile.type,
      });

    if (!uploadError) {
      const { data: urlData } = db.storage.from("waste-photos").getPublicUrl(path);
      photoUrl = urlData.publicUrl;
    }
    // Photo is optional — continue even if upload fails
  }

  // 7. Insert transaction
  const { data: trx, error: insertError } = await db
    .from("transactions")
    .insert([
      {
        user_id: user.id,
        type: "ecodrop",
        status: "pending",
        trash_category_id: trashCategoryId,
        weight,
        total_points: totalPoints,
        reference_number: referenceNumber,
        location_address: locationAddress || "Bank Sampah Induk Surabaya",
        pickup_datetime: pickupDatetime,
        notes,
        photo_url: photoUrl,
      },
    ])
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ data: trx });
}
