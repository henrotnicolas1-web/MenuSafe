import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const RISK_CONFIG = {
  faible:   { color: "#155724", bg: "#D4EDDA", border: "#C6F6D5", label: "Risque faible" },
  modere:   { color: "#856404", bg: "#FFF3CD", border: "#FDE68A", label: "Risque modéré" },
  eleve:    { color: "#CC0000", bg: "#FFF0F0", border: "#FFD0D0", label: "Risque élevé" },
  critique: { color: "#7B0000", bg: "#FFF0F0", border: "#FF9999", label: "Risque critique" },
};

const RISK_ACTIONS = {
  faible: [
    "Vérifiez que tous vos plats ont bien leurs allergènes déclarés par écrit",
    "Assurez-vous que vos fiches sont accessibles aux clients (pas seulement en cuisine)",
    "Planifiez une mise à jour à chaque changement de carte",
  ],
  modere: [
    "Mettez en place une déclaration écrite formelle pour chaque plat",
    "Cessez de vous appuyer sur la mémoire verbale des serveurs",
    "Créez un QR code permanent pour remplacer vos supports papier",
  ],
  eleve: [
    "Urgence : un contrôle DGCCRF aujourd'hui se traduirait par une amende",
    "Formalisez immédiatement vos 14 allergènes par plat, par écrit",
    "Mettez à jour tous vos supports avec les informations correctes",
    "Formez vos équipes sur les obligations légales INCO",
  ],
  critique: [
    "Situation critique : agissez dans les 48h",
    "Risque d'amende et de fermeture administrative en cas de contrôle",
    "Documentez par écrit 100% de vos plats avec leurs allergènes",
    "Consultez un professionnel de la réglementation alimentaire",
    "Mettez en place une solution numérique dès aujourd'hui",
  ],
};

function getRiskKey(score) {
  if (score <= 25) return "faible";
  if (score <= 50) return "modere";
  if (score <= 75) return "eleve";
  return "critique";
}

