"use client";
import { useState } from "react";
import Link from "next/link";

const SECTORS = [
  {
    id: "restaurant",
    emoji: "🍽️",
    label: "Restaurant",
    tagline: "De la brasserie au gastronomique",
    color: "#2563eb",
    bg: "#eff6ff",
    hero: "Votre carte change selon les saisons, les arrivages du marché, les suggestions du chef. MenuSafe suit le rythme sans effort.",
    pain: [
      "Carte saisonnière difficile à maintenir à jour",
      "Serveurs ne connaissent pas toujours tous les ingrédients",
      "Clientèle touristique ne parle pas français",
      "Classeur papier toujours en retard sur la réalité",
    ],
    solution: [
      { icon: "⚡", title: "Mise à jour en 20 secondes", desc: "Nouveau plat du jour ? 3 clics. La carte QR code est à jour avant le service." },
      { icon: "🌍", title: "8 langues automatiques", desc: "Import IA d'une photo de carte → traductions EN, ES, DE, IT, NL, JA, ZH générées instantanément." },
      { icon: "👨‍🍳", title: "Briefing équipe simplifié", desc: "Chaque serveur peut consulter la fiche complète d'un plat depuis son téléphone avant le service." },
    ],
    stat: { num: "85%", label: "des restaurants font confiance à la mémoire du serveur pour les allergènes. C'est insuffisant légalement." },
  },
  {
    id: "boulangerie",
    emoji: "🥐",
    label: "Boulangerie / Pâtisserie",
    tagline: "Du pain artisanal aux créations saisonnières",
    color: "#d97706",
    bg: "#fffbeb",
    hero: "Galette des rois en janvier, bûches en décembre, viennoiseries au levain toute l'année. Chaque produit contient du gluten, souvent des œufs et du lait — une erreur peut coûter cher.",
    pain: [
      "Produits très allergènes (gluten, lait, œufs dans presque tout)",
      "Gamme change selon les saisons et les fournisseurs",
      "Petite structure : pas de responsable dédié",
      "Clients debout au comptoir, pas de menu à consulter",
    ],
    solution: [
      { icon: "🏷️", title: "QR code vitrine & comptoir", desc: "Un QR code affiché en vitrine ou sur le comptoir. Le client scanne et voit tous les allergènes avant d'acheter." },
      { icon: "🌾", title: "Gluten & lait pré-détectés", desc: "La base 900+ ingrédients reconnaît les produits boulangers. Farine → gluten. Beurre → lait. Automatique." },
      { icon: "📋", title: "PDF affichage légal", desc: "Un document A4 à imprimer et plastifier. Conforme INCO, prêt en 2 minutes." },
    ],
    stat: { num: "100%", label: "des produits de boulangerie contiennent au moins 1 des 14 allergènes. La déclaration est obligatoire sans exception." },
  },
  {
    id: "food_truck",
    emoji: "🚚",
    label: "Food Truck",
    tagline: "Mobilité, rapidité, conformité",
    color: "#16a34a",
    bg: "#f0fdf4",
    hero: "Vous travaillez en espace réduit, avec une carte courte mais dense. Vos clients mangent debout ou dans leur voiture. La conformité allergènes ne peut pas ralentir votre flux de service.",
    pain: [
      "Pas de place pour un classeur ou un menu physique",
      "Service très rapide, clients pressés",
      "Carte qui change souvent selon les approvisionnements",
      "Clientèle mix : touristes, salariés, familles",
    ],
    solution: [
      { icon: "📱", title: "100% numérique, zéro papier", desc: "Un QR code collé sur votre camion ou votre vitrine. Accessible depuis n'importe quel smartphone sans app." },
      { icon: "🔄", title: "Carte modifiable entre deux services", desc: "Plus de saumon ? Vous retirez le plat en 10 secondes depuis votre téléphone. La carte est à jour immédiatement." },
      { icon: "⚡", title: "Conformité sans friction", desc: "Vos clients allergiques vérifient eux-mêmes. Vous continuez votre service sans interruption." },
    ],
    stat: { num: "3x", label: "plus de contrôles DGCCRF sur les food trucks que sur les restaurants fixes selon les professionnels du secteur." },
  },
  {
    id: "hotel",
    emoji: "🏨",
    label: "Hôtel & Room Service",
    tagline: "Restaurant, bar, room service, petit-déjeuner",
    color: "#7c3aed",
    bg: "#f5f3ff",
    hero: "Un hôtel cumule plusieurs points de restauration avec une clientèle internationale exigeante. Chaque service — petit-déjeuner buffet, restaurant gastronomique, bar, room service — a ses propres contraintes légales.",
    pain: [
      "Plusieurs menus à gérer simultanément",
      "Clientèle internationale qui ne lit pas le français",
      "Buffet : plats changent chaque jour",
      "Équipes différentes selon les services",
    ],
    solution: [
      { icon: "🏢", title: "Multi-établissements natifs", desc: "Restaurant, bar, room service : chaque espace a sa propre carte et son propre QR code depuis un seul compte." },
      { icon: "🌍", title: "8 langues pour votre clientèle internationale", desc: "Vos clients choisissent leur langue. Traductions EN, ES, DE, IT, NL, JA, ZH — générées une fois, disponibles à vie." },
      { icon: "📅", title: "Buffet du jour en 2 minutes", desc: "Chaque matin, mise à jour du buffet en quelques clics. Le QR code sur chaque plat pointe vers la fiche à jour." },
    ],
    stat: { num: "8", label: "langues disponibles. Vos clients britanniques, espagnols, allemands et japonais peuvent vérifier les allergènes dans leur langue." },
  },
  {
    id: "franchise",
    emoji: "🔗",
    label: "Franchise & Multi-sites",
    tagline: "Cohérence et contrôle à grande échelle",
    color: "#dc2626",
    bg: "#fef2f2",
    hero: "Gérer la conformité allergènes sur 5, 10 ou 50 points de vente est un défi organisationnel majeur. Une erreur dans un établissement met en danger toute l'enseigne.",
    pain: [
      "Cohérence des menus entre établissements impossible manuellement",
      "Un nouveau plat national → mise à jour de tous les sites",
      "Contrôle qualité difficile à distance",
      "Responsabilité juridique centralisée mais exécution locale",
    ],
    solution: [
      { icon: "🏗️", title: "Établissements illimités (plan Réseau)", desc: "Tous vos sites dans un seul compte. Vue d'ensemble, gestion individuelle. Ajoutez un site en 2 minutes." },
      { icon: "👥", title: "Gestion des équipes par site", desc: "Chaque manager local a accès uniquement à son établissement. Vous gardez la main sur les données centrales." },
      { icon: "🔌", title: "Export CSV & accès API", desc: "Intégrez vos données allergènes dans votre back-office existant. Compatible avec vos systèmes de gestion de menus." },
    ],
    stat: { num: "1 500€", label: "par infraction, par établissement. Sur 10 sites non conformes, l'exposition potentielle dépasse 15 000€." },
  },
];

