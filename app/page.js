"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/lib/useWindowSize";
import DemoSection from "@/components/DemoSection";
import {
  Search, Smartphone, FileText, Camera,
  Building2, RefreshCw, BarChart2, Leaf,
  ShieldCheck, Globe
} from "lucide-react";

function Logo({ size = 28, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill={light ? "white" : "#1A1A1A"}/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill={light ? "#E5E5E5" : "#2D2D2D"}/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MenuMockup({ small = false }) {
  const w = small ? 240 : 300;
  return (
    <div style={{ background: "#1A1A1A", borderRadius: 24, padding: 3, maxWidth: w, margin: "0 auto", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}>
      <div style={{ background: "white", borderRadius: 22, overflow: "hidden" }}>
        <div style={{ background: "#1A1A1A", padding: "10px 14px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: small ? 11 : 13, fontWeight: 800, color: "white", margin: 0 }}>Le Bistrot du Coin</p>
          <div style={{ display: "flex", gap: 3 }}>
            {[{c:"FR",b:"#003189"},{c:"EN",b:"#C8102E"},{c:"ES",b:"#AA151B"},{c:"DE",b:"#000"}].map((f, i) => (
              <span key={i} style={{ fontSize: 9, fontWeight: 800, color: "white", background: i === 0 ? f.b : "rgba(255,255,255,0.15)", padding: "2px 4px", borderRadius: 4, opacity: i === 0 ? 1 : 0.6 }}>{f.c}</span>
            ))}
          </div>
        </div>
        <div style={{ padding: "8px 12px 6px", background: "#F7F7F5", borderBottom: "1px solid #EBEBEB" }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "#888", margin: "0 0 5px", textTransform: "uppercase" }}>Mes allergies</p>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {[
              { label: "Gluten", active: true, bg: "#FFF3CD", text: "#856404" },
              { label: "Lait", active: false },
              { label: "Poissons", active: true, bg: "#D0E8FF", text: "#084298" },
            ].map((a, i) => (
              <span key={i} style={{ fontSize: 9, fontWeight: 600, padding: "3px 7px", borderRadius: 20, background: a.active ? a.bg : "#F0F0F0", color: a.active ? a.text : "#BBB", border: a.active ? `1px solid ${a.text}30` : "1px solid #E8E8E8" }}>{a.label}</span>
            ))}
          </div>
        </div>
        <div style={{ padding: "8px 12px" }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 5px" }}>Plats</p>
          {[
            { name: "Blanquette de veau", ok: true, vegan: false },
            { name: "Sole meunière", ok: false },
            { name: "Buddha Bowl", ok: true, vegan: true },
          ].map((plat, i) => (
            <div key={i} style={{ padding: "6px 8px", borderRadius: 8, marginBottom: 4, background: plat.ok ? "white" : "#F9F9F9", border: `1px solid ${plat.ok ? "#EBEBEB" : "#F0F0F0"}`, opacity: plat.ok ? 1 : 0.55 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: small ? 10 : 11, fontWeight: 600, color: plat.ok ? "#1A1A1A" : "#999", margin: 0 }}>{plat.name}</p>
                <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                  {plat.vegan && <span style={{ fontSize: 8, background: "#F0FFF4", color: "#155724", padding: "1px 5px", borderRadius: 8, fontWeight: 700 }}>Vegan</span>}
                  {!plat.ok && <span style={{ fontSize: 8, background: "#FFF3CD", color: "#856404", padding: "1px 5px", borderRadius: 8, fontWeight: 600 }}>⚠</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 8, color: "#CCC", textAlign: "center", paddingBottom: 6, margin: 0 }}>Propulsé par MenuSafe</p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    Icon: Search,
    title: "Détection allergènes en temps réel",
    desc: "Base de 900+ ingrédients. Tapez un ingrédient, les 14 allergènes légaux s'affichent instantanément. Autocomplétion intelligente.",
    color: "#F0F7FF", iconColor: "#2563EB",
  },
  {
    Icon: Smartphone,
    title: "Carte interactive multilingue",
    desc: "Un QR code par table. Vos clients scannent, choisissent leur langue (8 disponibles) et cochent leurs allergies. Les plats incompatibles sont grisés.",
    color: "#F0FFF4", iconColor: "#16A34A",
  },
  {
    Icon: FileText,
    title: "PDF carte complète",
    desc: "Document A4 avec tous vos plats par catégorie et leurs allergènes. Conforme INCO. À plastifier et afficher dans votre établissement.",
    color: "#FFF7F0", iconColor: "#EA580C",
  },
  {
    Icon: Camera,
    title: "Import IA depuis une photo",
    desc: "Photographiez votre carte. L'IA extrait les plats, génère les traductions en 8 langues et détecte les allergènes en une seule analyse.",
    color: "#FDF4FF", iconColor: "#9333EA",
  },
  {
    Icon: Leaf,
    title: "Labels vegan & végétarien",
    desc: "L'IA détecte automatiquement les plats végétariens et vegan. Labels affichés sur la carte client. Certification viande (Halal, Casher, Label Rouge, Bio) disponible.",
    color: "#F0FFF4", iconColor: "#16A34A",
  },
  {
    Icon: BarChart2,
    title: "Analytics clients",
    desc: "Suivez les scans de votre QR code, les allergènes les plus cochés par vos clients, les langues utilisées et les horaires de fréquentation.",
    color: "#F0F7FF", iconColor: "#2563EB",
  },
  {
    Icon: Building2,
    title: "Multi-établissements",
    desc: "Gérez plusieurs adresses depuis un seul compte avec navigation par onglets. Chaque établissement a son propre QR code, sa propre carte et ses propres analytics.",
    color: "#FFF7F0", iconColor: "#EA580C",
  },
  {
    Icon: RefreshCw,
    title: "Mise à jour instantanée",
    desc: "Modifiez une recette et la carte interactive se met à jour immédiatement. Le QR code ne change jamais — imprimez-le une seule fois.",
    color: "#F0FFF4", iconColor: "#16A34A",
  },
];

function FeatureGrid({ isMobile }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: isMobile ? 12 : 20 }}>
      {FEATURES.map(({ Icon, title, desc, color, iconColor }, i) => (
        <div key={i} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: isMobile ? "16px" : "24px", display: isMobile ? "flex" : "block", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: isMobile ? 0 : 16 }}>
            <Icon size={22} color={iconColor} strokeWidth={1.75} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px" }}>{title}</p>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: 0 }}>{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const LANDING_PLANS = [
  {
    id: "solo", name: "Solo", badge: null, desc: "Pour 1 établissement",
    note: null,
    monthly: 29, yearly: 290,
    features: ["Jusqu'à 3 recettes (gratuit)", "50 recettes max", "PDF conformes INCO", "QR code carte multilingue", "Filtrage allergènes client", "1 import IA / mois", "4 langues (FR, EN, ES, DE)", "1 établissement"],
    missing: ["Analytics clients", "8 langues", "Branding personnalisé"],
  },
  {
    id: "pro", name: "Pro", badge: "Plus populaire", desc: "Jusqu'à 3 établissements",
    note: null,
    monthly: 59, yearly: 590,
    features: ["Recettes illimitées", "3 établissements", "Import IA illimité", "Carte multilingue 8 langues", "PDF carte complète", "Analytics clients (scans, langues, allergènes)", "Labels vegan / végétarien / Halal", "Branding personnalisé (logo + couleurs)", "Gestion équipe (3 membres)", "Export CSV", "Support prioritaire"],
    missing: [],
  },
  {
    id: "reseau", name: "Réseau", badge: null, desc: "4+ établissements / franchises",
    note: null,
    monthly: 149, yearly: 1490,
    features: ["Tout Pro inclus", "4 établissements inclus", "+15€ / établissement supplémentaire", "Membres illimités", "Accès API", "Account manager dédié", "Contrat annuel possible"],
    missing: [],
  },
];

function LandingPricing({ isMobile, goAuth }) {
  const [billing, setBilling] = useState("monthly");
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div style={{ display: "inline-flex", background: "#F0F0F0", borderRadius: 12, padding: 4, gap: 4 }}>
          <button onClick={() => setBilling("monthly")}
            style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "none", cursor: "pointer", background: billing === "monthly" ? "#1A1A1A" : "transparent", color: billing === "monthly" ? "white" : "#555" }}>
            Mensuel
          </button>
          <button onClick={() => setBilling("yearly")}
            style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, background: billing === "yearly" ? "#1A1A1A" : "transparent", color: billing === "yearly" ? "white" : "#555" }}>
            Annuel
            <span style={{ fontSize: 11, fontWeight: 700, background: "#D4EDDA", color: "#155724", padding: "2px 7px", borderRadius: 20 }}>−17%</span>
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 14 : 20, maxWidth: 960, margin: "0 auto", alignItems: "stretch" }}>
        {LANDING_PLANS.map((plan) => {
          const price = billing === "yearly" ? plan.yearly : plan.monthly;
          const perMonth = billing === "yearly" ? Math.round(plan.yearly / 12) : plan.monthly;
          return (
            <div key={plan.id} style={{ background: "white", border: plan.badge ? "2px solid #1A1A1A" : "1px solid #E8E8E8", borderRadius: 18, padding: isMobile ? "22px" : "26px", position: "relative", display: "flex", flexDirection: "column" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#1A1A1A", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: "0 0 2px" }}>{plan.name}</p>
                <p style={{ fontSize: 12, color: "#999", margin: "0 0 4px" }}>{plan.desc}</p>
                {plan.note ? <p style={{ fontSize: 11, color: "#4ADE80", margin: 0, fontWeight: 600 }}>{plan.note}</p> : <p style={{ fontSize: 11, margin: 0 }}>&nbsp;</p>}
              </div>
              <div style={{ marginBottom: 18 }}>
                {billing === "yearly" ? (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 34, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>{price}€</span>
                      <span style={{ fontSize: 13, color: "#999" }}>/an</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>
                      soit <strong style={{ color: "#1A1A1A" }}>{perMonth}€/mois</strong>
                      <span style={{ color: "#38A169", fontWeight: 600 }}> · 2 mois offerts</span>
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 34, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>{price}€</span>
                      <span style={{ fontSize: 13, color: "#999" }}>/mois</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>
                      ou <span style={{ color: "#38A169", fontWeight: 600 }}>{plan.yearly}€/an</span>
                      <span style={{ color: "#38A169" }}> (2 mois offerts)</span>
                    </p>
                  </>
                )}
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", flex: 1 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ fontSize: 13, color: "#444", padding: "4px 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "#38A169", flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
                {plan.missing.map((f, j) => (
                  <li key={"m"+j} style={{ fontSize: 13, color: "#CCC", padding: "4px 0", display: "flex", gap: 8 }}>
                    <span style={{ flexShrink: 0 }}>—</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={goAuth}
                style={{ width: "100%", padding: "12px", fontSize: 14, fontWeight: 700, background: plan.badge ? "#1A1A1A" : "white", color: plan.badge ? "white" : "#1A1A1A", border: "1.5px solid #1A1A1A", borderRadius: 10, cursor: "pointer" }}>
                Commencer l'essai gratuit
              </button>
              <p style={{ fontSize: 11, color: "#BBB", textAlign: "center", margin: "8px 0 0" }}>Sans frais pendant 7 jours</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { isMobile, isTablet } = useWindowSize();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmall = isMobile || isTablet;

  const goAuth = () => router.push("/auth");
  const goDashboard = () => router.push("/dashboard");

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "white" }}>

      {/* Drawer mobile */}
      {drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={() => setDrawerOpen(false)} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 280, background: "white", padding: "24px", display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Logo size={24} />
                <span style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>MenuSafe</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888", padding: 0 }}>✕</button>
            </div>
            {[
              { label: "Fonctionnalités", href: "#features" },
              { label: "Tarifs", href: "#pricing" },
              { label: "Loi INCO", href: "/loi-inco" },
              { label: "Comparatif", href: "/comparatif" },
              { label: "Votre métier", href: "/metiers" },
              { label: "Intégrations", href: "/partenaires" },
            ].map((item) => (
              <a key={item.label} href={item.href} onClick={() => setDrawerOpen(false)}
                style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A", textDecoration: "none", padding: "14px 0", borderBottom: "1px solid #F0F0F0" }}>
                {item.label}
              </a>
            ))}
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              <button style={{ padding: "12px", fontSize: 14, fontWeight: 600, background: "white", color: "#1A1A1A", border: "1px solid #E0E0E0", borderRadius: 10, cursor: "pointer" }} onClick={() => { setDrawerOpen(false); goDashboard(); }}>Se connecter</button>
              <button style={{ padding: "12px", fontSize: 14, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }} onClick={() => { setDrawerOpen(false); goAuth(); }}>Essayer gratuitement →</button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav style={s.nav}>
        <div style={{ ...s.navInner, maxWidth: 1100 }}>
          <div style={s.logo} onClick={() => router.push("/")}>
            <Logo size={26} />
            <p style={s.logoName}>MenuSafe</p>
          </div>
          {isMobile ? (
            <button onClick={() => setDrawerOpen(true)} style={{ background: "none", border: "1px solid #E0E0E0", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 18, color: "#1A1A1A" }}>
              ☰
            </button>
          ) : (
            <div style={s.navRight}>
              <a href="#features" style={s.navLink}>Fonctionnalités</a>
              <a href="#pricing" style={s.navLink}>Tarifs</a>
              <div style={{ position: "relative" }}
                onMouseEnter={e => e.currentTarget.querySelector(".dd").style.display = "block"}
                onMouseLeave={e => e.currentTarget.querySelector(".dd").style.display = "none"}>
                <button style={{ ...s.navLink, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0, fontSize: 13 }}>
                  Ressources
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <div className="dd" style={{ display: "none", position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "8px", minWidth: 220, boxShadow: "0 8px 32px rgba(0,0,0,0.10)", zIndex: 200 }}>
                  {[
                    { label: "Loi INCO & Réglementation", href: "/loi-inco", sub: "Guide + simulateur d'amende" },
                    { label: "Comparatif", href: "/comparatif", sub: "MenuSafe vs classeur papier" },
                    { label: "Votre métier", href: "/metiers", sub: "Restaurant, boulangerie, hôtel…" },
                    { label: "Intégrations", href: "/partenaires", sub: "Caisses, CSV, API" },
                  ].map((item) => (
                    <a key={item.href} href={item.href}
                      style={{ display: "block", padding: "10px 12px", borderRadius: 8, textDecoration: "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F7F7F5"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>{item.sub}</div>
                    </a>
                  ))}
                </div>
              </div>
              <button style={s.btnSecondary} onClick={goDashboard}>Se connecter</button>
              <button style={s.btnPrimary} onClick={goAuth}>Essayer gratuitement →</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ ...s.hero, padding: isMobile ? "48px 20px 40px" : "72px 20px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr", gap: isSmall ? 40 : 56, alignItems: "center" }}>
          <div>
            <div style={s.heroBadge}>✓ Conforme loi INCO · 14 allergènes légaux</div>
            <h1 style={{ ...s.h1, fontSize: isMobile ? 30 : 42 }}>
              Gérez vos allergènes,<br />
              enchantez vos clients,<br />
              <span style={{ color: "#1A1A1A" }}>en 5 minutes.</span>
            </h1>
            <p style={{ ...s.heroSub, fontSize: isMobile ? 15 : 16 }}>
              Obligation légale depuis 2014, encore violée par <strong>75% des restaurants</strong>. MenuSafe gère vos allergènes, détecte le vegan/végétarien, génère vos PDF conformes et crée votre carte interactive multilingue.
            </p>
            <div style={{ marginBottom: isMobile ? 28 : 36 }}>
              <button style={{ ...s.ctaPrimary, width: isMobile ? "100%" : "auto", textAlign: "center" }} onClick={goAuth}>
                Créer mon compte gratuitement →
              </button>
              <p style={s.ctaNote}>Sans frais pendant 7 jours · Annulation en 1 clic</p>
            </div>
            <div style={{ ...s.heroStats, gap: isMobile ? 16 : 28 }}>
              {[
                { n: "1 500€", l: "Amende par infraction" },
                { n: "8", l: "Langues disponibles" },
                { n: "900+", l: "Ingrédients détectés" },
              ].map((st, i) => (
                <div key={i} style={s.heroStat}>
                  <span style={{ ...s.heroStatN, fontSize: isMobile ? 20 : 24 }}>{st.n}</span>
                  <span style={s.heroStatL}>{st.l}</span>
                </div>
              ))}
            </div>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <MenuMockup small={isTablet} />
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ ...s.section, padding: isMobile ? "48px 20px" : "80px 20px" }}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>Fonctionnalités</p>
          <h2 style={{ ...s.h2, fontSize: isMobile ? 24 : 32 }}>Tout ce qu'il faut, rien de superflu</h2>
          <FeatureGrid isMobile={isMobile} />
        </div>
      </section>

      {/* Demo */}
      <DemoSection />

      {/* Analytics — nouvelle section */}
      <section style={{ ...s.section, background: "#F7F7F5", padding: isMobile ? "48px 20px" : "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr", gap: isSmall ? 32 : 60, alignItems: "center" }}>
          <div>
            <p style={{ ...s.eyebrow, textAlign: "left" }}>Nouveau · Plans Pro & Réseau</p>
            <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "#1A1A1A", margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Connaissez les allergènes<br />de vos clients
            </h2>
            <p style={{ fontSize: isMobile ? 14 : 15, color: "#555", lineHeight: 1.7, marginBottom: 20 }}>
              Chaque scan de QR code génère des données anonymisées. Découvrez quels allergènes sont les plus fréquents, quelles langues utilisent vos clients et à quelles heures ils consultent votre carte.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <BarChart2 size={16} color="#2563EB" />, text: "Allergènes les plus cochés par vos clients" },
                { icon: <Globe size={16} color="#2563EB" />, text: "Langues utilisées — adaptez votre service" },
                { icon: <Smartphone size={16} color="#2563EB" />, text: "Scans par jour, semaine, mois" },
                { icon: <ShieldCheck size={16} color="#2563EB" />, text: "Export PDF du rapport analytics" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F0F7FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <p style={{ fontSize: 14, color: "#444", margin: 0 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Mockup analytics */}
          <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Analytics — Ce mois-ci</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { val: "247", label: "Scans QR", color: "#1A1A1A" },
                { val: "8", label: "Langues", color: "#1A1A1A" },
                { val: "EN 34%", label: "Langue #1", color: "#2563EB" },
                { val: "Gluten", label: "Allergène #1", color: "#856404" },
              ].map((st, i) => (
                <div key={i} style={{ background: "#F7F7F5", borderRadius: 10, padding: "12px" }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: st.color, margin: "0 0 2px", letterSpacing: "-0.02em" }}>{st.val}</p>
                  <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{st.label}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>Top allergènes clients</p>
            {[
              { label: "Gluten", pct: 68, color: "#FFF3CD", text: "#856404" },
              { label: "Lait", pct: 52, color: "#E8F4FF", text: "#084298" },
              { label: "Œufs", pct: 31, color: "#FFF9C4", text: "#7A6800" },
            ].map((a, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#444" }}>{a.label}</span>
                  <span style={{ fontSize: 12, color: "#888" }}>{a.pct}%</span>
                </div>
                <div style={{ background: "#F0F0F0", borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ height: 6, width: `${a.pct}%`, background: a.text, borderRadius: 4, opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carte interactive */}
      <section style={{ ...s.section, background: "white", padding: isMobile ? "48px 20px" : "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr", gap: isSmall ? 32 : 60, alignItems: "center" }}>
          <div>
            <p style={{ ...s.eyebrow, textAlign: "left", color: "#1A1A1A" }}>Nouveau · Plans Pro & Réseau</p>
            <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "#1A1A1A", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              La carte interactive<br />que vos clients adorent
            </h2>
            <p style={{ fontSize: isMobile ? 14 : 15, color: "#555", lineHeight: 1.7, marginBottom: 20 }}>
              Un seul QR code sur chaque table. Le client scanne, sélectionne sa langue et coche ses allergies. Les plats incompatibles s'affichent grisés. Les labels vegan et végétarien sont visibles en un coup d'œil.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {[
                ["8 langues", "traductions stockées, changement instantané"],
                ["Filtrage allergènes", "en temps réel"],
                ["Labels vegan / végétarien", "affichés sur chaque plat"],
                ["Mise à jour automatique", "quand vous modifiez vos recettes"],
                ["QR code permanent", "imprimez-le une seule fois"],
              ].map(([bold, rest], i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: "#4ADE80", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <p style={{ fontSize: 13, color: "#444", margin: 0, lineHeight: 1.5 }}><strong>{bold}</strong> — {rest}</p>
                </div>
              ))}
            </div>
            <button style={{ ...s.ctaPrimary, width: isMobile ? "100%" : "auto" }} onClick={goAuth}>
              Créer ma carte interactive →
            </button>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <MenuMockup small={isTablet} />
            </div>
          )}
        </div>
      </section>

      {/* Import IA */}
      <section style={{ ...s.section, background: "#F7F7F5", padding: isMobile ? "48px 20px" : "80px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr", gap: isSmall ? 32 : 48, alignItems: "center" }}>
          <div style={{ background: "white", borderRadius: 16, padding: isMobile ? 16 : 24, border: "1px solid #EBEBEB", order: isMobile ? -1 : 0 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>Import IA en action</p>
            <div style={{ background: "#F7F7F5", borderRadius: 10, padding: "10px 14px", marginBottom: 8, border: "1px dashed #DDD" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px" }}>Carte uploadée</p>
              <span style={{ fontSize: 11, background: "#D4EDDA", color: "#155724", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>8 langues générées en 1 passe</span>
            </div>
            {[
              { name: "Sole meunière", source: "carte", allergens: ["Poissons", "Gluten", "Lait"] },
              { name: "Buddha Bowl", source: "ia", allergens: [], vegan: true },
            ].map((p, i) => (
              <div key={i} style={{ background: p.source === "ia" ? "#FDFAFF" : "white", border: `1px solid ${p.source === "ia" ? "#E8D5FF" : "#EBEBEB"}`, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>{p.name}</p>
                  <div style={{ display: "flex", gap: 4 }}>
                    {p.vegan && <span style={{ fontSize: 9, fontWeight: 700, background: "#F0FFF4", color: "#155724", padding: "1px 6px", borderRadius: 10 }}>Vegan</span>}
                    <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 20, background: p.source === "ia" ? "#F0E6FF" : "#E6F1FB", color: p.source === "ia" ? "#5A2D8E" : "#084298" }}>
                      {p.source === "ia" ? "IA" : "Carte"}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 6 }}>
                  {p.allergens.map((a, j) => (<span key={j} style={{ fontSize: 9, background: "#FFF3CD", color: "#856404", padding: "2px 5px", borderRadius: 10 }}>{a}</span>))}
                  {p.allergens.length === 0 && <span style={{ fontSize: 9, background: "#F0FFF4", color: "#155724", padding: "2px 5px", borderRadius: 10 }}>Aucun allergène</span>}
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  <div style={{ flex: 2, padding: "5px", fontSize: 11, fontWeight: 700, background: "#1A1A1A", color: "white", borderRadius: 7, textAlign: "center" }}>✓ Valider</div>
                  <div style={{ flex: 1, padding: "5px", fontSize: 11, color: "#888", border: "1px solid #E0E0E0", borderRadius: 7, textAlign: "center" }}>Ignorer</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <p style={{ ...s.eyebrow, textAlign: "left" }}>Import IA · Pro & Réseau</p>
            <h2 style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, color: "#1A1A1A", margin: "0 0 14px", letterSpacing: "-0.02em" }}>Toute votre carte<br />en une photo</h2>
            <p style={{ fontSize: isMobile ? 14 : 15, color: "#555", lineHeight: 1.7, marginBottom: 16 }}>
              Photographiez votre carte ou uploadez un PDF. L'IA lit tous vos plats, génère les traductions en 8 langues, détecte les allergènes et identifie automatiquement les plats vegan et végétariens.
            </p>
            {["Photo, image ou PDF", "Ingrédients lus directement", "Labels vegan / végétarien détectés", "Traductions 8 langues stockées", "Détection allergènes automatique", "Validation plat par plat"].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: "#38A169", fontWeight: 700, flexShrink: 0 }}>✓</span>
                <p style={{ fontSize: 13, color: "#444", margin: 0 }}>{f}</p>
              </div>
            ))}
            <button style={{ ...s.ctaPrimary, marginTop: 20, width: isMobile ? "100%" : "auto" }} onClick={goAuth}>
              Essayer gratuitement →
            </button>
          </div>
        </div>
      </section>

      {/* Risque */}
      <section style={{ ...s.section, padding: isMobile ? "48px 20px" : "80px 20px" }}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>Le risque réel</p>
          <h2 style={{ ...s.h2, fontSize: isMobile ? 24 : 32 }}>Une amende qui se justifie en 3 secondes</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))", gap: isMobile ? 12 : 20, maxWidth: 760, margin: "0 auto" }}>
            {[
              { title: "Sans MenuSafe", bordered: false, items: [
                ["✗", "#E53E3E", "Amende DGCCRF : jusqu'à 1 500€"],
                ["✗", "#E53E3E", "Publication sur Alim'Confiance (Google)"],
                ["✗", "#E53E3E", "Fermeture temporaire en récidive"],
                ["✗", "#E53E3E", "Classeur papier toujours périmé"],
                ["✗", "#E53E3E", "3-4h/mois de mise à jour manuelle"],
              ]},
              { title: "Avec MenuSafe", bordered: true, items: [
                ["✓", "#38A169", "Conformité garantie en 5 minutes"],
                ["✓", "#38A169", "PDF légal en 1 clic"],
                ["✓", "#38A169", "Carte interactive multilingue"],
                ["✓", "#38A169", "Analytics clients inclus"],
                ["✓", "#38A169", "À partir de 0,97€/jour"],
              ]},
            ].map((card, i) => (
              <div key={i} style={{ background: "white", border: card.bordered ? "2px solid #1A1A1A" : "1px solid #E8E8E8", borderRadius: 16, padding: isMobile ? "20px" : "28px" }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 14 }}>{card.title}</p>
                {card.items.map(([sym, color, text], j) => (
                  <div key={j} style={{ fontSize: 13, color: "#444", padding: "6px 0", borderBottom: "1px solid #F5F5F5", display: "flex", gap: 8 }}>
                    <span style={{ color, fontWeight: 700, flexShrink: 0 }}>{sym}</span>{text}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <a href="/loi-inco" style={{ fontSize: 13, color: "#2563EB", fontWeight: 600, textDecoration: "none" }}>
              Calculer mon risque personnalisé →
            </a>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section style={{ ...s.section, background: "#F7F7F5", padding: isMobile ? "48px 20px" : "80px 20px" }}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>Témoignages</p>
          <h2 style={{ ...s.h2, fontSize: isMobile ? 24 : 32 }}>Ils ont évité l'amende</h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))", gap: isMobile ? 12 : 20 }}>
            {[
              { name: "Sophie M.", role: "Restauratrice · Lyon", quote: "J'avais reçu un avertissement de la DGCCRF. Avec MenuSafe j'ai mis tous mes plats en conformité en une après-midi.", stars: 5 },
              { name: "Karim B.", role: "Food truck · Paris", quote: "Mon menu change chaque semaine. J'ai photographié ma carte, l'IA a tout importé en 10 minutes. Mes clients étrangers adorent choisir leur langue.", stars: 5 },
              { name: "Marie-Claire D.", role: "Boulangerie · Bordeaux", quote: "Simple, rapide, efficace. Le PDF carte complète est vraiment professionnel — je l'ai plastifié et affiché derrière la caisse.", stars: 5 },
            ].map((t, i) => (
              <div key={i} style={{ background: "white", borderRadius: 14, padding: isMobile ? "18px" : "24px", border: "1px solid #EBEBEB", display: isMobile && i === 2 ? "none" : "block" }}>
                <p style={{ color: "#F6C000", fontSize: 15, margin: "0 0 10px" }}>{"★".repeat(t.stars)}</p>
                <p style={{ fontSize: 13, color: "#333", lineHeight: 1.6, margin: "0 0 14px", fontStyle: "italic" }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#1A1A1A", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{t.name[0]}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: "#999", margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ ...s.section, padding: isMobile ? "48px 20px" : "80px 20px" }}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>Tarifs</p>
          <h2 style={{ ...s.h2, fontSize: isMobile ? 24 : 32 }}>Moins cher qu'une seule amende</h2>
          <p style={{ textAlign: "center", fontSize: isMobile ? 13 : 15, color: "#666", marginBottom: 36, marginTop: -16 }}>
            Une amende DGCCRF coûte 1 500€. Le plan Solo annuel MenuSafe coûte 290€.
          </p>
          <LandingPricing isMobile={isMobile} goAuth={goAuth} />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ ...s.section, background: "#F7F7F5", padding: isMobile ? "48px 20px" : "80px 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={s.eyebrow}>FAQ</p>
          <h2 style={{ ...s.h2, fontSize: isMobile ? 24 : 32 }}>Questions fréquentes</h2>
          {[
            { q: "Est-ce vraiment obligatoire ?", a: "Oui. Le règlement UE n°1169/2011 (INCO), entré en vigueur en France en décembre 2014, oblige tous les établissements de restauration commerciale à déclarer les 14 allergènes majeurs. L'absence d'information est passible d'une amende allant jusqu'à 1 500€ par infraction." },
            { q: "Qu'est-ce que les analytics clients ?", a: "Chaque fois qu'un client scanne votre QR code, MenuSafe enregistre (de façon anonyme) la langue choisie et les allergènes cochés. Vous accédez à un tableau de bord qui vous montre les allergènes les plus fréquents, les langues utilisées et les horaires de fréquentation. Disponible en plans Pro et Réseau." },
            { q: "Comment fonctionne la détection vegan/végétarien ?", a: "Lors de l'import IA ou de la saisie manuelle, MenuSafe analyse les ingrédients de chaque plat et propose automatiquement les labels végétarien et vegan. Vous validez ou ajustez avant publication. Ces labels sont ensuite visibles sur la carte interactive client." },
            { q: "La carte multilingue fonctionne dans quelles langues ?", a: "Français, anglais, espagnol, allemand, italien, néerlandais, japonais et mandarin (8 langues). Les traductions sont générées lors de l'import IA et stockées définitivement — le changement de langue est instantané, sans aucun appel API supplémentaire." },
            { q: "Comment fonctionne l'import par photo ?", a: "Vous photographiez votre carte ou uploadez un PDF. L'IA lit les plats, génère les traductions en 8 langues, détecte les allergènes et identifie les plats vegan/végétariens en une seule analyse (60 à 90 secondes). Disponible en plans Pro et Réseau." },
            { q: "Puis-je essayer avant de payer ?", a: "Oui, 7 jours d'essai complet sans carte bancaire. Si vous n'êtes pas convaincu, vous ne payez rien." },
          ].map((faq, i) => (
            <div key={i} style={{ borderBottom: "1px solid #EBEBEB", padding: "20px 0" }}>
              <p style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px" }}>{faq.q}</p>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section style={{ background: "#0F0F0F", padding: isMobile ? "56px 20px" : "80px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Logo size={isMobile ? 40 : 52} light />
          </div>
          <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "white", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Prêt à être en conformité ?
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 15, color: "rgba(255,255,255,0.55)", marginBottom: 28, lineHeight: 1.7 }}>
            Rejoignez les restaurateurs qui dorment tranquilles. PDF conformes, carte interactive multilingue, analytics clients, détection vegan — tout en un.
          </p>
          <button style={{ fontSize: isMobile ? 15 : 16, fontWeight: 700, padding: isMobile ? "14px 24px" : "16px 32px", background: "white", color: "#0F0F0F", border: "none", borderRadius: 12, cursor: "pointer", width: isMobile ? "100%" : "auto" }} onClick={goAuth}>
            Créer mon compte gratuitement →
          </button>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>7 jours gratuits · Sans carte bancaire · Annulation en 1 clic</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#080808", padding: "48px 20px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 32 : 48, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Logo size={20} light />
                <span style={{ fontSize: 14, fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>MenuSafe</span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: "0 0 16px", maxWidth: 220 }}>
                La solution allergènes pour les professionnels de la restauration. Conforme règlement INCO UE n°1169/2011.
              </p>
              <a href="mailto:contact@menusafe.fr" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>contact@menusafe.fr</a>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px" }}>Produit</p>
              {[{ label: "Fonctionnalités", href: "/#features" }, { label: "Tarifs", href: "/#pricing" }, { label: "FAQ", href: "/#faq" }, { label: "Se connecter", href: "/auth" }].map((l, i) => (
                <a key={i} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px" }}>Ressources</p>
              {[{ label: "Loi INCO & Réglementation", href: "/loi-inco" }, { label: "Comparatif", href: "/comparatif" }, { label: "Votre métier", href: "/metiers" }, { label: "Intégrations", href: "/partenaires" }].map((l, i) => (
                <a key={i} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px" }}>Légal</p>
              {[{ label: "Conditions générales", href: "/cgu" }, { label: "Confidentialité", href: "/confidentialite" }, { label: "Mentions légales", href: "/mentions-legales" }].map((l, i) => (
                <a key={i} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>
              ))}
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "20px 0 14px" }}>Contact</p>
              {[{ label: "Formulaire de contact", href: "/support" }, { label: "Mon compte", href: "/parametres" }].map((l, i) => (
                <a key={i} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: 8 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2026 MenuSafe · Tous droits réservés</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>Conforme règlement INCO UE n°1169/2011 · Paiement sécurisé par Stripe</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const s = {
  nav: { background: "white", borderBottom: "1px solid #F0F0F0", position: "sticky", top: 0, zIndex: 100 },
  navInner: { maxWidth: 1100, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
  logoName: { fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: "-0.02em" },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  navLink: { fontSize: 13, color: "#555", textDecoration: "none", fontWeight: 500 },
  btnPrimary: { fontSize: 13, fontWeight: 600, padding: "8px 16px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" },
  btnSecondary: { fontSize: 13, fontWeight: 600, padding: "8px 16px", background: "white", color: "#1A1A1A", border: "1px solid #E0E0E0", borderRadius: 10, cursor: "pointer" },
  hero: { background: "white", borderBottom: "1px solid #F0F0F0" },
  heroBadge: { display: "inline-block", fontSize: 12, fontWeight: 600, background: "#D4EDDA", color: "#155724", padding: "5px 14px", borderRadius: 20, marginBottom: 16 },
  h1: { fontWeight: 800, color: "#1A1A1A", margin: "0 0 16px", letterSpacing: "-0.03em", lineHeight: 1.15 },
  heroSub: { color: "#555", lineHeight: 1.7, marginBottom: 24 },
  ctaPrimary: { fontSize: 15, fontWeight: 700, padding: "14px 28px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, cursor: "pointer" },
  ctaNote: { fontSize: 12, color: "#999", margin: "10px 0 0" },
  heroStats: { display: "flex", marginTop: 8 },
  heroStat: { display: "flex", flexDirection: "column" },
  heroStatN: { fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" },
  heroStatL: { fontSize: 11, color: "#888", marginTop: 2 },
  section: { padding: "80px 20px" },
  sectionInner: { maxWidth: 1100, margin: "0 auto" },
  eyebrow: { fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 },
  h2: { fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 40px", letterSpacing: "-0.02em" },
};