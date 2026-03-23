import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const RISK_CONFIG = {
  faible:   { color: "#155724", bg: "#D4EDDA", border: "#C6F6D5", label: "Bien positionné" },
  modere:   { color: "#856404", bg: "#FFF3CD", border: "#FDE68A", label: "À améliorer" },
  eleve:    { color: "#CC0000", bg: "#FFF0F0", border: "#FFD0D0", label: "Risque élevé" },
  critique: { color: "#7B0000", bg: "#FFF0F0", border: "#FF9999", label: "Risque critique" },
};

function getRiskKey(score) {
  if (score <= 25) return "faible";
  if (score <= 50) return "modere";
  if (score <= 75) return "eleve";
  return "critique";
}

// ── Labels lisibles pour le résumé de profil ─────────────────────────────────
const PROFILE_LABELS = {
  type: {
    bakery:      "Boulangerie / café",
    food_truck:  "Food truck",
    restaurant:  "Restaurant",
    catering:    "Traiteur / événementiel",
  },
  updates: {
    rare:      "Stable (1×/an)",
    sometimes: "Saisonnière",
    often:     "Plat du jour — très fréquente",
  },
  format: {
    digital: "Solution numérique",
    pdf:     "PDF imprimé",
    paper:   "Classeur papier",
    verbal:  "Verbal uniquement (infraction)",
  },
  controls: {
    never:   "Jamais contrôlé",
    ok:      "Contrôle sans problème",
    warning: "Avertissement reçu",
  },
  team: {
    solo:   "Seul(e)",
    small:  "2 à 5 personnes",
    medium: "6 à 15 personnes",
    large:  "Plus de 15 personnes",
  },
};

// ── Actions personnalisées selon profil ───────────────────────────────────────
function getPersonalisedActions(riskKey, formData) {
  const base = {
    faible: [
      { urgent: false, title: "Vérifiez la complétude", text: "Assurez-vous que chaque plat — y compris les suggestions du jour — a ses allergènes déclarés par écrit." },
      { urgent: false, title: "Accessibilité client", text: "Le document doit être visible sans que le client n'ait à le demander explicitement." },
      { urgent: false, title: "Anticipez les mises à jour", text: "Tout changement d'ingrédient ou de fournisseur impose une mise à jour immédiate." },
    ],
    modere: [
      { urgent: false, title: "Formalisez par écrit", text: "La mémoire verbale de vos serveurs ne suffit plus. Un document écrit par plat est exigé par la loi depuis 2014." },
      { urgent: false, title: "Remplacez vos supports statiques", text: "Un PDF imprimé ou un classeur ne se met pas à jour seul. Chaque modification de recette crée un risque légal." },
      { urgent: false, title: "Préparez-vous au prochain contrôle", text: "Les établissements avec des lacunes modérées sont la cible privilégiée des inspections de routine." },
    ],
    eleve: [
      { urgent: true,  title: "Formalisez immédiatement", text: "Un contrôle DGCCRF aujourd'hui se traduirait par une amende. Documentez vos 14 allergènes par plat, par écrit, cette semaine." },
      { urgent: true,  title: "Cessez la déclaration orale", text: "La mention verbale est une infraction en soi depuis 2014. Elle n'a aucune valeur légale." },
      { urgent: false, title: "Mettez à jour tous vos supports", text: "Chaque document obsolète est une infraction supplémentaire lors d'un contrôle." },
      { urgent: false, title: "Formez vos équipes", text: "Vos serveurs doivent savoir où trouver les informations sur les allergènes." },
    ],
    critique: [
      { urgent: true,  title: "Agissez dans les 48h", text: "Risque d'amende ET de fermeture administrative. Ne repoussez pas." },
      { urgent: true,  title: "Documentez 100% de vos plats", text: "Chaque plat sans déclaration écrite est une infraction indépendante à 1 500€." },
      { urgent: true,  title: "Remplacez vos processus manuels", text: "Un classeur papier ou fichier Excel n'offre aucune traçabilité ni protection juridique." },
      { urgent: false, title: "Formez vos équipes en urgence", text: "Les agents DGCCRF vérifient aussi que les serveurs savent où trouver les informations." },
    ],
  };

  const actions = [...base[riskKey]];

  // Personnalisations croisées
  if (formData.controls === "warning") {
    actions.unshift({ urgent: true, title: "Récidive à éviter absolument", text: "Vous avez déjà reçu un avertissement. Une récidive entraîne des sanctions aggravées et une possible publication sur Alim'Confiance (indexée par Google)." });
  }
  if (formData.updates === "often" && formData.format !== "digital") {
    actions.push({ urgent: false, title: "Plat du jour : solution numérique indispensable", text: "Vous changez votre carte quotidiennement. Sans outil numérique, vous êtes en infraction potentielle à chaque service." });
  }
  if (formData.type === "catering") {
    actions.push({ urgent: false, title: "Traiteur : déclaration par événement", text: "Chaque menu personnalisé pour un événement doit avoir sa propre déclaration d'allergènes." });
  }
  if (formData.team === "large" || formData.team === "medium") {
    actions.push({ urgent: false, title: "Formation d'équipe obligatoire", text: `Avec ${formData.team === "large" ? "plus de 15" : "6 à 15"} personnes, un protocole écrit et une formation régulière sont indispensables.` });
  }

  return actions.slice(0, 5);
}

