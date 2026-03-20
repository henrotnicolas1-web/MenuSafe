"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/lib/useWindowSize";

function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="#1A1A1A"/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#2D2D2D"/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const PLANS = [
  {
    id: "solo",
    name: "Solo",
    desc: "Pour 1 établissement",
    note: "Saisie manuelle des recettes",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "Jusqu'à 3 recettes (gratuit)",
      "50 recettes max",
      "PDF conformes INCO",
      "QR code carte (en français)",
      "Filtrage allergènes client",
      "1 établissement",
      "Support email",
    ],
    missing: ["Import IA depuis photo", "Carte multilingue 8 langues"],
  },
  {
    id: "pro",
    name: "Pro",
    desc: "Jusqu'à 3 établissements",
    note: null,
    badge: "Plus populaire",
    monthlyPrice: 59,
    yearlyPrice: 590,
    features: [
      "Recettes illimitées",
      "3 établissements",
      "Import IA depuis photo",
      "Carte interactive multilingue (8 langues)",
      "PDF carte complète",
      "Gestion équipe (3 membres)",
      "Export CSV",
      "Support prioritaire",
    ],
    missing: [],
  },
  {
    id: "reseau",
    name: "Réseau",
    desc: "4+ établissements / franchises",
    note: null,
    monthlyPrice: 149,
    yearlyPrice: 1490,
    features: [
      "Tout Pro inclus",
      "Établissements illimités",
      "Membres illimités",
      "Accès API",
      "Account manager dédié",
      "Contrat annuel possible",
    ],
    missing: [],
  },
];

