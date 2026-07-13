import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email || session.customer_details?.email;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        if (email) {
          await supabase.from("profiles").update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: "active",
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          }).eq("email", email);

          // Referral commission: 30% of what they actually paid, credited
          // to whichever rep referred them (if any).
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, referred_by")
            .eq("email", email)
            .maybeSingle();

          if (profile?.referred_by && session.amount_total) {
            const subscriptionAmount = session.amount_total / 100; // cents -> dollars
            const commissionAmount = Math.round(subscriptionAmount * 0.3 * 100) / 100;
            const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"

            const { data: pending } = await supabase
              .from("rep_commissions")
              .select("id")
              .eq("user_id", profile.id)
              .eq("status", "pending")
              .maybeSingle();

            if (pending) {
              await supabase.from("rep_commissions").update({
                subscription_amount: subscriptionAmount,
                commission_amount: commissionAmount,
                month,
                status: "paid",
              }).eq("id", pending.id);
            } else {
              const { data: rep } = await supabase
                .from("reps")
                .select("id")
                .eq("ref_code", profile.referred_by)
                .maybeSingle();
              if (rep) {
                await supabase.from("rep_commissions").insert({
                  rep_id: rep.id,
                  user_id: profile.id,
                  subscription_amount: subscriptionAmount,
                  commission_amount: commissionAmount,
                  month,
                  status: "paid",
                });
              }
            }
          }
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        await supabase.from("profiles").update({
          subscription_status: "cancelled",
        }).eq("stripe_customer_id", customerId);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        await supabase.from("profiles").update({
          subscription_status: "past_due",
        }).eq("stripe_customer_id", customerId);
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
  }

  return NextResponse.json({ received: true });
}