// ── Checklist par niveau ──────────────────────────────────────────────────────
const CHECKLISTS = {
  faible: [
    "Vérifiez que chaque plat a ses allergènes listés par écrit",
    "Rendez ce document visible sans que le client ait à demander",
    "Planifiez une mise à jour à chaque changement de recette",
  ],
  modere: [
    "Listez tous vos plats actuels avec leurs ingrédients complets",
    "Identifiez les 14 allergènes pour chaque plat",
    "Créez un document écrit accessible au client avant la commande",
    "Formez votre équipe sur les obligations légales",
    "Mettez en place une procédure de mise à jour à chaque changement",
  ],
  eleve: [
    "STOP à la déclaration uniquement verbale — illégale depuis 2014",
    "Listez tous vos plats et leurs ingrédients complets",
    "Identifiez les 14 allergènes pour chaque plat",
    "Créez un document écrit et rendez-le accessible",
    "Formez l'ensemble de votre équipe sur les obligations INCO",
    "Mettez en place une procédure de mise à jour obligatoire",
  ],
  critique: [
    "ACTION IMMÉDIATE : documentez vos allergènes par écrit",
    "Supprimez toute déclaration uniquement verbale",
    "Listez 100% de vos plats avec tous les ingrédients",
    "Identifiez les 14 allergènes pour chaque plat",
    "Rendez le document accessible avant la commande",
    "Formez toute l'équipe sur les obligations INCO",
    "Mettez en place une mise à jour systématique à chaque changement",
  ],
};

