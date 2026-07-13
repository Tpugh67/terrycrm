import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify the caller is a logged-in admin before returning cross-user data.
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
    const { data: callerProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .maybeSingle();
    if (callerProfile?.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // --- User counts by status ---
    const { data: allProfiles } = await supabase
      .from("profiles")
      .select("id, email, industry, subscription_status, referred_by, created_at, role, stripe_customer_id")
      .order("created_at", { ascending: false });

    const customers = (allProfiles || []).filter(p => p.role === "user");
    const counts = {
      total: customers.length,
      active: customers.filter(p => p.subscription_status === "active").length,
      trial: customers.filter(p => p.subscription_status === "trial").length,
      pastDue: customers.filter(p => p.subscription_status === "past_due").length,
      cancelled: customers.filter(p => p.subscription_status === "cancelled").length,
    };
    const recentSignups = customers.slice(0, 10);

    // --- Real MRR from Stripe (active subscriptions only — trialing
    // subscriptions haven't generated revenue yet) ---
    let mrr = 0;
    let activeSubCount = 0;
    try {
      const subs = await stripe.subscriptions.list({ status: "active", limit: 100 });
      for (const sub of subs.data) {
        for (const item of sub.items.data) {
          const amount = item.price.unit_amount || 0;
          const qty = item.quantity || 1;
          // Normalize to monthly (only monthly plans exist today, but this
          // guards against a future annual plan silently inflating MRR).
          const interval = item.price.recurring?.interval;
          const monthlyAmount = interval === "year" ? (amount * qty) / 12 : amount * qty;
          mrr += monthlyAmount;
        }
      }
      activeSubCount = subs.data.length;
    } catch (err) {
      console.error("Stripe MRR fetch failed:", err);
    }

    // --- Rep leaderboard ---
    const { data: reps } = await supabase
      .from("reps")
      .select("id, name, email, status, ref_code");
    const { data: commissions } = await supabase
      .from("rep_commissions")
      .select("rep_id, commission_amount, status, month");

    const repStats = (reps || []).map(rep => {
      const repCommissions = (commissions || []).filter(c => c.rep_id === rep.id);
      const totalEarned = repCommissions
        .filter(c => c.status === "paid")
        .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);
      const leadCount = customers.filter(c => c.referred_by === rep.ref_code).length;
      return { name: rep.name, email: rep.email, status: rep.status, leadCount, totalEarned };
    }).sort((a, b) => b.totalEarned - a.totalEarned);

    // --- Affiliate applications ---
    const { data: affiliateApps } = await supabase
      .from("affiliate_applications")
      .select("name, email, platform, status, created_at")
      .order("created_at", { ascending: false });
    const affiliateCounts = {
      pending: (affiliateApps || []).filter(a => a.status === "pending").length,
      approved: (affiliateApps || []).filter(a => a.status === "approved").length,
    };

    // --- Rep applications pending review ---
    const pendingReps = (reps || []).filter(r => r.status === "pending").length;

    // --- System health ---
    let stripeOk = true;
    try {
      await stripe.balance.retrieve();
    } catch {
      stripeOk = false;
    }
    const health = {
      supabase: true, // implicitly true — we already queried successfully above
      stripe: stripeOk,
      resendConfigured: !!process.env.RESEND_API_KEY,
      customersMissingStripeId: customers.filter(c => c.subscription_status === "active" && !c.stripe_customer_id).length,
    };

    return NextResponse.json({
      counts,
      mrr: mrr / 100,
      activeSubCount,
      recentSignups,
      repStats,
      pendingReps,
      affiliateApps: (affiliateApps || []).slice(0, 10),
      affiliateCounts,
      health,
    });
  } catch (err) {
    console.error("admin-stats error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
