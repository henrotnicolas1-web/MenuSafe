import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLAN_FROM_PRICE = {
  [process.env.STRIPE_PRICE_SOLO]:        "solo",
  [process.env.STRIPE_PRICE_PRO]:         "pro",
  [process.env.STRIPE_PRICE_RESEAU]:      "reseau",
  [process.env.STRIPE_PRICE_SOLO_YEAR]:   "solo",
  [process.env.STRIPE_PRICE_PRO_YEAR]:    "pro",
  [process.env.STRIPE_PRICE_RESEAU_YEAR]: "reseau",
};

const PLAN_LABELS = { solo: "Solo", pro: "Pro", reseau: "Réseau" };

async function sendEmail(to, subject, html) {
  if (!process.env.RESEND_API_KEY) return; // Skip if not configured yet
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MenuSafe <noreply@menusafe.fr>",
        to,
        subject,
        html,
      }),
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
}

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

  async function getEmailByCustomer(customerId) {
    const { data } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .single();
    if (!data) return null;
    const { data: { user } } = await supabase.auth.admin.getUserById(data.user_id);
    return user?.email;
  }

  async function updateSub(customerId, updates) {
    await supabase
      .from("subscriptions")
      .update(updates)
      .eq("stripe_customer_id", customerId);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://menu-safe-one.vercel.app";

  switch (event.type) {

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const priceId = sub.items.data[0]?.price?.id;
      const plan = PLAN_FROM_PRICE[priceId] || "free";
      const isYearly = [
        process.env.STRIPE_PRICE_SOLO_YEAR,
        process.env.STRIPE_PRICE_PRO_YEAR,
        process.env.STRIPE_PRICE_RESEAU_YEAR,
      ].includes(priceId);

      const status = sub.status === "canceled" ? "free"
        : sub.status === "trialing" ? "trialing"
        : sub.status === "active" ? "active"
        : sub.status === "past_due" ? "past_due"
        : "free";

      await updateSub(sub.customer, {
        plan: status === "free" ? "free" : plan,
        stripe_subscription_id: sub.id,
        status,
        trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
        current_period_ends_at: new Date(sub.current_period_end * 1000).toISOString(),
      });

      // Email bienvenue à l'activation (pas pendant le trial)
      if (sub.status === "active" && event.type === "customer.subscription.updated") {
        const email = await getEmailByCustomer(sub.customer);
        if (email) {
          const nextDate = new Date(sub.current_period_end * 1000).toLocaleDateString("fr-FR");
          const html = `<!-- resend-abonnement-actif -->
            <p>Plan : <strong>${PLAN_LABELS[plan] || plan}</strong></p>
            <p>Facturation : <strong>${isYearly ? "Annuelle" : "Mensuelle"}</strong></p>
            <p>Prochain renouvellement : <strong>${nextDate}</strong></p>
            <p><a href="${appUrl}/dashboard">Accéder à mon dashboard →</a></p>`;
          // In production, use the full HTML template from /emails/resend-abonnement-actif.html
          await sendEmail(email, `✅ Votre abonnement MenuSafe ${PLAN_LABELS[plan]} est actif`, html);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      await updateSub(sub.customer, {
        plan: "free", status: "free",
        stripe_subscription_id: null,
        trial_ends_at: null,
        current_period_ends_at: null,
      });
      const email = await getEmailByCustomer(sub.customer);
      if (email) {
        const endDate = new Date(sub.current_period_end * 1000).toLocaleDateString("fr-FR");
        const html = `<p>Votre abonnement MenuSafe a été annulé. Accès maintenu jusqu'au <strong>${endDate}</strong>.</p>
          <p>Vos données sont conservées. <a href="${appUrl}/upgrade">Se réabonner →</a></p>`;
        await sendEmail(email, "Votre abonnement MenuSafe a été annulé", html);
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      await updateSub(invoice.customer, { status: "active" });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      await updateSub(invoice.customer, { plan: "free", status: "past_due" });
      const email = await getEmailByCustomer(invoice.customer);
      if (email) {
        const html = `<p>Le paiement de votre abonnement MenuSafe a échoué. Veuillez mettre à jour vos informations de paiement.</p>
          <p><a href="${appUrl}/parametres">Mettre à jour ma CB →</a></p>`;
        await sendEmail(email, "⚠️ Échec de paiement MenuSafe", html);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}