// ── Construction de l'email ───────────────────────────────────────────────────
function buildEmailHTML({ email, score, riskKey, dishesCount, expositionMax, nonConfPlats, formData }) {
  const risk = RISK_CONFIG[riskKey];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://menusafe.fr";
  const actions = getPersonalisedActions(riskKey, formData);
  const checklist = CHECKLISTS[riskKey];

  const scoreBarCells = ["#4ADE80", "#FBBF24", "#EF4444", "#991B1B"].map((color, i) => {
    const active = score > i * 25;
    return `<td style="padding:0 2px;"><div style="height:10px;width:54px;border-radius:5px;background:${color};opacity:${active ? 1 : 0.15};"></div></td>`;
  }).join("");

  // Ligne de profil
  const profileRows = [
    { label: "Type d'établissement",   value: PROFILE_LABELS.type[formData.type] || "—" },
    { label: "Nombre de plats",         value: dishesCount ? `${dishesCount} plats` : "—" },
    { label: "Fréquence de changement", value: PROFILE_LABELS.updates[formData.updates] || "—" },
    { label: "Format actuel",           value: PROFILE_LABELS.format[formData.format] || "—" },
    { label: "Contrôles passés",        value: PROFILE_LABELS.controls[formData.controls] || "—" },
    { label: "Taille de l'équipe",      value: PROFILE_LABELS.team[formData.team] || "—" },
  ].map(p => `
    <tr>
      <td style="padding:7px 0;border-bottom:1px solid #F5F5F5;font-size:12px;color:#888;">${p.label}</td>
      <td style="padding:7px 0;border-bottom:1px solid #F5F5F5;font-size:12px;color:#1A1A1A;font-weight:600;text-align:right;">${p.value}</td>
    </tr>`).join("");

  const actionRows = actions.map((a, i) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #F0F0F0;vertical-align:top;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:12px;vertical-align:top;">
            <div style="width:24px;height:24px;border-radius:50%;background:${a.urgent ? risk.color : "#E8E8E8"};text-align:center;line-height:24px;font-size:11px;font-weight:800;color:${a.urgent ? "white" : "#888"};mso-line-height-rule:exactly;">${i + 1}</div>
          </td>
          <td>
            <div style="font-size:13px;font-weight:700;color:${a.urgent ? risk.color : "#1A1A1A"};margin-bottom:3px;">${a.title}</div>
            <div style="font-size:12px;color:#666;line-height:1.55;">${a.text}</div>
          </td>
        </tr></table>
      </td>
    </tr>`).join("");

  const checklistRows = checklist.map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #F5F5F5;vertical-align:top;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:10px;vertical-align:top;padding-top:2px;">
            <div style="width:16px;height:16px;border:2px solid #D0D0D0;border-radius:3px;background:white;"></div>
          </td>
          <td style="font-size:12px;color:#444;line-height:1.5;">${item}</td>
        </tr></table>
      </td>
    </tr>`).join("");

  const expositionBlock = expositionMax > 0 && formData.format !== "digital" ? `
    <div style="background:white;border-radius:12px;padding:16px 20px;margin-top:4px;border:1px solid ${risk.border};">
      <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:6px;">Exposition totale estimée — votre carte</div>
      <div style="font-size:36px;font-weight:800;color:#CC0000;letter-spacing:-0.02em;line-height:1;">${expositionMax.toLocaleString("fr-FR")}€</div>
      <div style="font-size:11px;color:#AAA;margin-top:6px;">${nonConfPlats} plats estimés non conformes × 1 500€ par infraction</div>
      <div style="margin-top:10px;display:flex;gap:12px;flex-wrap:wrap;">
        ${[
          `${Math.round(expositionMax / 59)} mois d'abonnement Pro`,
          `${Math.round(expositionMax / 11.65)} h au SMIC`,
          `${Math.round(expositionMax / 18)} repas servis`,
        ].map(e => `<span style="font-size:11px;color:#856404;font-weight:600;">≈ ${e}</span>`).join("")}
      </div>
      <div style="font-size:10px;color:#CCC;margin-top:10px;line-height:1.5;">
        Montant théorique basé sur l'amende maximale de 5ème classe (Art. R451-1 du Code de la Consommation) par infraction constatée.
      </div>
    </div>` : "";

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2F2F0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2F0;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Helvetica,sans-serif;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

  <!-- HEADER -->
  <tr><td style="background:#1A1A1A;border-radius:16px 16px 0 0;padding:20px 32px;">
    <table cellpadding="0" cellspacing="0" width="100%"><tr>
      <td style="vertical-align:middle;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:10px;vertical-align:middle;">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="white"/>
              <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#E5E5E5"/>
              <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </td>
          <td><span style="font-size:15px;font-weight:800;color:white;letter-spacing:-0.02em;">MenuSafe</span></td>
        </tr></table>
      </td>
      <td style="text-align:right;"><span style="font-size:11px;color:rgba(255,255,255,0.3);">Rapport INCO personnalisé</span></td>
    </tr></table>
  </td></tr>

  <!-- SCORE HERO -->
  <tr><td style="background:${risk.bg};border-left:1px solid #E8E8E8;border-right:1px solid #E8E8E8;padding:32px;text-align:center;border-bottom:2px solid ${risk.border};">
    <div style="display:inline-block;background:${risk.color};color:white;border-radius:100px;padding:6px 18px;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:18px;">
      ${risk.label}
    </div>
    <div style="font-size:80px;font-weight:800;color:${risk.color};line-height:1;margin-bottom:6px;letter-spacing:-0.04em;">
      ${score}<span style="font-size:28px;font-weight:600;opacity:0.6;">/100</span>
    </div>
    <table cellpadding="0" cellspacing="0" style="margin:14px auto 16px;">
      <tr>${scoreBarCells}</tr>
    </table>
    ${expositionBlock}
    <!-- Social proof -->
    <div style="margin-top:12px;font-size:12px;color:#888;">
      ${score <= 25 ? "Vous faites partie des 25% les mieux préparés"
      : score <= 50 ? "Score supérieur à 40% des établissements analysés"
      : score <= 75 ? "Score inférieur à 70% des établissements analysés"
      : "Parmi les profils les plus exposés que nous analysons"}
    </div>
  </td></tr>

  <!-- BODY -->
  <tr><td style="background:white;padding:28px 32px;border-left:1px solid #E8E8E8;border-right:1px solid #E8E8E8;">

    <!-- Profil analysé -->
    <div style="font-size:11px;font-weight:700;color:#BBB;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">Votre profil analysé</div>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
      ${profileRows}
    </table>

    <!-- Actions prioritaires -->
    <div style="font-size:11px;font-weight:700;color:#BBB;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">
      ${actions.length} actions prioritaires pour votre profil
    </div>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
      ${actionRows}
    </table>

    <!-- Checklist -->
    <div style="background:#F7F7F5;border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">
        Checklist de mise en conformité — à imprimer et cocher
      </div>
      <table cellpadding="0" cellspacing="0" width="100%">
        ${checklistRows}
      </table>
      <div style="font-size:11px;color:#CCC;margin-top:10px;text-align:center;">
        Imprimez cet email et cochez chaque étape au fur et à mesure
      </div>
    </div>

    <!-- CTA bloc -->
    <div style="background:#1A1A1A;border-radius:14px;padding:24px;text-align:center;margin-bottom:20px;">
      <div style="font-size:15px;font-weight:800;color:white;margin-bottom:6px;letter-spacing:-0.01em;">
        Générez votre première carte conforme en 8 minutes
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,0.45);margin-bottom:18px;line-height:1.6;">
        MenuSafe détecte automatiquement vos 14 allergènes, génère vos PDF conformes<br>et crée votre carte interactive multilingue.
      </div>
      <a href="${appUrl}/auth" style="display:inline-block;background:white;color:#1A1A1A;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;letter-spacing:-0.01em;">
        Commencer gratuitement →
      </a>
      <div style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:10px;">
        7 jours gratuits · Sans carte bancaire · Annulation en 1 clic
      </div>
    </div>

    <!-- Ce que fait MenuSafe -->
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
      ${[
        ["Détection automatique", "des 14 allergènes sur 900+ ingrédients"],
        ["PDF conforme INCO", "prêt à plastifier sur vos tables"],
        ["Carte QR multilingue", "8 langues, filtrage allergènes en temps réel"],
        ["Import IA depuis photo", "toute votre carte en une photo"],
        ["Mise à jour en temps réel", "modifiez une recette, la carte s'actualise immédiatement"],
      ].map(([title, sub]) => `
        <tr><td style="padding:8px 0;border-bottom:1px solid #F5F5F5;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:8px;vertical-align:top;padding-top:5px;">
              <div style="width:6px;height:6px;border-radius:50%;background:#4ADE80;"></div>
            </td>
            <td style="font-size:13px;color:#444;">
              <strong style="color:#1A1A1A;">${title}</strong> — ${sub}
            </td>
          </tr></table>
        </td></tr>`).join("")}
    </table>

    <div style="font-size:11px;color:#CCC;text-align:center;line-height:1.6;">
      Vous recevez cet email car vous avez utilisé le simulateur INCO sur menusafe.fr.<br>
      <a href="${appUrl}/confidentialite" style="color:#CCC;">Politique de confidentialité</a>
    </div>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#EBEBEB;border-radius:0 0 16px 16px;border:1px solid #E0E0E0;border-top:none;padding:14px 32px;">
    <table cellpadding="0" cellspacing="0" width="100%"><tr>
      <td style="font-size:11px;color:#AAA;">© 2026 MenuSafe · Règlement UE n°1169/2011 (INCO)</td>
      <td style="text-align:right;"><a href="https://menusafe.fr" style="font-size:11px;color:#AAA;text-decoration:none;">menusafe.fr</a></td>
    </tr></table>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── Handler POST ──────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { email, score, formData } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const riskKey = getRiskKey(score);
    // dishes_count est la valeur numérique de la tranche ("5", "15", "30", "60", "100")
    const dishesCount = Number(formData.dishes_count) || 15;
    const nonConfRate = { digital: 0, pdf: 0.3, paper: 0.6, verbal: 1 }[formData.format] ?? 0.7;
    const nonConfPlats = Math.round(dishesCount * nonConfRate);
    const expositionMax = nonConfPlats * 1500;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Stocker le lead
    await supabase.from("leads").upsert({
      email,
      score,
      risk_label: RISK_CONFIG[riskKey].label,
      amende_estimee: expositionMax,
      form_data: formData || {},
      source: "simulateur-inco",
    }, { onConflict: "email" });

    // 2. Audience Resend
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      fetch(`https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.RESEND_API_KEY}` },
        body: JSON.stringify({
          email,
          unsubscribed: false,
          data: {
            score: String(score),
            risk: riskKey,
            source: "simulateur",
            type: formData.type || "",
            format: formData.format || "",
            dishes: String(dishesCount),
          },
        }),
      }).catch(() => {});
    }

    // 3. Email — sujets sans emojis (anti-spam)
    const subjectMap = {
      faible:   `Votre score INCO : ${score}/100 — Vous êtes bien positionné`,
      modere:   `Votre score INCO : ${score}/100 — Des lacunes à corriger avant un contrôle`,
      eleve:    `Votre score INCO : ${score}/100 — Votre établissement est exposé`,
      critique: `Votre score INCO : ${score}/100 — Action requise`,
    };

    const html = buildEmailHTML({ email, score, riskKey, dishesCount, expositionMax, nonConfPlats, formData });

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "MenuSafe <noreply@menusafe.fr>",
        to: email,
        subject: subjectMap[riskKey],
        html,
      }),
    });

    return NextResponse.json({ ok: true, riskKey, expositionMax });
  } catch (err) {
    console.error("Simulator report error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}