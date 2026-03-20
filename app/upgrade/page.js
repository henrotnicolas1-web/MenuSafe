"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
    id: "solo", name: "Solo", price: "29", desc: "Pour 1 établissement",
    features: ["50 recettes", "PDF conformes INCO", "QR code carte", "1 établissement"],
    missing: ["Import IA", "Multilingue"],
  },
  {
    id: "pro", name: "Pro", price: "59", desc: "Jusqu'à 3 établissements", badge: "Recommandé",
    features: ["Recettes illimitées", "3 établissements", "Import IA depuis photo", "Carte multilingue 8 langues", "PDF carte complète"],
    missing: [],
  },
  {
    id: "reseau", name: "Réseau", price: "149", desc: "4+ établissements",
    features: ["Tout Pro inclus", "Établissements illimités", "Membres illimités", "Account manager"],
    missing: [],
  },
];

export default function UpgradePage() {
  const [user, setUser]         = useState(null);
  const [sub, setSub]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [loadingPlan, setLP]    = useState(null);
  const [error, setError]       = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }
      setUser(user);
      const { data: sub } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single();
      setSub(sub);
      setLoading(false);
    })();
  }, []);

  async function handleSubscribe(planId) {
    if (!user) return;
    setLP(planId);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, userId: user.id, userEmail: user.email }),
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
    setLP(null);
  }

  // Calcul jours restants du trial
  const trialEndsAt = sub?.trial_ends_at ? new Date(sub.trial_ends_at) : null;
  const daysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt - new Date()) / (1000 * 60 * 60 * 24))) : null;
  const isExpired = daysLeft !== null && daysLeft <= 0;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <p style={{ color: "#999" }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Nav */}
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB", padding: "12px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/dashboard")}>
            <Logo size={24} />
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>MenuSafe</span>
          </div>
          <button onClick={() => router.push("/dashboard")} style={{ fontSize: 13, color: "#888", background: "none", border: "none", cursor: "pointer" }}>
            ← Retour au dashboard
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>

        {/* Bandeau trial expiré ou jours restants */}
        {isExpired ? (
          <div style={{ background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 14, padding: "16px 20px", marginBottom: 32, textAlign: "center" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#CC0000", margin: "0 0 4px" }}>
              Votre période d'essai est terminée
            </p>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
              Choisissez un plan pour continuer à utiliser MenuSafe. Vos données sont conservées.
            </p>
          </div>
        ) : daysLeft !== null ? (
          <div style={{ background: "#FFF8E6", border: "1px solid #FDDEA0", borderRadius: 14, padding: "14px 20px", marginBottom: 32, textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#7A4F00", margin: "0 0 3px" }}>
              ⏱ {daysLeft} jour{daysLeft > 1 ? "s" : ""} restant{daysLeft > 1 ? "s" : ""} dans votre essai gratuit
            </p>
            <p style={{ fontSize: 12, color: "#AAA", margin: 0 }}>Abonnez-vous maintenant pour ne pas perdre l'accès</p>
          </div>
        ) : null}

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Choisissez votre formule
          </h1>
          <p style={{ fontSize: 14, color: "#888", margin: 0 }}>7 jours gratuits · Sans engagement · Annulation en 1 clic</p>
        </div>

        {error && (
          <div style={{ background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#CC0000", textAlign: "center" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {PLANS.map((plan) => (
            <div key={plan.id} style={{ background: "white", border: plan.badge ? "2px solid #1A1A1A" : "1px solid #E8E8E8", borderRadius: 18, padding: "24px", position: "relative" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#1A1A1A", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>
                  {plan.badge}
                </div>
              )}
              <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: "0 0 2px" }}>{plan.name}</p>
              <p style={{ fontSize: 12, color: "#999", margin: "0 0 14px" }}>{plan.desc}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>{plan.price}€</span>
                <span style={{ fontSize: 13, color: "#999" }}>/mois</span>
              </div>
              <p style={{ fontSize: 11, color: "#888", margin: "0 0 18px" }}>
                ou {plan.price * 10}€/an <span style={{ color: "#38A169", fontWeight: 600 }}>(2 mois offerts)</span>
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ fontSize: 13, color: "#444", padding: "4px 0", display: "flex", gap: 8 }}>
                    <span style={{ color: "#38A169" }}>✓</span>{f}
                  </li>
                ))}
                {plan.missing.map((f, i) => (
                  <li key={`m${i}`} style={{ fontSize: 13, color: "#CCC", padding: "4px 0", display: "flex", gap: 8 }}>
                    <span>—</span>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loadingPlan === plan.id}
                style={{ width: "100%", padding: "12px", fontSize: 14, fontWeight: 700, background: plan.badge ? "#1A1A1A" : "white", color: plan.badge ? "white" : "#1A1A1A", border: "1.5px solid #1A1A1A", borderRadius: 10, cursor: loadingPlan === plan.id ? "wait" : "pointer", opacity: loadingPlan && loadingPlan !== plan.id ? 0.5 : 1 }}>
                {loadingPlan === plan.id ? "Redirection..." : "Commencer l'essai gratuit →"}
              </button>
              <p style={{ fontSize: 11, color: "#BBB", textAlign: "center", margin: "8px 0 0" }}>7 jours gratuits · Sans CB immédiate</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "#CCC", marginTop: 32 }}>
          Paiement sécurisé par Stripe · Vos données bancaires ne transitent jamais par nos serveurs
        </p>
      </main>
    </div>
  );
}