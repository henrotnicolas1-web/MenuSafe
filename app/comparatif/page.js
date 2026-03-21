"use client";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/lib/useWindowSize";
import { Check, X, Minus, Clock, AlertTriangle } from "lucide-react";

function Logo({ size = 26, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill={light ? "white" : "#1A1A1A"}/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill={light ? "#E5E5E5" : "#2D2D2D"}/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const COMPARISON_ROWS = [
  { category: "Conformité légale", features: [
    { label: "Déclaration écrite des 14 allergènes", menusafe: true, paper: "partial", pdf: "partial", excel: false },
    { label: "Mise à jour en temps réel", menusafe: true, paper: false, pdf: false, excel: false },
    { label: "Traçabilité des modifications", menusafe: true, paper: false, pdf: false, excel: false },
    { label: "Document accessible au client", menusafe: true, paper: "partial", pdf: "partial", excel: false },
  ]},
  { category: "Expérience client", features: [
    { label: "QR code par table", menusafe: true, paper: false, pdf: false, excel: false },
    { label: "Filtrage allergènes en temps réel", menusafe: true, paper: false, pdf: false, excel: false },
    { label: "Carte multilingue (8 langues)", menusafe: true, paper: false, pdf: false, excel: false },
    { label: "100% mobile, sans app", menusafe: true, paper: false, pdf: false, excel: false },
  ]},
  { category: "Gestion au quotidien", features: [
    { label: "Modification en moins de 30 secondes", menusafe: true, paper: false, pdf: false, excel: false },
    { label: "Import IA depuis une photo de carte", menusafe: true, paper: false, pdf: false, excel: false },
    { label: "Base 900+ ingrédients auto-détectés", menusafe: true, paper: false, pdf: false, excel: false },
    { label: "Multi-établissements", menusafe: true, paper: false, pdf: false, excel: false },
  ]},
  { category: "Documents & exports", features: [
    { label: "PDF conforme INCO en 1 clic", menusafe: true, paper: false, pdf: "partial", excel: false },
    { label: "Export CSV", menusafe: true, paper: false, pdf: false, excel: "partial" },
    { label: "QR code permanent (jamais à réimprimer)", menusafe: true, paper: false, pdf: false, excel: false },
  ]},
];

const HORROR_STORIES = [
  {
    title: "Le classeur de 2019",
    story: "Nouveau plat du jour ajouté en cuisine mais pas dans le classeur. Contrôle DGCCRF 3 semaines plus tard.",
    cost: "1 500€",
    solution: "MenuSafe : une modification en 20 secondes, la carte se met à jour instantanément.",
  },
  {
    title: "Le PDF imprimé",
    story: "Carte redessinée en novembre. L'ancien PDF était toujours sur les tables en janvier. Un client allergique aux noix tombe malade.",
    cost: "Fermeture temporaire",
    solution: "MenuSafe : le QR code ne change jamais. Imprimez-le une seule fois.",
  },
  {
    title: "Le fichier Excel partagé",
    story: "Deux collègues modifient le fichier en même temps. Un plat se retrouve sans allergènes. Personne ne s'en rend compte.",
    cost: "Publication Alim'Confiance",
    solution: "MenuSafe : un seul document, toujours synchronisé, toujours à jour.",
  },
];

function StatusCell({ value }) {
  if (value === true) return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#D4EDDA", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check size={14} color="#155724" strokeWidth={2.5} />
      </div>
    </div>
  );
  if (value === "partial") return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FFF3CD", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Minus size={14} color="#856404" strokeWidth={2.5} />
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X size={12} color="#CC0000" strokeWidth={2.5} />
      </div>
    </div>
  );
}

