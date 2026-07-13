import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendAdminNotification } from "../../../lib/email";

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
        // Fires when the card is added and the trial starts. No money has
        // moved yet (amount_total is $0 for a trial subscription), so this
        // only links the Stripe customer/subscription to the profile —
        // commission calculation happens later, at invoice.payment_succeeded.
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
        }
        break;
      }
      case "invoice.payment_succeeded": {
        // The real charge — fires immediately if no trial, or after the
        // 14-day trial ends. This is the correct place to calculate and
        // record the rep's 30% commission, and to notify on real revenue.
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const amountPaid = invoice.amount_paid; // cents

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, referred_by")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (profile && amountPaid > 0) {
          const subscriptionAmount = amountPaid / 100;
          const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"

          if (profile.referred_by) {
            const commissionAmount = Math.round(subscriptionAmount * 0.3 * 100) / 100;

            // First payment: there's a "pending" placeholder row created at
            // signup — fill it in. Later months: insert a fresh row per
            // month so commission history accumulates correctly.
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
              const { data: existingThisMonth } = await supabase
                .from("rep_commissions")
                .select("id")
                .eq("user_id", profile.id)
                .eq("month", month)
                .maybeSingle();

              if (!existingThisMonth) {
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

          await sendAdminNotification(
            `💳 Payment succeeded: $${subscriptionAmount.toFixed(2)}`,
            `<h2>Payment received</h2>
             <p><strong>Customer:</strong> ${profile.email}</p>
             <p><strong>Amount:</strong> $${subscriptionAmount.toFixed(2)}</p>
             <p><strong>Referred by:</strong> ${profile.referred_by || "none"}</p>`
          );
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

        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        await sendAdminNotification(
          `⚠️ Payment failed: ${profile?.email || customerId}`,
          `<h2>Payment failed</h2>
           <p><strong>Customer:</strong> ${profile?.email || "unknown"}</p>
           <p>Their subscription status has been set to <strong>past_due</strong>.</p>`
        );
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
  }

  return NextResponse.json({ received: true });
}
