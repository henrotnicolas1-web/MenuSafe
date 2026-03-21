"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const ALLERGENS_14 = [
  { id: "gluten",      emoji: "🌾", label: "Gluten",           desc: "Blé, seigle, orge, avoine, épeautre" },
  { id: "crustaces",   emoji: "🦞", label: "Crustacés",        desc: "Crevettes, homard, crabe, langoustine" },
  { id: "oeufs",       emoji: "🥚", label: "Œufs",             desc: "Tous les œufs et produits à base d'œufs" },
  { id: "poissons",    emoji: "🐟", label: "Poissons",         desc: "Tous les poissons et produits dérivés" },
  { id: "arachides",   emoji: "🥜", label: "Arachides",        desc: "Cacahuètes et produits dérivés" },
  { id: "soja",        emoji: "🫘", label: "Soja",             desc: "Tofu, lait de soja, édamame" },
  { id: "lait",        emoji: "🥛", label: "Lait",             desc: "Lait, beurre, fromage, crème, yaourt" },
  { id: "fruits_coq",  emoji: "🌰", label: "Fruits à coque",   desc: "Noix, noisette, amande, cajou, pistache" },
  { id: "celeri",      emoji: "🌿", label: "Céleri",           desc: "Céleri-rave, céleri branche, graines" },
  { id: "moutarde",    emoji: "🟡", label: "Moutarde",         desc: "Graines, farine, huile de moutarde" },
  { id: "sesame",      emoji: "⚪", label: "Graines de sésame",desc: "Tahini, huile de sésame, pain sésame" },
  { id: "so2",         emoji: "🍷", label: "Sulfites / SO₂",   desc: "Vins, fruits secs, conserves, vinaigre" },
  { id: "lupin",       emoji: "💛", label: "Lupin",            desc: "Farine de lupin, graines de lupin" },
  { id: "mollusques",  emoji: "🐚", label: "Mollusques",       desc: "Moules, palourdes, coquilles Saint-Jacques" },
];

const TIMELINE = [
  { year: "2011", title: "Règlement UE n°1169/2011", desc: "Publication du règlement européen INCO (Information des Consommateurs) imposant la déclaration des 14 allergènes." },
  { year: "2014", title: "Entrée en vigueur en France", desc: "Obligation légale pour tous les établissements de restauration commerciale de déclarer par écrit les allergènes présents dans chaque plat." },
  { year: "2015", title: "Contrôles DGCCRF débutent", desc: "La Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes lance des inspections systématiques." },
  { year: "2024", title: "Durcissement des sanctions", desc: "Recrudescence des contrôles post-Covid. Les amendes atteignent 1 500€ par infraction. Publication sur Alim'Confiance indexée par Google." },
];

const RISK_LEVELS = [
  { min: 0,  max: 25,  label: "Risque faible",   color: "#22c55e", bg: "#f0fdf4", desc: "Profil peu exposé. Restez vigilant lors des prochains contrôles." },
  { min: 26, max: 50,  label: "Risque modéré",   color: "#f59e0b", bg: "#fffbeb", desc: "Plusieurs failles identifiées. Une mise en conformité rapide s'impose." },
  { min: 51, max: 75,  label: "Risque élevé",    color: "#ef4444", bg: "#fef2f2", desc: "Profil très exposé. Une inspection DGCCRF serait problématique." },
  { min: 76, max: 100, label: "Risque critique", color: "#991b1b", bg: "#fff1f2", desc: "Non-conformité quasi certaine. Agissez immédiatement." },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRiskLevel(score) {
  return RISK_LEVELS.find(r => score >= r.min && score <= r.max) || RISK_LEVELS[0];
}

// ─── Components ──────────────────────────────────────────────────────────────

function AllergenCard({ allergen, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#eff6ff" : "#fff",
        border: `1.5px solid ${hovered ? "#2563eb" : "#e5e7eb"}`,
        borderRadius: 12,
        padding: "14px 16px",
        cursor: "default",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        animationDelay: `${index * 40}ms`,
      }}
    >
      <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{allergen.emoji}</span>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", fontFamily: "'Syne', sans-serif" }}>{allergen.label}</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, lineHeight: 1.4 }}>{allergen.desc}</div>
      </div>
    </div>
  );
}

function SimulatorQuestion({ label, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 10, fontFamily: "'Syne', sans-serif" }}>{label}</div>
      {children}
    </div>
  );
}

