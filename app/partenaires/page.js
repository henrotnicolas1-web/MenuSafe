"use client";
import { useState } from "react";
import Link from "next/link";

const PARTNERS_POS = [
  { name: "Lightspeed", category: "Caisse", status: "csv", logo: "LS" },
  { name: "Zelty", category: "Caisse", status: "csv", logo: "ZL" },
  { name: "Cashpad", category: "Caisse", status: "csv", logo: "CP" },
  { name: "Sunday", category: "Paiement table", status: "soon", logo: "SU" },
  { name: "Laddition", category: "Caisse", status: "csv", logo: "LA" },
  { name: "Tiller", category: "Caisse", status: "soon", logo: "TI" },
  { name: "Revo", category: "Caisse", status: "csv", logo: "RV" },
  { name: "Innovorder", category: "Borne commande", status: "soon", logo: "IN" },
];

const PARTNERS_FOOD = [
  { name: "Uber Eats", category: "Livraison", status: "soon", logo: "UE" },
  { name: "Deliveroo", category: "Livraison", status: "soon", logo: "DL" },
  { name: "Just Eat", category: "Livraison", status: "soon", logo: "JE" },
  { name: "Lyf Pay", category: "Paiement", status: "csv", logo: "LY" },
];

const PARTNERS_TOOLS = [
  { name: "Google My Business", category: "Présence locale", status: "native", logo: "GM" },
  { name: "Stripe", category: "Paiement", status: "native", logo: "ST" },
  { name: "Resend", category: "Email", status: "native", logo: "RS" },
  { name: "Anthropic AI", category: "Intelligence artificielle", status: "native", logo: "AI" },
];

const EXPORT_FORMATS = [
  {
    icon: "📄", title: "Export CSV",
    desc: "Exportez toutes vos recettes avec leurs allergènes dans un fichier CSV standard. Compatible avec Excel, Google Sheets et la majorité des logiciels de restauration.",
    badge: "Disponible · Plans Pro & Réseau",
    color: "#16a34a",
    steps: ["Dashboard → Export", "Choisir l'établissement", "Télécharger en 1 clic"]
  },
  {
    icon: "🖨️", title: "PDF conforme INCO",
    desc: "Document A4 paysage avec tous vos plats classés par catégorie, allergènes inclus. Prêt à imprimer et plastifier. Valeur légale reconnue.",
    badge: "Disponible · Tous les plans",
    color: "#2563eb",
    steps: ["Dashboard → PDF", "Sélectionner la carte", "Télécharger le PDF"]
  },
  {
    icon: "🔌", title: "API REST",
    desc: "Accès programmatique à l'ensemble de vos données allergènes. Intégrez MenuSafe dans votre back-office, votre TPV, votre site web ou votre application.",
    badge: "Plan Réseau · Documentation sur demande",
    color: "#7c3aed",
    steps: ["Générer une clé API", "Consulter la doc", "Intégrer en quelques lignes"]
  },
  {
    icon: "📱", title: "QR code universel",
    desc: "Un QR code permanent par établissement. Fonctionne avec n'importe quel smartphone, sans application à télécharger. Collez-le partout : tables, vitrine, addition.",
    badge: "Disponible · Tous les plans",
    color: "#d97706",
    steps: ["Dashboard → QR code", "Télécharger le PNG ou SVG", "Coller et oublier"]
  },
];

function StatusBadge({ status }) {
  const config = {
    native: { label: "Intégré nativement", color: "#16a34a", bg: "#dcfce7" },
    csv:    { label: "Compatible via CSV", color: "#d97706", bg: "#fef3c7" },
    soon:   { label: "Bientôt disponible", color: "#7c3aed", bg: "#ede9fe" },
  };
  const c = config[status];
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "3px 8px",
      borderRadius: 100, color: c.color, background: c.bg,
      whiteSpace: "nowrap",
    }}>
      {c.label}
    </span>
  );
}

function PartnerCard({ partner }) {
  const [hovered, setHovered] = useState(false);
  const colors = {
    native: "#2563eb",
    csv: "#d97706",
    soon: "#9ca3af",
  };
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#f8f9ff" : "#fff",
        border: `1.5px solid ${hovered ? "#c7d2fe" : "#e5e7eb"}`,
        borderRadius: 12, padding: "20px 16px",
        cursor: "default", transition: "all 0.2s",
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", gap: 10,
      }}
    >
      {/* Logo placeholder */}
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: partner.status === "soon" ? "#f3f4f6" : "#eff6ff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14,
        color: colors[partner.status],
        border: `1px solid ${partner.status === "soon" ? "#e5e7eb" : "#bfdbfe"}`,
        opacity: partner.status === "soon" ? 0.6 : 1,
      }}>
        {partner.logo}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: partner.status === "soon" ? "#9ca3af" : "#111827" }}>{partner.name}</div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{partner.category}</div>
      </div>
      <StatusBadge status={partner.status} />
    </div>
  );
}