function buildEmailHTML({ email, score, riskKey, amendeEstimee, formData }) {
  const risk = RISK_CONFIG[riskKey];
  const actions = RISK_ACTIONS[riskKey];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://menusafe.fr";

  const scoreBar = Array.from({ length: 4 }, (_, i) => {
    const colors = ["#4ADE80", "#FBBF24", "#EF4444", "#991B1B"];
    const active = score > i * 25;
    return `<td style="padding:0 2px;"><div style="height:10px;width:50px;border-radius:4px;background:${colors[i]};opacity:${active ? 1 : 0.15};"></div></td>`;
  }).join("");

  const actionItems = actions.map(a =>
    `<tr><td style="padding:6px 0;border-bottom:1px solid #F0F0F0;font-size:13px;color:#444;vertical-align:top;">
      <span style="color:${risk.color};font-weight:700;margin-right:8px;">→</span>${a}
    </td></tr>`
  ).join("");

  return `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F7F5;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

  <!-- Header -->
  <tr><td style="background:#1A1A1A;border-radius:16px 16px 0 0;padding:24px 32px;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:10px;vertical-align:middle;">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
          <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="white"/>
          <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#E5E5E5"/>
          <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </td>
      <td style="vertical-align:middle;"><span style="font-size:17px;font-weight:800;color:white;">MenuSafe</span></td>
      <td style="text-align:right;vertical-align:middle;"><span style="font-size:11px;color:rgba(255,255,255,0.4);">Rapport INCO personnalisé</span></td>
    </tr></table>
  </td></tr>

  <!-- Body -->
  <tr><td style="background:white;padding:36px 32px 28px;border-left:1px solid #EBEBEB;border-right:1px solid #EBEBEB;">
    <p style="font-size:14px;color:#888;margin:0 0 20px;">Votre rapport de conformité allergènes</p>
    <h1 style="font-size:22px;font-weight:800;color:#1A1A1A;margin:0 0 24px;letter-spacing:-0.02em;">
      Votre score INCO : ${score}/100
    </h1>

    <!-- Score card -->
    <div style="background:${risk.bg};border:2px solid ${risk.border};border-radius:14px;padding:24px;text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:${risk.color};color:white;border-radius:100px;padding:6px 16px;font-size:13px;font-weight:700;margin-bottom:16px;">
        ${risk.label}
      </div>
      <div style="font-size:64px;font-weight:800;color:${risk.color};line-height:1;margin-bottom:12px;letter-spacing:-0.03em;">
        ${score}<span style="font-size:24px;font-weight:600;">/100</span>
      </div>
      <!-- Score bar -->
      <table cellpadding="0" cellspacing="0" style="margin:0 auto 4px;">
        <tr>${scoreBar}</tr>
      </table>
      ${amendeEstimee > 0 ? `
      <div style="background:white;border-radius:10px;padding:14px 20px;margin-top:16px;">
        <div style="font-size:11px;color:#888;margin-bottom:4px;">Exposition financière estimée</div>
        <div style="font-size:28px;font-weight:800;color:#CC0000;">${amendeEstimee.toLocaleString("fr-FR")}€</div>
        <div style="font-size:11px;color:#BBB;">en cas de contrôle DGCCRF aujourd'hui</div>
      </div>` : ""}
    </div>

    <!-- Actions prioritaires -->
    <p style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">
      ${actions.length} actions prioritaires
    </p>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
      ${actionItems}
    </table>

    <!-- CTA -->
    <div style="background:#F7F7F5;border-radius:12px;padding:20px 24px;margin-bottom:20px;text-align:center;">
      <p style="font-size:14px;font-weight:700;color:#1A1A1A;margin:0 0 6px;">Réglez tout ça en 5 minutes</p>
      <p style="font-size:13px;color:#888;margin:0 0 16px;line-height:1.6;">
        MenuSafe gère automatiquement vos 14 allergènes, génère vos PDF conformes et crée votre carte interactive multilingue.
      </p>
      <a href="${appUrl}/auth" style="display:inline-block;background:#1A1A1A;color:white;font-size:14px;font-weight:700;padding:13px 32px;border-radius:12px;text-decoration:none;">
        Me mettre en conformité →
      </a>
      <div style="font-size:11px;color:#BBB;margin-top:8px;">Sans frais pendant 7 jours · Annulation en 1 clic</div>
    </div>

    <p style="font-size:12px;color:#BBB;text-align:center;margin:0;">
      Vous recevez cet email car vous avez utilisé le simulateur de risque INCO sur menusafe.fr.<br>
      <a href="${appUrl}/confidentialite" style="color:#AAA;">Politique de confidentialité</a>
    </p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#F0F0F0;border-radius:0 0 16px 16px;border:1px solid #EBEBEB;border-top:none;padding:16px 32px;">
    <table cellpadding="0" cellspacing="0" width="100%"><tr>
      <td><p style="font-size:11px;color:#AAA;margin:0;">© 2026 MenuSafe · Règlement UE n°1169/2011</p></td>
      <td style="text-align:right;"><a href="https://menusafe.fr" style="font-size:11px;color:#AAA;text-decoration:none;">menusafe.fr</a></td>
    </tr></table>
  </td></tr>

</table>
</td></tr>
</table>`;
}

export async function POST(request) {
  try {
    const { email, score, formData } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const riskKey = getRiskKey(score);
    const amendeEstimee = score > 50 ? Math.round((score / 100) * 4500 / 500) * 500 : 0;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Stocker dans Supabase leads
    await supabase.from("leads").upsert({
      email,
      score,
      risk_label: RISK_CONFIG[riskKey].label,
      amende_estimee: amendeEstimee,
      form_data: formData || {},
      source: "simulateur-inco",
    }, { onConflict: "email" });

    // 2. Ajouter à la liste Resend (audience)
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      await fetch("https://api.resend.com/audiences/" + process.env.RESEND_AUDIENCE_ID + "/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          data: { score: String(score), risk: riskKey, source: "simulateur" },
        }),
      }).catch(() => {}); // Non bloquant
    }

    // 3. Envoyer le rapport par email
    const html = buildEmailHTML({ email, score, riskKey, amendeEstimee, formData });

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MenuSafe <noreply@menusafe.fr>",
        to: email,
        subject: `Votre rapport INCO : score ${score}/100 — ${RISK_CONFIG[riskKey].label}`,
        html,
      }),
    });

    return NextResponse.json({ ok: true, riskKey, amendeEstimee });
  } catch (err) {
    console.error("Simulator report error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}