function RadioGroup({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: `2px solid ${value === opt.value ? "#2563eb" : "#e5e7eb"}`,
            background: value === opt.value ? "#eff6ff" : "#fff",
            color: value === opt.value ? "#2563eb" : "#374151",
            fontWeight: value === opt.value ? 700 : 500,
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function GaugeBar({ score, color }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const segments = [
    { color: "#22c55e", label: "Faible" },
    { color: "#f59e0b", label: "Modéré" },
    { color: "#ef4444", label: "Élevé" },
    { color: "#991b1b", label: "Critique" },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Bar segments */}
      <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ flex: 1, background: s.color, opacity: 0.2 + (score > i * 25 ? 0.8 : 0) }} />
        ))}
      </div>
      {/* Needle */}
      <div style={{ position: "relative", height: 20 }}>
        <div
          style={{
            position: "absolute",
            left: `${animated}%`,
            transform: "translateX(-50%)",
            transition: "left 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
            top: 0,
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: color,
            border: "3px solid #fff",
            boxShadow: `0 0 0 3px ${color}44`,
          }} />
        </div>
      </div>
      {/* Labels */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {segments.map((s, i) => (
          <span key={i} style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{s.label}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LoiIncoPage() {
  // Simulator state
  const [step, setStep] = useState("quiz"); // quiz | result
  const [formData, setFormData] = useState({
    type: null,
    dishes: null,
    updates: null,
    format: null,
    controls: null,
  });
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [score, setScore] = useState(0);
  const [amende, setAmende] = useState(0);
  const resultRef = useRef(null);

  const questions = [
    {
      key: "type",
      label: "Quel type d'établissement ?",
      options: [
        { label: "Food truck", value: "food_truck" },
        { label: "Boulangerie / café", value: "bakery" },
        { label: "Restaurant classique", value: "restaurant" },
        { label: "Brasserie / bar", value: "brasserie" },
        { label: "Hôtel / room service", value: "hotel" },
        { label: "Franchise / chaîne", value: "franchise" },
      ],
    },
    {
      key: "dishes",
      label: "Combien de plats à votre carte ?",
      options: [
        { label: "Moins de 10", value: "low" },
        { label: "10 à 30", value: "medium" },
        { label: "30 à 60", value: "high" },
        { label: "Plus de 60", value: "very_high" },
      ],
    },
    {
      key: "updates",
      label: "À quelle fréquence changez-vous votre carte ?",
      options: [
        { label: "Jamais / rarement", value: "never" },
        { label: "1 fois par an", value: "yearly" },
        { label: "Chaque saison", value: "seasonal" },
        { label: "Chaque semaine", value: "weekly" },
      ],
    },
    {
      key: "format",
      label: "Comment déclarez-vous vos allergènes aujourd'hui ?",
      options: [
        { label: "Classeur papier", value: "paper" },
        { label: "Mention orale du serveur", value: "oral" },
        { label: "Tableau affiché en cuisine", value: "table" },
        { label: "Menu numérique dédié", value: "digital" },
      ],
    },
    {
      key: "controls",
      label: "Avez-vous déjà été contrôlé par la DGCCRF ?",
      options: [
        { label: "Jamais", value: "never" },
        { label: "1 fois, sans problème", value: "once_ok" },
        { label: "1 fois, avertissement", value: "once_warn" },
        { label: "Plusieurs fois", value: "multiple" },
      ],
    },
  ];

  const allAnswered = questions.every(q => formData[q.key] !== null);

  function computeScore() {
    let s = 0;
    // Type (franchise/hotel = plus de risque car multi-sites)
    const typeMap = { food_truck: 10, bakery: 15, restaurant: 30, brasserie: 35, hotel: 45, franchise: 55 };
    s += typeMap[formData.type] || 20;
    // Dishes
    const dishMap = { low: 5, medium: 10, high: 20, very_high: 30 };
    s += dishMap[formData.dishes] || 10;
    // Updates — frequent changes = more risk if no digital system
    const updateMap = { never: 5, yearly: 10, seasonal: 20, weekly: 30 };
    s += updateMap[formData.updates] || 10;
    // Format — paper/oral = high risk
    const formatMap = { digital: 0, table: 20, paper: 40, oral: 55 };
    s += formatMap[formData.format] || 30;
    // Controls
    const ctrlMap = { never: 10, once_ok: 15, once_warn: 30, multiple: 45 };
    s += ctrlMap[formData.controls] || 10;
    return Math.min(Math.round(s / 1.7), 100);
  }

  function computeAmende(sc) {
    if (sc < 25) return 0;
    if (sc < 50) return 750;
    if (sc < 75) return 1500;
    return 4500; // récidive possible
  }

  function handleCalculate() {
    const sc = computeScore();
    setScore(sc);
    setAmende(computeAmende(sc));
    setStep("result");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  const risk = getRiskLevel(score);

  const styles = {
    page: {
      fontFamily: "'DM Sans', sans-serif",
      color: "#111827",
      background: "#fff",
    },
    // Nav
    nav: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid #e5e7eb",
      padding: "0 24px",
    },
    navInner: {
      maxWidth: 1100,
      margin: "0 auto",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 800,
      fontSize: 20,
      color: "#2563eb",
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    navLinks: {
      display: "flex",
      gap: 32,
      alignItems: "center",
    },
    navLink: {
      fontSize: 14,
      color: "#374151",
      textDecoration: "none",
      fontWeight: 500,
    },
    ctaBtn: {
      background: "#2563eb",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "10px 20px",
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-block",
    },
    // Hero
    hero: {
      background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
      padding: "80px 24px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    heroBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: "rgba(255,255,255,0.15)",
      border: "1px solid rgba(255,255,255,0.3)",
      borderRadius: 100,
      padding: "6px 16px",
      fontSize: 13,
      color: "rgba(255,255,255,0.9)",
      marginBottom: 24,
      fontWeight: 500,
    },
    heroTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: "clamp(2rem, 5vw, 3.5rem)",
      fontWeight: 800,
      color: "#fff",
      lineHeight: 1.1,
      marginBottom: 20,
      maxWidth: 800,
      margin: "0 auto 20px",
    },
    heroSub: {
      fontSize: 18,
      color: "rgba(255,255,255,0.85)",
      maxWidth: 600,
      margin: "0 auto 32px",
      lineHeight: 1.6,
    },
    heroStats: {
      display: "flex",
      justifyContent: "center",
      gap: 48,
      flexWrap: "wrap",
      marginTop: 48,
    },
    heroStat: {
      textAlign: "center",
    },
    heroStatNum: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 36,
      fontWeight: 800,
      color: "#fff",
      display: "block",
    },
    heroStatLabel: {
      fontSize: 13,
      color: "rgba(255,255,255,0.7)",
    },
    // Sections
    section: (bg = "#fff") => ({
      background: bg,
      padding: "80px 24px",
    }),
    container: {
      maxWidth: 1100,
      margin: "0 auto",
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#2563eb",
      marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
      fontWeight: 800,
      color: "#111827",
      marginBottom: 16,
      lineHeight: 1.15,
    },
    sectionSub: {
      fontSize: 17,
      color: "#4b5563",
      maxWidth: 640,
      lineHeight: 1.7,
      marginBottom: 48,
    },
  };

  return (
    <div style={styles.page}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); }
          70%  { box-shadow: 0 0 0 12px rgba(37,99,235,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
        }
        .pulse { animation: pulse-ring 2s infinite; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <Link href="/" style={styles.logo}>
            <span style={{
              width: 32, height: 32, borderRadius: 8,
              background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </span>
            MenuSafe
          </Link>
          <div style={styles.navLinks}>
            <a href="#allergenes" style={styles.navLink}>Les 14 allergènes</a>
            <a href="#reglementation" style={styles.navLink}>Réglementation</a>
            <a href="#simulateur" style={styles.navLink}>Simulateur</a>
            <Link href="/auth" style={styles.ctaBtn}>Essayer gratuitement</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={styles.hero}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto" }}>
          <div style={styles.heroBadge}>
            <span>⚖️</span> Règlement UE n°1169/2011 · Mis à jour 2024
          </div>
          <h1 style={styles.heroTitle}>
            Allergènes en restauration :<br />
            ce que la loi INCO vous oblige à faire
          </h1>
          <p style={styles.heroSub}>
            Guide complet sur la réglementation, les 14 allergènes obligatoires, les sanctions DGCCRF et les bonnes pratiques de conformité.
          </p>
          <a href="#simulateur" style={{
            ...styles.ctaBtn,
            background: "#fff",
            color: "#2563eb",
            padding: "14px 32px",
            fontSize: 16,
            borderRadius: 10,
            boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          }}>
            Calculer mon risque d'amende →
          </a>
        </div>

        <div style={styles.heroStats}>
          {[
            { num: "1 500€", label: "Amende par infraction" },
            { num: "14", label: "Allergènes obligatoires" },
            { num: "75%", label: "Restaurants non conformes" },
            { num: "2014", label: "Entrée en vigueur" },
          ].map((s, i) => (
            <div key={i} className="fade-up" style={{ ...styles.heroStat, animationDelay: `${i * 100}ms` }}>
              <span style={styles.heroStatNum}>{s.num}</span>
              <span style={styles.heroStatLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT IS INCO ── */}
      <section style={styles.section("#f8f9ff")} id="reglementation">
        <div style={styles.container}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={styles.sectionLabel}>La réglementation</div>
              <h2 style={styles.sectionTitle}>Qu'est-ce que le règlement INCO ?</h2>
              <p style={{ ...styles.sectionSub, marginBottom: 24 }}>
                Le règlement UE n°1169/2011, dit «&nbsp;INCO&nbsp;» (Information des Consommateurs sur les denrées alimentaires), est entré en vigueur le <strong>13 décembre 2014</strong> dans toute l'Union Européenne.
              </p>
              <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.7, marginBottom: 24 }}>
                Il impose à tous les professionnels de la restauration de <strong>déclarer par écrit</strong> les 14 allergènes majeurs présents dans chaque plat servi. Cette obligation s'applique aux restaurants, boulangeries, food trucks, traiteurs, hôtels, cantines scolaires et toute structure servant des repas.
              </p>
              <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.7 }}>
                La mention orale par un serveur <strong>ne suffit plus</strong> depuis 2014. Le document écrit est exigé et doit être accessible à tout moment au client.
              </p>
            </div>
            <div>
              {/* Timeline */}
              <div style={{ position: "relative", paddingLeft: 32 }}>
                <div style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: "#e5e7eb" }} />
                {TIMELINE.map((item, i) => (
                  <div key={i} style={{ position: "relative", marginBottom: 32, paddingLeft: 20 }}>
                    <div style={{
                      position: "absolute", left: -32 + 20 - 20,
                      top: 4, width: 22, height: 22,
                      borderRadius: "50%", background: i === TIMELINE.length - 1 ? "#2563eb" : "#fff",
                      border: `2px solid ${i === TIMELINE.length - 1 ? "#2563eb" : "#d1d5db"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {i === TIMELINE.length - 1 && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 4, fontFamily: "'Syne', sans-serif" }}>{item.year}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 14 ALLERGENS ── */}
      <section style={styles.section()} id="allergenes">
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={styles.sectionLabel}>Les 14 allergènes</div>
            <h2 style={styles.sectionTitle}>Tous les allergènes que vous devez déclarer</h2>
            <p style={{ fontSize: 17, color: "#4b5563", maxWidth: 580, margin: "0 auto" }}>
              Ces 14 substances sont reconnues par l'UE comme les plus fréquemment responsables de réactions allergiques graves. Leur déclaration est obligatoire pour chaque plat.
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}>
            {ALLERGENS_14.map((a, i) => <AllergenCard key={a.id} allergen={a} index={i} />)}
          </div>
          <div style={{
            marginTop: 32, padding: "20px 24px",
            background: "#eff6ff", borderRadius: 12,
            border: "1px solid #bfdbfe",
            display: "flex", gap: 16, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
            <div style={{ fontSize: 15, color: "#1e40af", lineHeight: 1.6 }}>
              <strong>Bon à savoir :</strong> Un même plat peut contenir plusieurs allergènes, notamment via des sauces, marinades ou accompagnements. La réglementation impose de les déclarer <em>tous</em>, sans exception, même en traces.
            </div>
          </div>
        </div>
      </section>

      {/* ── SANCTIONS ── */}
      <section style={styles.section("#fef2f2")}>
        <div style={styles.container}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <div style={{ ...styles.sectionLabel, color: "#dc2626" }}>Les sanctions</div>
              <h2 style={styles.sectionTitle}>Ce qui vous attend en cas de contrôle</h2>
              <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.7, marginBottom: 32 }}>
                La DGCCRF (Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes) effectue des contrôles inopinés. Les agents vérifient systématiquement la présence et l'exactitude des déclarations d'allergènes.
              </p>
              {[
                { icon: "💸", title: "Amende administrative", desc: "Jusqu'à 1 500€ par infraction constatée. Par plat non-conforme." },
                { icon: "📱", title: "Publication Alim'Confiance", desc: "Votre établissement peut être listé publiquement. Cette page est indexée par Google." },
                { icon: "🔒", title: "Fermeture administrative", desc: "En cas de récidive ou de risque immédiat pour la santé des consommateurs." },
                { icon: "⚖️", title: "Responsabilité pénale", desc: "En cas d'hospitalisation ou de décès d'un client suite à une réaction allergique." },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: "#fff", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 20, flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}>{s.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              {/* Big amende card */}
              <div style={{
                background: "#fff",
                border: "2px solid #fecaca",
                borderRadius: 16,
                padding: "32px",
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(220,38,38,0.1)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#dc2626", marginBottom: 12 }}>Scénario réel</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 56, fontWeight: 800, color: "#dc2626", lineHeight: 1 }}>7 500€</div>
                <div style={{ fontSize: 15, color: "#6b7280", marginTop: 8, marginBottom: 24 }}>d'amendes pour un restaurant de 50 plats<br />entièrement non-conforme</div>
                <div style={{ background: "#fef2f2", borderRadius: 10, padding: "16px 20px", textAlign: "left" }}>
                  {[
                    { label: "5 plats sans déclaration", value: "7 500€" },
                    { label: "Coût annuel MenuSafe Pro", value: "590€" },
                    { label: "Économie nette", value: "6 910€", highlight: true },
                  ].map((r, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: i < 2 ? "1px solid #fee2e2" : "none",
                      fontWeight: r.highlight ? 700 : 500,
                      color: r.highlight ? "#16a34a" : "#374151",
                      fontSize: 14,
                    }}>
                      <span>{r.label}</span>
                      <span>{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OBLIGATIONS ── */}
      <section style={styles.section("#f8f9ff")}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={styles.sectionLabel}>Vos obligations concrètes</div>
            <h2 style={styles.sectionTitle}>Ce que vous devez faire exactement</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              {
                num: "01", title: "Identifier tous les allergènes",
                desc: "Pour chaque plat, identifier les 14 allergènes parmi tous les ingrédients — y compris les sauces, garnitures et accompagnements.",
                ok: "✓ Liste exhaustive des ingrédients", bad: "✗ Approximations non acceptées"
              },
              {
                num: "02", title: "Mettre par écrit",
                desc: "La déclaration doit être écrite et accessible au client avant la commande. La mention orale ne suffit plus depuis 2014.",
                ok: "✓ Menu, ardoise, QR code, classeur", bad: "✗ Mention verbale insuffisante"
              },
              {
                num: "03", title: "Mettre à jour à chaque changement",
                desc: "Toute modification d'une recette ou d'un fournisseur oblige à remettre à jour la déclaration. Un classeur périmé est une infraction.",
                ok: "✓ Traçabilité des modifications", bad: "✗ Document périmé = infraction"
              },
            ].map((c, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", border: "1px solid #e5e7eb" }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 42, fontWeight: 800,
                  color: "#eff6ff", marginBottom: 16, lineHeight: 1,
                }}>{c.num}</div>
                <div style={{ fontWeight: 700, fontSize: 17, color: "#111827", marginBottom: 12 }}>{c.title}</div>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }}>{c.desc}</p>
                <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 600, marginBottom: 4 }}>{c.ok}</div>
                <div style={{ fontSize: 13, color: "#dc2626", fontWeight: 600 }}>{c.bad}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIMULATOR ── */}
      <section style={styles.section()} id="simulateur">
        <div style={{ ...styles.container, maxWidth: 760 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={styles.sectionLabel}>Simulateur de risque</div>
            <h2 style={styles.sectionTitle}>Quel est votre risque d'amende ?</h2>
            <p style={{ fontSize: 17, color: "#4b5563", maxWidth: 520, margin: "0 auto" }}>
              Répondez à 5 questions. Obtenez une évaluation personnalisée de votre exposition aux sanctions DGCCRF.
            </p>
          </div>

          {step === "quiz" && (
            <div style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 20,
              padding: "40px",
              boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
            }}>
              {questions.map(q => (
                <SimulatorQuestion key={q.key} label={q.label}>
                  <RadioGroup
                    options={q.options}
                    value={formData[q.key]}
                    onChange={v => setFormData(f => ({ ...f, [q.key]: v }))}
                  />
                </SimulatorQuestion>
              ))}

              <button
                onClick={handleCalculate}
                disabled={!allAnswered}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: allAnswered ? "#2563eb" : "#e5e7eb",
                  color: allAnswered ? "#fff" : "#9ca3af",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: allAnswered ? "pointer" : "not-allowed",
                  marginTop: 8,
                  fontFamily: "'Syne', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                Calculer mon niveau de risque →
              </button>
            </div>
          )}

          {step === "result" && (
            <div ref={resultRef}>
              {/* Score card */}
              <div style={{
                background: risk.bg,
                border: `2px solid ${risk.color}33`,
                borderRadius: 20,
                padding: "40px",
                marginBottom: 24,
                textAlign: "center",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: risk.color, color: "#fff", borderRadius: 100,
                  padding: "8px 20px", marginBottom: 24,
                  fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.6)" }} />
                  {risk.label}
                </div>

                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 80, fontWeight: 800,
                  color: risk.color, lineHeight: 1, marginBottom: 8,
                }}>
                  {score}
                  <span style={{ fontSize: 32, fontWeight: 600 }}>/100</span>
                </div>

                <div style={{ fontSize: 16, color: "#4b5563", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
                  {risk.desc}
                </div>

                <GaugeBar score={score} color={risk.color} />

                {amende > 0 && (
                  <div style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: "20px 24px",
                    border: `1px solid ${risk.color}33`,
                    marginTop: 16,
                  }}>
                    <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Exposition financière estimée</div>
                    <div style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 40, fontWeight: 800, color: "#dc2626",
                    }}>
                      {amende.toLocaleString("fr-FR")}€
                    </div>
                    <div style={{ fontSize: 13, color: "#9ca3af" }}>en cas de contrôle DGCCRF aujourd'hui</div>
                  </div>
                )}
              </div>

              {/* Email capture */}
              {!emailSent ? (
                <div style={{
                  background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                  borderRadius: 20, padding: "40px",
                  textAlign: "center", color: "#fff",
                  marginBottom: 24,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>
                    Recevez votre rapport complet
                  </div>
                  <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", marginBottom: 24 }}>
                    Votre score détaillé + 5 actions prioritaires pour vous mettre en conformité rapidement.
                  </p>
                  <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
                    <input
                      type="email"
                      placeholder="votre@email.fr"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{
                        flex: 1, padding: "12px 16px",
                        borderRadius: 8, border: "none",
                        fontSize: 15, outline: "none",
                      }}
                    />
                    <button
                      onClick={() => email.includes("@") && setEmailSent(true)}
                      style={{
                        background: "#fff", color: "#2563eb",
                        border: "none", borderRadius: 8,
                        padding: "12px 20px", fontWeight: 700,
                        fontSize: 14, cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Envoyer →
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>
                    Pas de spam. Désabonnement en 1 clic.
                  </div>
                </div>
              ) : (
                <div style={{
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 16, padding: "24px", textAlign: "center", marginBottom: 24,
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <div style={{ fontWeight: 700, color: "#16a34a", fontSize: 16 }}>Rapport envoyé à {email}</div>
                  <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>Vérifiez votre boîte mail dans les prochaines minutes.</div>
                </div>
              )}

              {/* CTA */}
              <div style={{ textAlign: "center" }}>
                <Link href="/auth" style={{
                  ...styles.ctaBtn,
                  padding: "16px 40px",
                  fontSize: 16,
                  borderRadius: 12,
                  display: "inline-block",
                  boxShadow: "0 4px 24px rgba(37,99,235,0.3)",
                }}>
                  Me mettre en conformité maintenant →
                </Link>
                <div style={{ marginTop: 12, fontSize: 13, color: "#9ca3af" }}>7 jours gratuits · Sans carte bancaire</div>
                <button
                  onClick={() => { setStep("quiz"); setFormData({ type: null, dishes: null, updates: null, format: null, controls: null }); }}
                  style={{ background: "none", border: "none", color: "#6b7280", fontSize: 13, cursor: "pointer", marginTop: 8, textDecoration: "underline" }}
                >
                  Refaire le test
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0f172a", padding: "48px 24px", textAlign: "center" }}>
        <Link href="/" style={{ ...styles.logo, justifyContent: "center", marginBottom: 16, color: "#fff" }}>
          MenuSafe
        </Link>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
          La solution allergènes conforme loi INCO pour la restauration française.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
          {[["Accueil", "/"], ["Tarifs", "/#pricing"], ["CGU", "/cgu"], ["Confidentialité", "/confidentialite"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>{label}</Link>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#334155", marginTop: 24 }}>
          © 2026 MenuSafe · Règlement UE n°1169/2011
        </p>
      </footer>
    </div>
  );
}