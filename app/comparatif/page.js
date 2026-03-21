"use client";
import { useState } from "react";
import Link from "next/link";

const COMPARISON_ROWS = [
  { category: "Conformité légale",
    features: [
      { label: "Déclaration écrite des 14 allergènes", menusafe: true, paper: "partial", pdf: "partial", excel: false },
      { label: "Mise à jour en temps réel", menusafe: true, paper: false, pdf: false, excel: false },
      { label: "Traçabilité des modifications", menusafe: true, paper: false, pdf: false, excel: false },
      { label: "Document accessible au client", menusafe: true, paper: "partial", pdf: "partial", excel: false },
    ]
  },
  { category: "Expérience client",
    features: [
      { label: "QR code par table", menusafe: true, paper: false, pdf: false, excel: false },
      { label: "Filtrage allergènes en temps réel", menusafe: true, paper: false, pdf: false, excel: false },
      { label: "Carte multilingue (8 langues)", menusafe: true, paper: false, pdf: false, excel: false },
      { label: "100% mobile, sans app", menusafe: true, paper: false, pdf: false, excel: false },
    ]
  },
  { category: "Gestion au quotidien",
    features: [
      { label: "Modification en < 30 secondes", menusafe: true, paper: false, pdf: false, excel: false },
      { label: "Import IA depuis une photo de carte", menusafe: true, paper: false, pdf: false, excel: false },
      { label: "Base 900+ ingrédients auto-détectés", menusafe: true, paper: false, pdf: false, excel: false },
      { label: "Multi-établissements", menusafe: true, paper: false, pdf: false, excel: false },
    ]
  },
  { category: "Documents & exports",
    features: [
      { label: "PDF conforme INCO en 1 clic", menusafe: true, paper: false, pdf: "partial", excel: false },
      { label: "Export CSV", menusafe: true, paper: false, pdf: false, excel: "partial" },
      { label: "QR code permanent (jamais à réimprimer)", menusafe: true, paper: false, pdf: false, excel: false },
    ]
  },
];

const HORROR_STORIES = [
  { emoji: "📋", title: "Le classeur de 2019", story: "Nouveau plat du jour ajouté en cuisine mais pas dans le classeur. Contrôle DGCCRF 3 semaines plus tard. Résultat : 1 500€.", solution: "MenuSafe : une modif en 20 secondes, la carte se met à jour instantanément." },
  { emoji: "📄", title: "Le PDF imprimé", story: "Carte redessinée en novembre. L'ancien PDF était toujours sur les tables en janvier. Un client allergique aux noix tombe malade.", solution: "MenuSafe : le QR code ne change jamais. Imprimez-le une seule fois." },
  { emoji: "📊", title: "Le fichier Excel partagé", story: "Deux collègues modifient le fichier en même temps. Un plat se retrouve sans allergènes. Personne ne s'en rend compte.", solution: "MenuSafe : un seul document, toujours synchronisé, toujours à jour." },
];

function CheckIcon({ value }) {
  if (value === true) return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
    </div>
  );
  if (value === "partial") return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 14 }}>~</span>
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </div>
    </div>
  );
}

