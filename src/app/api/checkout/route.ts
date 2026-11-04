import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

const PRICES = {
  solo: "price_1TT1CDANf6sspitdbeYGjnih",
  team: "price_1TT1CDANf6sspitdK6JFF3uq",
  business: "price_1Tb6URANf6sspitdGKpMBFJy",
};

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json();
    // Team and Business are multi-user plans that are not built yet. Do not
    // sell them until multi-user accounts exist.
    if (plan === "team" || plan === "business") {
      return NextResponse.json(
        { error: "The Team and Business plans are not available yet. Please choose Solo, or email hello@pipedesk.app to join the waitlist." },
        { status: 400 }
      );
    }
    const priceId = PRICES.solo;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: { trial_period_days: 14 },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?welcome=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
