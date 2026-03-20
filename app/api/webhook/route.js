import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLAN_FROM_PRICE = {
  [process.env.STRIPE_PRICE_SOLO]:   "solo",
  [process.env.STRIPE_PRICE_PRO]:    "pro",
  [process.env.STRIPE_PRICE_RESEAU]: "reseau",
};

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  async function updateSub(customerId, updates) {
    await supabase
      .from("subscriptions")
      .update(updates)
      .eq("stripe_customer_id", customerId);
  }

  switch (event.type) {

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const priceId = sub.items.data[0]?.price?.id;
      const plan = PLAN_FROM_PRICE[priceId] || "free";
      const status = sub.status; // trialing, active, past_due, canceled, etc.

      await updateSub(sub.customer, {
        plan: status === "canceled" ? "free" : plan,
        stripe_subscription_id: sub.id,
        status: status === "trialing" ? "trialing" : status === "active" ? "active" : status === "past_due" ? "past_due" : "free",
        trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
        current_period_ends_at: new Date(sub.current_period_end * 1000).toISOString(),
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      await updateSub(sub.customer, {
        plan: "free",
        status: "free",
        stripe_subscription_id: null,
        trial_ends_at: null,
        current_period_ends_at: null,
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      await updateSub(invoice.customer, { status: "active" });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      // Après échec de paiement → retour au plan free
      await updateSub(invoice.customer, {
        plan: "free",
        status: "past_due",
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}

// Désactive le body parsing par défaut de Next.js — Stripe a besoin du raw body
export const config = { api: { bodyParser: false } };