import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  solo:         { monthly: process.env.STRIPE_PRICE_SOLO,        yearly: process.env.STRIPE_PRICE_SOLO_YEAR },
  pro:          { monthly: process.env.STRIPE_PRICE_PRO,         yearly: process.env.STRIPE_PRICE_PRO_YEAR },
  reseau:       { monthly: process.env.STRIPE_PRICE_RESEAU,      yearly: process.env.STRIPE_PRICE_RESEAU_YEAR },
};

export async function POST(request) {
  try {
    const { plan, billing = "monthly", withTrial = true, userId, userEmail } = await request.json();

    const priceId = PRICE_IDS[plan]?.[billing];
    if (!priceId) {
      return NextResponse.json({ error: `Plan ou période invalide: ${plan}/${billing}` }, { status: 400 });
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

    const sessionParams = {
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${appUrl}/dashboard?checkout=success&plan=${plan}`,
      cancel_url: `${appUrl}/upgrade`,
      metadata: { userId, plan, billing },
      locale: "fr",
    };

    // Ajout du trial seulement si demandé
    if (withTrial) {
      sessionParams.subscription_data = {
        trial_period_days: 7,
        metadata: { userId, plan, billing },
      };
    } else {
      sessionParams.subscription_data = {
        metadata: { userId, plan, billing },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}