export default function PartenairesPage() {
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
            🔌 Intégrations & Compatibilité
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 20,
          }}>
            MenuSafe s'intègre dans<br />
            <span style={{ color: "#3b82f6" }}>votre organisation existante</span>
          </h1>
          <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.6, maxWidth: 560, margin: "0 auto 40px" }}>
            Compatible avec les principales caisses enregistreuses, exportable en CSV et PDF, avec une API pour les intégrations avancées.
          </p>
          {/* Legend */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {[
              { color: "#16a34a", bg: "#dcfce7", label: "Intégré nativement" },
              { color: "#d97706", bg: "#fef3c7", label: "Compatible via CSV" },
              { color: "#7c3aed", bg: "#ede9fe", label: "Bientôt disponible" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <span style={{ background: l.bg, color: l.color, padding: "3px 10px", borderRadius: 100, fontWeight: 700, fontSize: 11 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPORT FORMATS */}
      <section style={{ padding: "80px 24px" }}>
        <div style={styles.container}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={styles.sectionLabel}>Formats d'export</div>
            <h2 style={styles.sectionTitle}>Vos données, où vous en avez besoin</h2>
            <p style={{ fontSize: 17, color: "#4b5563", maxWidth: 540, margin: "0 auto" }}>
              MenuSafe ne vous enferme pas. Exportez vos données dans le format qui convient à votre organisation.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {EXPORT_FORMATS.map((f, i) => (
              <div key={i} style={{
                background: "#f8f9ff", borderRadius: 16, padding: "32px",
                border: `1px solid ${f.color}22`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ fontSize: 36 }}>{f.icon}</div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "4px 10px",
                    borderRadius: 100, background: `${f.color}15`, color: f.color,
                  }}>{f.badge}</span>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#111827", marginBottom: 10 }}>{f.title}</div>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 20 }}>{f.desc}</p>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {f.steps.map((s, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        background: "#fff", border: `1px solid ${f.color}33`,
                        borderRadius: 8, padding: "6px 10px",
                        fontSize: 12, color: "#374151", whiteSpace: "nowrap",
                      }}>
                        {j + 1}. {s}
                      </div>
                      {j < f.steps.length - 1 && <span style={{ color: "#d1d5db", fontSize: 12 }}>→</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POS INTEGRATIONS */}
      <section style={{ background: "#f8f9ff", padding: "80px 24px" }}>
        <div style={styles.container}>
          <div style={{ marginBottom: 40 }}>
            <div style={styles.sectionLabel}>Caisses enregistreuses (TPV)</div>
            <h2 style={{ ...styles.sectionTitle, fontSize: "clamp(1.5rem, 2vw, 2rem)" }}>Compatible avec votre caisse</h2>
            <p style={{ fontSize: 16, color: "#4b5563", maxWidth: 560 }}>
              Les caisses compatibles via CSV vous permettent d'importer/exporter votre carte directement. Les intégrations natives sont en cours de développement.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 40 }}>
            {PARTNERS_POS.map(p => <PartnerCard key={p.name} partner={p} />)}
          </div>

          <div style={{ marginBottom: 40 }}>
            <div style={styles.sectionLabel}>Livraison & Commande en ligne</div>
            <h2 style={{ ...styles.sectionTitle, fontSize: "clamp(1.5rem, 2vw, 2rem)" }}>Bientôt sur vos plateformes</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 40 }}>
            {PARTNERS_FOOD.map(p => <PartnerCard key={p.name} partner={p} />)}
          </div>

          <div style={{ marginBottom: 40 }}>
            <div style={styles.sectionLabel}>Technologies intégrées nativement</div>
            <h2 style={{ ...styles.sectionTitle, fontSize: "clamp(1.5rem, 2vw, 2rem)" }}>Le stack qui fait tourner MenuSafe</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {PARTNERS_TOOLS.map(p => <PartnerCard key={p.name} partner={p} />)}
          </div>
        </div>
      </section>

      {/* CSV HOW TO */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ ...styles.container, maxWidth: 800 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={styles.sectionLabel}>Comment ça marche</div>
            <h2 style={styles.sectionTitle}>Connecter MenuSafe à votre caisse en 3 étapes</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { step: "01", title: "Exportez votre menu depuis votre caisse", desc: "La plupart des caisses permettent d'exporter la liste des plats en CSV ou Excel. Consultez la documentation de votre logiciel." },
              { step: "02", title: "Importez dans MenuSafe via l'import IA", desc: "Glissez le fichier ou une photo de votre carte. L'IA lit les plats, génère les allergènes et les traductions en 8 langues automatiquement." },
              { step: "03", title: "Réexportez le CSV enrichi vers votre caisse", desc: "MenuSafe ajoute les colonnes allergènes à votre fichier. Réimportez dans votre caisse pour avoir les données allergènes centralisées." },
            ].map((s, i) => (
              <div key={i} style={{
                display: "flex", gap: 24, alignItems: "flex-start",
                padding: "24px", background: "#f8f9ff",
                borderRadius: 14, border: "1px solid #e5e7eb",
              }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 32,
                  color: "#e5e7eb", flexShrink: 0, lineHeight: 1,
                }}>{s.step}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: "#111827", marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUGGEST INTEGRATION */}
      <section style={{ background: "#f0fdf4", padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🤝</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
            Votre outil n'est pas dans la liste ?
          </h2>
          <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.7, marginBottom: 24 }}>
            Dites-nous quel logiciel vous utilisez. Nous priorisons nos intégrations en fonction des demandes de nos clients.
          </p>
          <Link href="/support" style={{
            background: "#16a34a", color: "#fff",
            padding: "14px 32px", borderRadius: 10,
            fontWeight: 700, fontSize: 15,
            textDecoration: "none", display: "inline-block",
          }}>
            Suggérer une intégration →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
            Prêt à vous lancer ?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", marginBottom: 32 }}>
            7 jours gratuits, sans carte bancaire. Votre première carte conforme en moins de 5 minutes.
          </p>
          <Link href="/auth" style={{
            background: "#fff", color: "#2563eb",
            padding: "16px 40px", borderRadius: 12,
            fontWeight: 800, fontSize: 16,
            textDecoration: "none", display: "inline-block",
          }}>
            Créer mon compte gratuitement →
          </Link>
          <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Sans engagement · Annulation en 1 clic</div>
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