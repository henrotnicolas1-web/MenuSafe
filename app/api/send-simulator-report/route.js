import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const RISK_CONFIG = {
  faible:   { color: "#155724", bg: "#D4EDDA", border: "#C6F6D5", label: "Conforme",        emoji: "✅" },
  modere:   { color: "#856404", bg: "#FFF3CD", border: "#FDE68A", label: "À améliorer",     emoji: "⚠️" },
  eleve:    { color: "#CC0000", bg: "#FFF0F0", border: "#FFD0D0", label: "Risque élevé",    emoji: "🔴" },
  critique: { color: "#7B0000", bg: "#FFF0F0", border: "#FF9999", label: "Risque critique", emoji: "🚨" },
};

// Actions personnalisées selon le profil complet
function getPersonalisedActions(riskKey, formData) {
  const base = {
    faible: [
      { icon: "✓", text: "Vérifiez que chaque plat a ses allergènes déclarés par écrit", urgent: false },
      { icon: "✓", text: "Rendez vos fiches visibles au client avant la commande", urgent: false },
      { icon: "✓", text: "Planifiez une mise à jour à chaque changement de recette", urgent: false },
    ],
    modere: [
      { icon: "→", text: "Formalisez une déclaration écrite pour chaque plat de votre carte", urgent: false },
      { icon: "→", text: "Remplacez la transmission orale par un document accessible", urgent: false },
      { icon: "→", text: "Adoptez un QR code — plus fiable que le classeur papier", urgent: false },
      { icon: "→", text: "Mettez à jour vos allergènes à chaque changement de fournisseur", urgent: false },
    ],
    eleve: [
      { icon: "!", text: "Un contrôle DGCCRF aujourd'hui se traduirait très probablement par une amende", urgent: true },
      { icon: "!", text: "Formalisez vos 14 allergènes par plat, par écrit, dès cette semaine", urgent: true },
      { icon: "!", text: "Vos supports actuels ne satisfont pas aux exigences légales en vigueur depuis 2014", urgent: false },
      { icon: "!", text: "Formez votre équipe : la mention orale n'est plus légalement suffisante", urgent: false },
    ],
    critique: [
      { icon: "!", text: "Risque immédiat d'amende et de fermeture administrative en cas de contrôle", urgent: true },
      { icon: "!", text: "Documentez 100% de vos plats avec leurs allergènes par écrit dans les 48h", urgent: true },
      { icon: "!", text: "Supprimez toute déclaration uniquement orale — elle est illégale depuis 2014", urgent: true },
      { icon: "!", text: "Formez impérativement votre équipe sur les obligations INCO", urgent: false },
      { icon: "!", text: "Mettez en place une solution numérique pour garantir les mises à jour", urgent: false },
    ],
  };

  const actions = [...base[riskKey]];

  // Personnalisation selon les réponses
  if (formData?.updates === "often" && riskKey !== "faible") {
    actions.push({ icon: "→", text: "Votre carte change souvent : une solution numérique est indispensable pour maintenir la conformité sans effort", urgent: false });
  }
  if (formData?.format === "verbal") {
    actions.unshift({ icon: "!", text: "PRIORITÉ : la mention verbale de vos serveurs est illégale depuis 2014 — à corriger immédiatement", urgent: true });
  }
  if (formData?.controls === "warning") {
    actions.unshift({ icon: "!", text: "Vous avez déjà reçu un avertissement : une récidive entraîne des sanctions aggravées", urgent: true });
  }
  if (formData?.type === "catering") {
    actions.push({ icon: "→", text: "En tant que traiteur/événementiel, chaque menu personnalisé doit avoir sa propre déclaration d'allergènes", urgent: false });
  }

  return actions.slice(0, 5); // max 5 actions
}

function getRiskKey(score) {
  if (score <= 25) return "faible";
  if (score <= 50) return "modere";
  if (score <= 75) return "eleve";
  return "critique";
}