export default function UpgradePage() {
  const [user, setUser]         = useState(null);
  const [sub, setSub]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [billing, setBilling]   = useState("monthly"); // "monthly" | "yearly"
  const [loadingBtn, setLoadingBtn] = useState(null); // "solo-pay" | "pro-trial" etc.
  const [error, setError]       = useState("");
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }
      setUser(user);
      const { data: sub } = await supabase
        .from("subscriptions").select("*").eq("user_id", user.id).single();
      setSub(sub);
      setLoading(false);
    })();
  }, []);

  async function handleCheckout(planId, withTrial) {
    if (!user) return;
    const key = `${planId}-${withTrial ? "trial" : "pay"}-${billing}`;
    setLoadingBtn(key);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          billing,
          withTrial,
          userId: user.id,
          userEmail: user.email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Erreur lors de la création de la session");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoadingBtn(null);
  }

  // Jours trial restants
  const trialEndsAt = sub?.trial_ends_at ? new Date(sub.trial_ends_at) : null;
  const daysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt - new Date()) / (1000 * 60 * 60 * 24)))
    : null;
  const isExpired = daysLeft !== null && daysLeft <= 0;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <p style={{ color: "#999" }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/dashboard")}>
            <Logo size={24} />
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>MenuSafe</span>
          </div>
          <button onClick={() => router.push("/dashboard")}
            style={{ fontSize: 13, color: "#888", background: "none", border: "none", cursor: "pointer" }}>
            ← Retour au dashboard
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: isMobile ? "32px 16px" : "48px 20px" }}>

        {/* Bandeau état trial */}
        {isExpired ? (
          <div style={{ background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 12, padding: "14px 20px", marginBottom: 32, textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#CC0000", margin: "0 0 4px" }}>Votre période d'essai est terminée</p>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Choisissez un plan pour continuer. Vos données sont conservées.</p>
          </div>
        ) : daysLeft !== null && daysLeft <= 3 ? (
          <div style={{ background: "#FFF8E6", border: "1px solid #FDDEA0", borderRadius: 12, padding: "14px 20px", marginBottom: 32, textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#7A4F00", margin: "0 0 3px" }}>
              ⏱ {daysLeft === 0 ? "Votre essai se termine aujourd'hui" : `${daysLeft} jour${daysLeft > 1 ? "s" : ""} restant${daysLeft > 1 ? "s" : ""} dans votre essai`}
            </p>
            <p style={{ fontSize: 12, color: "#AAA", margin: 0 }}>Abonnez-vous pour ne pas perdre l'accès</p>
          </div>
        ) : null}

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>TARIFS</p>
          <h1 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Choisissez votre formule
          </h1>
          <p style={{ fontSize: 14, color: "#888", margin: "0 0 24px" }}>
            Une amende DGCCRF coûte 1 500€. Le plan Solo annuel coûte 290€.
          </p>

          {/* Toggle mensuel / annuel */}
          <div style={{ display: "inline-flex", background: "white", border: "1px solid #E0E0E0", borderRadius: 12, padding: 4, gap: 4, position: "relative" }}>
            <button
              onClick={() => setBilling("monthly")}
              style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "none", cursor: "pointer", background: billing === "monthly" ? "#1A1A1A" : "transparent", color: billing === "monthly" ? "white" : "#555", transition: "all 0.2s" }}>
              Mensuel
            </button>
            <button
              onClick={() => setBilling("yearly")}
              style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "none", cursor: "pointer", background: billing === "yearly" ? "#1A1A1A" : "transparent", color: billing === "yearly" ? "white" : "#555", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 7 }}>
              Annuel
              <span style={{ fontSize: 11, fontWeight: 700, background: "#D4EDDA", color: "#155724", padding: "2px 7px", borderRadius: 20 }}>
                −17%
              </span>
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{ background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#CC0000", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {PLANS.map((plan) => {
            const price = billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const perMonth = billing === "yearly"
              ? (plan.yearlyPrice / 12).toFixed(0)
              : plan.monthlyPrice;
            const isFeatured = !!plan.badge;
            const trialKey = `${plan.id}-trial-${billing}`;
            const payKey = `${plan.id}-pay-${billing}`;

            return (
              <div key={plan.id} style={{
                background: "white",
                border: isFeatured ? "2px solid #1A1A1A" : "1px solid #E8E8E8",
                borderRadius: 18,
                padding: "28px 24px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}>
                {/* Badge */}
                {isFeatured && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#1A1A1A", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap" }}>
                    {plan.badge}
                  </div>
                )}

                {/* Nom + description */}
                <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: "0 0 2px" }}>{plan.name}</p>
                <p style={{ fontSize: 12, color: "#999", margin: "0 0 4px" }}>{plan.desc}</p>
                {plan.note && <p style={{ fontSize: 11, color: "#BBB", margin: "0 0 14px", fontStyle: "italic" }}>{plan.note}</p>}

                {/* Prix */}
                <div style={{ margin: plan.note ? "0 0 4px" : "14px 0 4px" }}>
                  {billing === "yearly" ? (
                    <>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontSize: 34, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>{price}€</span>
                        <span style={{ fontSize: 13, color: "#999" }}>/an</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>
                        soit <strong style={{ color: "#1A1A1A" }}>{perMonth}€/mois</strong>
                        <span style={{ color: "#38A169", fontWeight: 600, marginLeft: 6 }}>· 2 mois offerts</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontSize: 34, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>{price}€</span>
                        <span style={{ fontSize: 13, color: "#999" }}>/mois</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>
                        ou <span style={{ color: "#38A169", fontWeight: 600 }}>{plan.yearlyPrice}€/an</span>
                        <span style={{ color: "#38A169" }}> (2 mois offerts)</span>
                      </p>
                    </>
                  )}
                </div>

                {/* Features — flex: 1 pour pousser les boutons en bas */}
                <ul style={{ listStyle: "none", padding: 0, margin: "18px 0 24px", flex: 1 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ fontSize: 13, color: "#444", padding: "4px 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#38A169", flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                    </li>
                  ))}
                  {plan.missing.map((f, i) => (
                    <li key={`m${i}`} style={{ fontSize: 13, color: "#CCC", padding: "4px 0", display: "flex", gap: 8 }}>
                      <span style={{ flexShrink: 0 }}>—</span>{f}
                    </li>
                  ))}
                </ul>

                {/* Boutons — toujours en bas grâce à flex column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Bouton principal — payer maintenant */}
                  <button
                    onClick={() => handleCheckout(plan.id, false)}
                    disabled={!!loadingBtn}
                    style={{
                      width: "100%", padding: "12px", fontSize: 14, fontWeight: 700,
                      background: isFeatured ? "#1A1A1A" : "white",
                      color: isFeatured ? "white" : "#1A1A1A",
                      border: "1.5px solid #1A1A1A",
                      borderRadius: 10, cursor: loadingBtn ? "wait" : "pointer",
                      opacity: loadingBtn && loadingBtn !== payKey ? 0.5 : 1,
                    }}>
                    {loadingBtn === payKey ? "Redirection..." : "S'abonner maintenant →"}
                  </button>

                  {/* Bouton secondaire — essai gratuit */}
                  <button
                    onClick={() => handleCheckout(plan.id, true)}
                    disabled={!!loadingBtn}
                    style={{
                      width: "100%", padding: "11px", fontSize: 13, fontWeight: 600,
                      background: "transparent",
                      color: "#555",
                      border: "1px solid #E0E0E0",
                      borderRadius: 10, cursor: loadingBtn ? "wait" : "pointer",
                      opacity: loadingBtn && loadingBtn !== trialKey ? 0.5 : 1,
                    }}>
                    {loadingBtn === trialKey ? "Redirection..." : "Essayer 7 jours gratuitement"}
                  </button>
                </div>

                <p style={{ fontSize: 11, color: "#BBB", textAlign: "center", margin: "10px 0 0" }}>
                  {billing === "yearly" ? "Facturé annuellement · Annulation en 1 clic" : "Sans engagement · Annulation en 1 clic"}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#CCC", marginTop: 28 }}>
          Paiement sécurisé par Stripe · Vos données bancaires ne transitent jamais par nos serveurs
        </p>
      </main>
    </div>
  );
}