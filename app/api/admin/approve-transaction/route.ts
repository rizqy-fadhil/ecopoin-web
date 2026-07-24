import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const adminClient = createAdminSupabaseClient();
  const db = adminClient ?? supabase;

  // 1. Verifikasi Admin
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cek role admin
  const { data: profile, error: profileErr } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileErr || profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
  }

  // 2. Parse body
  const body = await request.json();
  const { transactionId, action, transactionType } = body;

  if (!transactionId || (action !== "completed" && action !== "cancelled") || !transactionType) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  // Ambil data transaksi saat ini (pastikan statusnya pending)
  const { data: trx, error: getTrxErr } = await db
    .from("transactions")
    .select("status, user_id, total_points")
    .eq("id", transactionId)
    .single();

  if (getTrxErr || !trx) {
    return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  }

  if (trx.status !== "pending") {
    return NextResponse.json({ error: "Transaction is not pending." }, { status: 400 });
  }

  // 3. Proses berdasarkan action dan type
  if (action === "completed") {
    if (transactionType === "ecopick" || transactionType === "ecodrop") {
      // Approve EcoPick / EcoDrop: Update status & Tambah poin
      const { error: updErr } = await db
        .from("transactions")
        .update({ status: "completed" })
        .eq("id", transactionId);

      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

      // Tambah poin atomic
      const { error: rpcErr } = await db.rpc("increment_profile_points", {
        uid: trx.user_id,
        points: trx.total_points,
      });

      if (rpcErr) {
        console.error("RPC Error increment_profile_points:", rpcErr);
        // Fallback if RPC fails/not deployed yet
        const { data: userProfile } = await db.from("profiles").select("total_points").eq("id", trx.user_id).single();
        if (userProfile) {
           await db.from("profiles").update({ total_points: (userProfile.total_points || 0) + trx.total_points }).eq("id", trx.user_id);
        }
      }

    } else if (transactionType === "withdraw") {
      // Approve Withdraw: Update status saja (uang ditransfer manual oleh admin, poin SUDAH terpotong saat request)
      const { error: updErr } = await db
        .from("transactions")
        .update({ status: "completed" })
        .eq("id", transactionId);

      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
    }
  } else if (action === "cancelled") {
    if (transactionType === "ecopick" || transactionType === "ecodrop") {
      // Reject EcoPick / EcoDrop: Update status saja
      const { error: updErr } = await db
        .from("transactions")
        .update({ status: "cancelled" })
        .eq("id", transactionId);

      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

    } else if (transactionType === "withdraw") {
      // Reject Withdraw: Update status & Refund poin
      const { error: updErr } = await db
        .from("transactions")
        .update({ status: "cancelled" })
        .eq("id", transactionId);

      if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

      // Refund poin atomic
      const { error: rpcErr } = await db.rpc("increment_profile_points", {
        uid: trx.user_id,
        points: trx.total_points,
      });
      
      if (rpcErr) {
        console.error("RPC Error increment_profile_points for refund:", rpcErr);
        const { data: userProfile } = await db.from("profiles").select("total_points").eq("id", trx.user_id).single();
        if (userProfile) {
           await db.from("profiles").update({ total_points: (userProfile.total_points || 0) + trx.total_points }).eq("id", trx.user_id);
        }
      }
    }
  }

  return NextResponse.json({ success: true });
}