// Checklist de mise en conformité selon le niveau
function getChecklist(riskKey) {
  const lists = {
    faible: [
      "Listez tous vos plats sur une feuille",
      "Pour chacun, cochez les allergènes présents parmi les 14",
      "Rendez ce document visible aux clients",
      "Répétez à chaque changement de carte",
    ],
    modere: [
      "Listez tous vos plats actuels",
      "Identifiez les 14 allergènes pour chacun",
      "Créez un document écrit accessible",
      "Formez votre équipe sur les obligations",
      "Mettez en place une procédure de mise à jour",
    ],
    eleve: [
      "Arrêtez immédiatement la déclaration uniquement verbale",
      "Listez tous vos plats et leurs ingrédients complets",
      "Identifiez les 14 allergènes pour chaque plat",
      "Créez un document écrit et rendez-le accessible",
      "Formez l'ensemble de votre équipe",
      "Mettez en place une procédure de mise à jour obligatoire",
    ],
    critique: [
      "ACTION IMMÉDIATE : documentez vos allergènes par écrit",
      "Remplacez toute déclaration verbale par un écrit",
      "Listez 100% de vos plats avec tous les ingrédients",
      "Identifiez les 14 allergènes pour chaque plat",
      "Rendez le document visible avant la commande",
      "Formez toute l'équipe sur les obligations INCO",
      "Mettez en place une mise à jour systématique",
    ],
  };
  return lists[riskKey];
}