export default function ComparatifPage() {
  const router = useRouter();
  const { isMobile } = useWindowSize();

  const cols = [
    { key: "menusafe", label: "MenuSafe", highlight: true },
    { key: "paper",    label: "Classeur papier" },
    { key: "pdf",      label: "PDF imprimé" },
    { key: "excel",    label: "Fichier Excel" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "white", color: "#1A1A1A" }}>

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #EBEBEB" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/")}>
            <Logo size={26} />
            <span style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>MenuSafe</span>
          </div>
          <button onClick={() => router.push("/auth")} style={{ fontSize: 13, fontWeight: 700, padding: "8px 16px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>
            Essayer gratuitement →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "#0F0F0F", padding: isMobile ? "56px 20px" : "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#4ADE80", marginBottom: 24, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Comparatif objectif 2026
          </div>
          <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, color: "white", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            MenuSafe vs les méthodes traditionnelles
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 32px" }}>
            Classeur papier, PDF imprimé, fichier Excel — comparons honnêtement sur ce qui compte vraiment : la conformité légale, le temps passé et l'expérience client.
          </p>
          {/* Legend */}
          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[["#D4EDDA","#155724","✓ Disponible"], ["#FFF3CD","#856404","— Partiel"], ["#FFF0F0","#CC0000","✗ Non disponible"]].map(([bg, color, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 9, color, fontWeight: 800 }}>{label[0]}</span>
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{label.slice(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Table */}
      <section style={{ padding: isMobile ? "40px 16px" : "64px 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 580 }}>
              <thead>
                <tr>
                  <th style={{ padding: "14px 16px", textAlign: "left", width: "40%", fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Fonctionnalité</th>
                  {cols.map(col => (
                    <th key={col.key} style={{
                      padding: "14px 8px", textAlign: "center", width: "15%",
                      fontWeight: 800, fontSize: 13, color: col.highlight ? "#1A1A1A" : "#888",
                      background: col.highlight ? "#F7F7F5" : "transparent",
                      borderRadius: col.highlight ? "12px 12px 0 0" : 0,
                    }}>
                      {col.highlight && <div style={{ fontSize: 9, color: "#4ADE80", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 4, textTransform: "uppercase" }}>Recommandé</div>}
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((section, si) => (
                  <>
                    <tr key={`cat-${si}`}>
                      <td colSpan={5} style={{ padding: "20px 16px 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888" }}>
                        {section.category}
                      </td>
                    </tr>
                    {section.features.map((row, ri) => (
                      <tr key={`row-${si}-${ri}`} style={{ borderBottom: "1px solid #F5F5F5" }}>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#444", fontWeight: 500 }}>{row.label}</td>
                        {cols.map(col => (
                          <td key={col.key} style={{ padding: "12px 8px", background: col.highlight ? "#F7F7F5" : "transparent" }}>
                            <StatusCell value={row[col.key]} />
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

      {/* Cas concrets */}
      <section style={{ background: "#F7F7F5", padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>Cas concrets</p>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 40px", letterSpacing: "-0.02em" }}>
            Ce qui se passe vraiment sur le terrain
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {HORROR_STORIES.map((s, i) => (
              <div key={i} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <AlertTriangle size={16} color="#CC0000" />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>{s.title}</p>
                </div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: "0 0 12px", flex: 1 }}>{s.story}</p>
                <div style={{ background: "#FFF0F0", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#CC0000" }}>Conséquence : {s.cost}</span>
                </div>
                <div style={{ background: "#F0FFF4", borderRadius: 8, padding: "8px 12px", borderLeft: "3px solid #4ADE80" }}>
                  <span style={{ fontSize: 12, color: "#155724" }}>{s.solution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Temps perdu */}
      <section style={{ padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>Le coût caché</p>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 36px", letterSpacing: "-0.02em" }}>
            Le temps que vous perdez chaque mois
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            {/* Manuel */}
            <div style={{ background: "white", border: "2px solid #FFD0D0", borderRadius: 16, padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <X size={16} color="#CC0000" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#CC0000", textTransform: "uppercase", letterSpacing: "0.08em" }}>Méthode manuelle</span>
              </div>
              {[
                { task: "Mise à jour d'un plat", time: "15–45 min" },
                { task: "Impression et plastification", time: "30 min" },
                { task: "Traduction clientèle étrangère", time: "2–4h" },
                { task: "Vérification avant contrôle", time: "2–3h" },
              ].map((t, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #F5F5F5" : "none" }}>
                  <span style={{ fontSize: 13, color: "#444" }}>{t.task}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#CC0000" }}>{t.time}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: "12px", background: "#FFF0F0", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#CC0000", fontWeight: 600, marginBottom: 2 }}>Total mensuel estimé</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#CC0000" }}>3–6 heures</div>
              </div>
            </div>
            {/* MenuSafe */}
            <div style={{ background: "white", border: "2px solid #C6F6D5", borderRadius: 16, padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Check size={16} color="#155724" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#155724", textTransform: "uppercase", letterSpacing: "0.08em" }}>Avec MenuSafe</span>
              </div>
              {[
                { task: "Mise à jour d'un plat", time: "< 30 sec" },
                { task: "QR code jamais à réimprimer", time: "0 min" },
                { task: "8 langues auto-générées (IA)", time: "0 min" },
                { task: "Conformité garantie en continu", time: "0 min" },
              ].map((t, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #F5F5F5" : "none" }}>
                  <span style={{ fontSize: 13, color: "#444" }}>{t.task}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#155724" }}>{t.time}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: "12px", background: "#F0FFF4", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#155724", fontWeight: 600, marginBottom: 2 }}>Total mensuel estimé</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#155724" }}>&lt; 5 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0F0F0F", padding: isMobile ? "56px 20px" : "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Arrêtez de perdre du temps<br />et de prendre des risques
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 28px", lineHeight: 1.7 }}>
            MenuSafe remplace votre classeur papier, vos PDFs imprimés et vos fichiers Excel par une solution conforme et automatique.
          </p>
          <button onClick={() => router.push("/auth")} style={{ fontSize: 15, fontWeight: 700, padding: "14px 32px", background: "white", color: "#1A1A1A", border: "none", borderRadius: 12, cursor: "pointer" }}>
            Essayer 7 jours gratuitement →
          </button>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>Sans frais pendant 7 jours · Annulation en 1 clic</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#080808", padding: "24px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/")}>
            <Logo size={18} light />
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>MenuSafe</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {[["Accueil","/"], ["Tarifs","/#pricing"], ["CGU","/cgu"]].map(([l,h]) => (
              <span key={h} onClick={() => router.push(h)} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}