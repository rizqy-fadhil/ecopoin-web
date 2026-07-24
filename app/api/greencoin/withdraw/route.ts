import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const adminClient = createAdminSupabaseClient();
  const db = adminClient ?? supabase;

  // 1. Validate auth
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse request body
  const body = await request.json();
  const { ewallet, phone, accountName, amount } = body;

  const amountNumber = Number(amount);

  if (
    !ewallet ||
    !phone ||
    !accountName ||
    !Number.isFinite(amountNumber) ||
    amountNumber < 500
  ) {
    return NextResponse.json(
      { error: "Invalid withdraw request data or amount below minimum (500)." },
      { status: 400 },
    );
  }

  // 3. Update balance atomically using RPC
  // decrement_points should raise an exception if balance < amount
  const { data: newBalance, error: rpcError } = await db.rpc("decrement_points", {
    uid: user.id,
    amount: amountNumber,
  });

  if (rpcError) {
    console.error("RPC Error decrement_points:", rpcError);
    return NextResponse.json(
      { error: "Saldo tidak mencukupi atau terjadi kesalahan." },
      { status: 400 },
    );
  }

  // 4. Insert transaction record
  const ewalletLabel =
    {
      dana: "DANA",
      gopay: "GoPay",
      ovo: "OVO",
      shopeepay: "ShopeePay",
    }[ewallet.toLowerCase()] || ewallet;

  const notes = `Via ${ewalletLabel} - ${phone}`;
  const referenceNumber = `WD-${Date.now()}`;

  const { data: trx, error: insertErr } = await db
    .from("transactions")
    .insert([
      {
        user_id: user.id,
        type: "withdraw",
        status: "pending",
        total_points: amountNumber,
        notes,
        reference_number: referenceNumber,
      },
    ])
    .select()
    .single();

  if (insertErr) {
    // If transaction insert fails, we should ideally refund the points.
    // However, the atomic decrement succeeded, so we log it at least.
    console.error("Failed to insert withdraw transaction after decrementing points:", insertErr);
    return NextResponse.json(
      { error: "Gagal mencatat transaksi, hubungi admin." },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: trx, newBalance });
}
