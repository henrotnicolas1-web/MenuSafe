import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  solo:   process.env.STRIPE_PRICE_SOLO,
  pro:    process.env.STRIPE_PRICE_PRO,
  reseau: process.env.STRIPE_PRICE_RESEAU,
};

export async function POST(request) {
  try {
    const { plan, userId, userEmail } = await request.json();

    if (!PRICE_IDS[plan]) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Récupère ou crée le customer Stripe
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    let customerId = sub?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
      });
      customerId = customer.id;
      await supabase
        .from("subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", userId);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://menu-safe-one.vercel.app";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId, plan },
      },
      success_url: `${appUrl}/dashboard?checkout=success&plan=${plan}`,
      cancel_url: `${appUrl}/dashboard?checkout=canceled`,
      metadata: { userId, plan },
      locale: "fr",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}