export default function MetiersPage() {
  const [activeSector, setActiveSector] = useState("restaurant");
  const sector = SECTORS.find(s => s.id === activeSector);

  const styles = {
    page: { fontFamily: "'DM Sans', sans-serif", color: "#111827", background: "#fff" },
    nav: {
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)",
      borderBottom: "1px solid #e5e7eb", padding: "0 24px",
    },
    navInner: {
      maxWidth: 1100, margin: "0 auto", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    },
    logo: {
      fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20,
      color: "#2563eb", textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
    },
    ctaBtn: {
      background: "#2563eb", color: "#fff", border: "none",
      borderRadius: 8, padding: "10px 20px", fontWeight: 700,
      fontSize: 14, cursor: "pointer", textDecoration: "none", display: "inline-block",
    },
    container: { maxWidth: 1100, margin: "0 auto" },
    sectionLabel: {
      fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: "#2563eb", marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
      fontWeight: 800, color: "#111827", marginBottom: 16, lineHeight: 1.15,
    },
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .sector-content { animation: fadeIn 0.3s ease both; }
      `}</style>

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <Link href="/" style={styles.logo}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </span>
            MenuSafe
          </Link>
          <Link href="/auth" style={styles.ctaBtn}>Essayer gratuitement</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0f172a, #1e3a8a)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", gap: 8, alignItems: "center",
            background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)",
            borderRadius: 100, padding: "6px 16px", fontSize: 13, color: "#93c5fd", marginBottom: 24,
          }}>
            🏪 5 profils métier
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 20,
          }}>
            MenuSafe s'adapte<br />
            <span style={{ color: "#3b82f6" }}>à votre type d'établissement</span>
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.6 }}>
            Un food truck n'a pas les mêmes contraintes qu'un hôtel 4 étoiles. MenuSafe a été pensé pour chaque cas.
          </p>
        </div>
      </section>

      {/* SECTOR TABS */}
      <div style={{ background: "#f8f9ff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", position: "sticky", top: 64, zIndex: 40 }}>
        <div style={{ ...styles.container, display: "flex", gap: 4, overflowX: "auto" }}>
          {SECTORS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSector(s.id)}
              style={{
                padding: "16px 20px",
                border: "none",
                borderBottom: `3px solid ${activeSector === s.id ? s.color : "transparent"}`,
                background: "transparent",
                cursor: "pointer",
                fontWeight: activeSector === s.id ? 700 : 500,
                fontSize: 14,
                color: activeSector === s.id ? s.color : "#6b7280",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <span>{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTOR CONTENT */}
      <div key={activeSector} className="sector-content">
        {/* Sector hero */}
        <section style={{ background: sector.bg, padding: "64px 24px", borderBottom: `3px solid ${sector.color}22` }}>
          <div style={{ ...styles.container, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 64, marginBottom: 20 }}>{sector.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: sector.color, marginBottom: 8 }}>
                {sector.tagline}
              </div>
              <h2 style={{ ...styles.sectionTitle, fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>
                MenuSafe pour les <span style={{ color: sector.color }}>{sector.label}s</span>
              </h2>
              <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.7 }}>{sector.hero}</p>
            </div>
            {/* Stat card */}
            <div style={{
              background: "#fff", borderRadius: 20, padding: "40px",
              border: `2px solid ${sector.color}33`,
              textAlign: "center",
              boxShadow: `0 8px 32px ${sector.color}11`,
            }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 72, fontWeight: 800, color: sector.color, lineHeight: 1 }}>
                {sector.stat.num}
              </div>
              <div style={{ fontSize: 15, color: "#4b5563", marginTop: 12, lineHeight: 1.6 }}>
                {sector.stat.label}
              </div>
            </div>
          </div>
        </section>

        {/* Pain points */}
        <section style={{ padding: "64px 24px", background: "#fff" }}>
          <div style={styles.container}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#dc2626", marginBottom: 12 }}>
                  Vos défis
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 24, color: "#111827" }}>
                  Ce qui rend la conformité difficile pour vous
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {sector.pain.map((p, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 12, alignItems: "flex-start",
                      padding: "14px 16px", background: "#fef2f2",
                      borderRadius: 10, border: "1px solid #fecaca",
                    }}>
                      <span style={{ color: "#dc2626", fontSize: 16, flexShrink: 0, marginTop: 1 }}>✗</span>
                      <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: sector.color, marginBottom: 12 }}>
                  La solution
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 24, color: "#111827" }}>
                  Ce que MenuSafe fait pour vous
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {sector.solution.map((s, i) => (
                    <div key={i} style={{
                      display: "flex", gap: 16, alignItems: "flex-start",
                      padding: "16px 18px", background: sector.bg,
                      borderRadius: 12, border: `1px solid ${sector.color}33`,
                    }}>
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{s.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 }}>{s.title}</div>
                        <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ALL PLANS */}
      <section style={{ background: "#f8f9ff", padding: "80px 24px" }}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={styles.sectionLabel}>Quel que soit votre profil</div>
            <h2 style={styles.sectionTitle}>Un plan adapté à votre taille</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { plan: "Gratuit", price: "0€", who: "Découverte", features: ["3 recettes", "1 établissement", "PDF conforme"], cta: "Commencer" },
              { plan: "Solo", price: "29€/mois", who: "Boulangerie · Food truck", features: ["50 recettes", "QR code carte", "PDF illimités"], cta: "Essai 7j gratuit" },
              { plan: "Pro", price: "59€/mois", who: "Restaurant · Hôtel", features: ["Recettes illimitées", "3 établissements", "Import IA · 8 langues"], cta: "Essai 7j gratuit", highlight: true },
              { plan: "Réseau", price: "149€/mois", who: "Franchise · Multi-sites", features: ["Établissements illimités", "Équipes", "API + Export CSV"], cta: "Essai 7j gratuit" },
            ].map((p, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16,
                padding: "28px 24px",
                border: p.highlight ? "2px solid #2563eb" : "1px solid #e5e7eb",
                position: "relative",
              }}>
                {p.highlight && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 700,
                    borderRadius: 100, padding: "4px 12px", whiteSpace: "nowrap",
                  }}>
                    LE PLUS POPULAIRE
                  </div>
                )}
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#111827", marginBottom: 4 }}>{p.plan}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>{p.who}</div>
                {p.features.map((f, j) => (
                  <div key={j} style={{ fontSize: 13, color: "#374151", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
                <Link href="/auth" style={{
                  display: "block", textAlign: "center", marginTop: 20,
                  padding: "10px 16px", borderRadius: 8, fontWeight: 700, fontSize: 14,
                  background: p.highlight ? "#2563eb" : "#f3f4f6",
                  color: p.highlight ? "#fff" : "#374151",
                  textDecoration: "none",
                }}>{p.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", padding: "40px 24px", textAlign: "center" }}>
        <Link href="/" style={{ ...styles.logo, justifyContent: "center", marginBottom: 12, color: "#fff" }}>MenuSafe</Link>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 8 }}>
          {[["Accueil", "/"], ["Tarifs", "/#pricing"], ["CGU", "/cgu"]].map(([l, h]) => (
            <Link key={h} href={h} style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#334155", marginTop: 20 }}>© 2026 MenuSafe</p>
      </footer>
    </div>
  );
}