export default function ComparatifPage() {
  const [expanded, setExpanded] = useState(null);

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
      fontWeight: 800, color: "#111827",
      marginBottom: 16, lineHeight: 1.15,
    },
  };

  const cols = [
    { key: "menusafe", label: "MenuSafe", color: "#2563eb", bg: "#eff6ff", highlight: true },
    { key: "paper",    label: "Classeur papier", color: "#6b7280", bg: "#f9fafb" },
    { key: "pdf",      label: "Menu PDF imprimé", color: "#6b7280", bg: "#f9fafb" },
    { key: "excel",    label: "Fichier Excel", color: "#6b7280", bg: "#f9fafb" },
  ];

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease both; }
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
      <section style={{ background: "#0f172a", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)",
            borderRadius: 100, padding: "6px 16px", fontSize: 13,
            color: "#93c5fd", marginBottom: 24, fontWeight: 500,
          }}>
            ⚖️ Comparatif objectif 2024
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 20,
          }}>
            MenuSafe vs les solutions<br />
            <span style={{ color: "#3b82f6" }}>que vous utilisez déjà</span>
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.6, maxWidth: 560, margin: "0 auto 40px" }}>
            Classeur papier, PDF imprimé, fichier Excel... Ces méthodes étaient acceptables en 2013. En 2024, elles vous exposent à 1 500€ d'amende.
          </p>
          {/* Quick verdict */}
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {[
              { icon: "⏱️", label: "Mise à jour : 20s vs 45min" },
              { icon: "📱", label: "Client : QR code vs classeur" },
              { icon: "💸", label: "Risque : 0€ vs 1 500€" },
            ].map((v, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10, padding: "10px 16px", fontSize: 14, color: "#e2e8f0", fontWeight: 500,
              }}>
                {v.icon} {v.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HORROR STORIES */}
      <section style={{ background: "#fef2f2", padding: "64px 24px" }}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ ...styles.sectionLabel, color: "#dc2626" }}>Ce qui arrive vraiment</div>
            <h2 style={styles.sectionTitle}>Les scénarios qui coûtent cher</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {HORROR_STORIES.map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", border: "1px solid #fecaca" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{s.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#111827", marginBottom: 12, fontFamily: "'Syne', sans-serif" }}>{s.title}</div>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }}>{s.story}</p>
                <div style={{ background: "#f0fdf4", borderRadius: 8, padding: "12px 14px", borderLeft: "3px solid #16a34a" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>AVEC MENUSAFE</div>
                  <div style={{ fontSize: 13, color: "#15803d", lineHeight: 1.5 }}>{s.solution}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ padding: "80px 24px" }}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={styles.sectionLabel}>Tableau comparatif complet</div>
            <h2 style={styles.sectionTitle}>Fonctionnalité par fonctionnalité</h2>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                Disponible
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11 }}>~</span>
                </div>
                Partiel / limité
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </div>
                Non disponible
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={{ padding: "16px 20px", textAlign: "left", width: "40%", fontSize: 13, color: "#6b7280", fontWeight: 600 }}>Fonctionnalité</th>
                  {cols.map(col => (
                    <th key={col.key} style={{
                      padding: "16px 12px", textAlign: "center", width: "15%",
                      fontFamily: "'Syne', sans-serif", fontWeight: 800,
                      fontSize: 14,
                      color: col.highlight ? col.color : "#374151",
                      background: col.highlight ? "#eff6ff" : "transparent",
                      borderRadius: col.highlight ? "12px 12px 0 0" : 0,
                    }}>
                      {col.highlight && <div style={{ fontSize: 10, color: "#2563eb", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 2 }}>✦ RECOMMANDÉ</div>}
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((section, si) => (
                  <>
                    <tr key={`cat-${si}`}>
                      <td colSpan={5} style={{
                        padding: "20px 20px 8px",
                        fontSize: 12, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        color: "#2563eb",
                      }}>
                        {section.category}
                      </td>
                    </tr>
                    {section.features.map((row, ri) => (
                      <tr key={`row-${si}-${ri}`} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "14px 20px", fontSize: 14, color: "#374151", fontWeight: 500 }}>{row.label}</td>
                        {cols.map(col => (
                          <td key={col.key} style={{
                            padding: "14px 12px",
                            background: col.highlight ? "#eff6ff" : "transparent",
                          }}>
                            <CheckIcon value={row[col.key]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TIME COMPARISON */}
      <section style={{ background: "#f8f9ff", padding: "80px 24px" }}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={styles.sectionLabel}>Le coût caché</div>
            <h2 style={styles.sectionTitle}>Le temps que vous perdez chaque mois</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 800, margin: "0 auto" }}>
            {/* Manual */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: "2px solid #fecaca" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Méthode manuelle
              </div>
              {[
                { task: "Mise à jour d'un plat", time: "15–45 min" },
                { task: "Impression et plastification", time: "30 min" },
                { task: "Traduction si clientèle étrangère", time: "2–4h" },
                { task: "Vérification avant contrôle", time: "2–3h" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? "1px solid #f3f4f6" : "none" }}>
                  <span style={{ fontSize: 14, color: "#374151" }}>{t.task}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#dc2626" }}>{t.time}</span>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: "14px 16px", background: "#fef2f2", borderRadius: 10 }}>
                <div style={{ fontSize: 13, color: "#dc2626", fontWeight: 600 }}>Total mensuel estimé</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#dc2626" }}>3–6 heures</div>
              </div>
            </div>
            {/* MenuSafe */}
            <div style={{ background: "#fff", borderRadius: 16, padding: "32px", border: "2px solid #bfdbfe" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Avec MenuSafe
              </div>
              {[
                { task: "Mise à jour d'un plat", time: "< 30 sec" },
                { task: "QR code : jamais à réimprimer", time: "0 min" },
                { task: "8 langues auto-générées (IA)", time: "0 min" },
                { task: "Conformité garantie en continu", time: "0 min" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? "1px solid #f3f4f6" : "none" }}>
                  <span style={{ fontSize: 14, color: "#374151" }}>{t.task}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>{t.time}</span>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: "14px 16px", background: "#f0fdf4", borderRadius: 10 }}>
                <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>Total mensuel estimé</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#16a34a" }}>&lt; 5 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
            Arrêtez de perdre du temps<br />et de prendre des risques
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", marginBottom: 32, lineHeight: 1.6 }}>
            MenuSafe remplace votre classeur papier, vos PDFs imprimés et vos fichiers Excel par une solution conforme et automatique.
          </p>
          <Link href="/auth" style={{
            background: "#fff", color: "#2563eb",
            padding: "16px 40px", borderRadius: 12,
            fontWeight: 800, fontSize: 16,
            textDecoration: "none", display: "inline-block",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            Essayer 7 jours gratuitement →
          </Link>
          <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Sans carte bancaire · Annulation en 1 clic</div>
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