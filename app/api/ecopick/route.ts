import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { uploadEcopickPhoto } from "@/lib/ecopick/upload-photo";

function generateReferenceNumber() {
  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");
  const d = new Date();
  const dd = pad(d.getDate());
  const mm = pad(d.getMonth() + 1);
  const yy = d.getFullYear().toString().slice(-2);
  const rand = pad(Math.floor(1000 + Math.random() * 9000), 4);
  return `EPK-${dd}${mm}${yy}-${rand}`;
}

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const adminClient = createAdminSupabaseClient();
  const db = adminClient ?? supabase;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();

  const trashCategoryId = Number(formData.get("trash_category_id"));
  const weight = Number(formData.get("weight"));
  const locationAddress = String(formData.get("location_address") || "").trim();
  const pickupDatetime = String(formData.get("pickup_datetime") || "");
  const notes = String(formData.get("notes") || "");
  const totalPoints = Number(formData.get("total_points"));
  const referenceNumber =
    String(formData.get("reference_number") || "").trim() ||
    generateReferenceNumber();

  const latitudeRaw = formData.get("latitude");
  const longitudeRaw = formData.get("longitude");
  const latitude =
    latitudeRaw !== null && latitudeRaw !== ""
      ? Number(latitudeRaw)
      : null;
  const longitude =
    longitudeRaw !== null && longitudeRaw !== ""
      ? Number(longitudeRaw)
      : null;

  if (
    !Number.isFinite(trashCategoryId) ||
    trashCategoryId <= 0 ||
    !Number.isFinite(weight) ||
    weight <= 0 ||
    !pickupDatetime
  ) {
    return NextResponse.json(
      { error: "Data penjemputan tidak lengkap atau tidak valid." },
      { status: 400 },
    );
  }

  const photo = formData.get("photo");
  const photoFile =
    photo instanceof File && photo.size > 0 ? photo : null;

  const { data: trx, error: insertError } = await db
    .from("transactions")
    .insert([
      {
        user_id: user.id,
        type: "ecopick",
        status: "pending",
        trash_category_id: trashCategoryId,
        weight,
        location_address: locationAddress || "Jl. Pemuda No. 12, Surabaya",
        latitude,
        longitude,
        pickup_datetime: pickupDatetime,
        notes,
        total_points: Number.isFinite(totalPoints) ? totalPoints : 0,
        reference_number: referenceNumber,
      },
    ])
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  if (photoFile) {
    try {
      const photoUrl = await uploadEcopickPhoto(
        db,
        user.id,
        trx.id,
        photoFile,
      );

      const { data: updatedTrx, error: updateError } = await db
        .from("transactions")
        .update({ photo_url: photoUrl })
        .eq("id", trx.id)
        .select()
        .single();

      if (updateError) {
        console.error("Gagal menyimpan photo_url:", updateError.message);
      } else if (updatedTrx) {
        return NextResponse.json({ data: updatedTrx });
      }
    } catch (uploadError) {
      console.error("Upload foto ecopick gagal:", uploadError);
      // Foto opsional: transaksi tetap berhasil meski upload gagal
    }
  }

  return NextResponse.json({ data: trx });
}