function buildEmailHTML({ email, score, riskKey, amendeEstimee, formData }) {
  const risk = RISK_CONFIG[riskKey];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://menusafe.fr";
  const actions = getPersonalisedActions(riskKey, formData);
  const checklist = getChecklist(riskKey);

  // Barre de score colorée
  const scoreBarCells = ["#4ADE80", "#FBBF24", "#EF4444", "#991B1B"].map((color, i) => {
    const active = score > i * 25;
    return `<td style="padding:0 2px;"><div style="height:10px;width:54px;border-radius:5px;background:${color};opacity:${active ? 1 : 0.15};"></div></td>`;
  }).join("");

  // Actions items
  const actionItems = actions.map(a => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #F0F0F0;vertical-align:top;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:10px;padding-top:1px;vertical-align:top;">
            <span style="color:${a.urgent ? risk.color : "#888"};font-weight:800;font-size:14px;">${a.icon}</span>
          </td>
          <td>
            <span style="font-size:13px;color:${a.urgent ? "#1A1A1A" : "#555"};line-height:1.55;font-weight:${a.urgent ? "600" : "400"};">${a.text}</span>
          </td>
        </tr></table>
      </td>
    </tr>`).join("");

  // Checklist items
  const checklistItems = checklist.map((item, i) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #F5F5F5;vertical-align:top;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:10px;padding-top:1px;vertical-align:top;">
            <div style="width:18px;height:18px;border:2px solid #E0E0E0;border-radius:4px;background:white;flex-shrink:0;"></div>
          </td>
          <td>
            <span style="font-size:13px;color:#444;">${item}</span>
          </td>
        </tr></table>
      </td>
    </tr>`).join("");

  // Contexte profil (résumé des réponses)
  const profileMap = {
    type: { bakery: "Boulangerie/café", food_truck: "Food truck", restaurant: "Restaurant", catering: "Traiteur/événementiel" },
    dishes: { few: "Moins de 10 plats", medium: "10 à 30 plats", many: "Plus de 30 plats" },
    updates: { rare: "Carte stable (1x/an)", sometimes: "Changements saisonniers", often: "Carte fréquente (plat du jour)" },
    format: { digital: "Solution numérique", pdf: "PDF imprimé", paper: "Classeur papier", verbal: "Verbal uniquement" },
    controls: { never: "Jamais contrôlé", ok: "Contrôle sans problème", warning: "Contrôle avec avertissement" },
  };
  const profileItems = [
    { label: "Type d'établissement", value: profileMap.type[formData?.type] || "—" },
    { label: "Taille de carte", value: profileMap.dishes[formData?.dishes] || "—" },
    { label: "Fréquence de changement", value: profileMap.updates[formData?.updates] || "—" },
    { label: "Format actuel", value: profileMap.format[formData?.format] || "—" },
    { label: "Historique contrôles", value: profileMap.controls[formData?.controls] || "—" },
  ].map(p => `
    <tr>
      <td style="padding:7px 0;border-bottom:1px solid #F5F5F5;">
        <table cellpadding="0" cellspacing="0" width="100%"><tr>
          <td style="font-size:12px;color:#888;">${p.label}</td>
          <td style="font-size:12px;color:#1A1A1A;font-weight:600;text-align:right;">${p.value}</td>
        </tr></table>
      </td>
    </tr>`).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F2F2F0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2F0;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Helvetica,sans-serif;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

  <!-- HEADER -->
  <tr><td style="background:#1A1A1A;border-radius:16px 16px 0 0;padding:22px 32px;">
    <table cellpadding="0" cellspacing="0" width="100%"><tr>
      <td style="vertical-align:middle;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:10px;vertical-align:middle;">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="white"/>
              <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#E5E5E5"/>
              <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </td>
          <td style="vertical-align:middle;">
            <span style="font-size:16px;font-weight:800;color:white;letter-spacing:-0.02em;">MenuSafe</span>
          </td>
        </tr></table>
      </td>
      <td style="text-align:right;vertical-align:middle;">
        <span style="font-size:11px;color:rgba(255,255,255,0.35);font-weight:500;">Rapport INCO personnalisé</span>
      </td>
    </tr></table>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:white;padding:0;border-left:1px solid #E8E8E8;border-right:1px solid #E8E8E8;">

    <!-- Score hero -->
    <div style="background:${risk.bg};border-bottom:2px solid ${risk.border};padding:32px;text-align:center;">
      <div style="display:inline-block;background:${risk.color};color:white;border-radius:100px;padding:6px 18px;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:18px;">
        ${risk.emoji} ${risk.label}
      </div>
      <div style="font-size:72px;font-weight:800;color:${risk.color};line-height:1;margin-bottom:6px;letter-spacing:-0.03em;">
        ${score}<span style="font-size:26px;font-weight:600;">/100</span>
      </div>
      <table cellpadding="0" cellspacing="0" style="margin:12px auto 16px;">
        <tr>${scoreBarCells}</tr>
      </table>
      ${amendeEstimee > 0 ? `
      <div style="background:white;border-radius:12px;padding:16px 20px;display:inline-block;border:1px solid ${risk.border};margin-top:4px;">
        <div style="font-size:11px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Exposition financière estimée</div>
        <div style="font-size:32px;font-weight:800;color:#CC0000;letter-spacing:-0.02em;">${amendeEstimee.toLocaleString("fr-FR")}€</div>
        <div style="font-size:11px;color:#BBB;margin-top:4px;">en cas de contrôle DGCCRF aujourd'hui</div>
        <div style="font-size:11px;color:#CCC;margin-top:2px;">soit ${Math.round(amendeEstimee / 35)} jours de chiffre d'affaires moyen</div>
      </div>` : `
      <div style="background:white;border-radius:12px;padding:14px 20px;display:inline-block;border:1px solid #C6F6D5;margin-top:4px;">
        <div style="font-size:13px;font-weight:700;color:#155724;">Vous êtes bien positionné ✓</div>
        <div style="font-size:12px;color:#276749;margin-top:4px;">Quelques ajustements suffisent pour être 100% conforme</div>
      </div>`}
    </div>

    <div style="padding:28px 32px;">

      <!-- Votre profil -->
      <p style="font-size:11px;font-weight:700;color:#BBB;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">Votre profil analysé</p>
      <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
        ${profileItems}
      </table>

      <!-- Actions prioritaires -->
      <p style="font-size:11px;font-weight:700;color:#BBB;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">
        ${actions.length} actions prioritaires pour votre profil
      </p>
      <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
        ${actionItems}
      </table>

      <!-- Checklist -->
      <div style="background:#F7F7F5;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">
          Checklist de mise en conformité — à cocher
        </p>
        <table cellpadding="0" cellspacing="0" width="100%">
          ${checklistItems}
        </table>
        <p style="font-size:11px;color:#CCC;margin:12px 0 0;text-align:center;">
          Vous pouvez imprimer cet email et cocher chaque étape manuellement
        </p>
      </div>

      <!-- CTA -->
      <div style="background:#1A1A1A;border-radius:14px;padding:24px;text-align:center;margin-bottom:20px;">
        <p style="font-size:15px;font-weight:800;color:white;margin:0 0 6px;letter-spacing:-0.01em;">
          Générez votre carte conforme en 8 minutes
        </p>
        <p style="font-size:13px;color:rgba(255,255,255,0.5);margin:0 0 18px;line-height:1.6;">
          MenuSafe détecte automatiquement vos 14 allergènes, génère vos PDF conformes et crée votre carte interactive multilingue.
        </p>
        <a href="${appUrl}/auth" style="display:inline-block;background:white;color:#1A1A1A;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;letter-spacing:-0.01em;">
          Essayer gratuitement →
        </a>
        <p style="font-size:11px;color:rgba(255,255,255,0.25);margin:10px 0 0;">
          7 jours gratuits · Sans carte bancaire · Annulation en 1 clic
        </p>
      </div>

      <!-- Ce que fait MenuSafe -->
      <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
        ${[
          ["Détection automatique", "des 14 allergènes sur 900+ ingrédients"],
          ["PDF conforme INCO", "prêt à plastifier sur vos tables"],
          ["Carte QR multilingue", "8 langues, filtrage allergènes en temps réel"],
          ["Import IA depuis photo", "toute votre carte en une photo — Pro & Réseau"],
        ].map(([title, sub]) => `
          <tr><td style="padding:8px 0;border-bottom:1px solid #F5F5F5;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="padding-right:10px;vertical-align:top;padding-top:2px;">
                <div style="width:6px;height:6px;border-radius:50%;background:#4ADE80;margin-top:4px;"></div>
              </td>
              <td>
                <span style="font-size:13px;font-weight:700;color:#1A1A1A;">${title}</span>
                <span style="font-size:13px;color:#888;"> — ${sub}</span>
              </td>
            </tr></table>
          </td></tr>`).join("")}
      </table>

      <p style="font-size:12px;color:#CCC;text-align:center;margin:0;line-height:1.6;">
        Vous recevez cet email car vous avez utilisé le simulateur INCO sur menusafe.fr.<br>
        <a href="${appUrl}/confidentialite" style="color:#CCC;">Politique de confidentialité</a> ·
        <a href="${appUrl}/cgu" style="color:#CCC;">CGU</a>
      </p>
    </div>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#EBEBEB;border-radius:0 0 16px 16px;border:1px solid #E0E0E0;border-top:none;padding:14px 32px;">
    <table cellpadding="0" cellspacing="0" width="100%"><tr>
      <td><p style="font-size:11px;color:#AAA;margin:0;">© 2026 MenuSafe · Règlement UE n°1169/2011 (INCO)</p></td>
      <td style="text-align:right;"><a href="https://menusafe.fr" style="font-size:11px;color:#AAA;text-decoration:none;">menusafe.fr</a></td>
    </tr></table>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
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

    // 1. Stocker le lead dans Supabase
    await supabase.from("leads").upsert({
      email,
      score,
      risk_label: RISK_CONFIG[riskKey].label,
      amende_estimee: amendeEstimee,
      form_data: formData || {},
      source: "simulateur-inco",
    }, { onConflict: "email" });

    // 2. Ajouter à l'audience Resend
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      fetch(`https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          data: {
            score: String(score),
            risk: riskKey,
            source: "simulateur",
            type_etablissement: formData?.type || "",
            format_actuel: formData?.format || "",
          },
        }),
      }).catch(() => {});
    }

    // 3. Envoyer le rapport enrichi
    const html = buildEmailHTML({ email, score, riskKey, amendeEstimee, formData });
    const subjectMap = {
      faible:   `✅ Votre score INCO : ${score}/100 — Conforme, quelques ajustements à faire`,
      modere:   `⚠️ Votre score INCO : ${score}/100 — Des lacunes à corriger avant un contrôle`,
      eleve:    `🔴 URGENT : score INCO ${score}/100 — Votre établissement est exposé`,
      critique: `🚨 Score INCO : ${score}/100 — Action immédiate requise`,
    };

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MenuSafe <noreply@menusafe.fr>",
        to: email,
        subject: subjectMap[riskKey],
        html,
      }),
    });

    return NextResponse.json({ ok: true, riskKey, amendeEstimee });
  } catch (err) {
    console.error("Simulator report error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}