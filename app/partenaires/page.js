"use client";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/lib/useWindowSize";
import Navbar from "@/components/Navbar";
import { Plug, Download, Code2, QrCode, Check } from "lucide-react";

function Logo({ size = 26, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill={light ? "white" : "#1A1A1A"}/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill={light ? "#E5E5E5" : "#2D2D2D"}/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const STATUS_CONFIG = {
  native: { label: "Intégré nativement", color: "#155724", bg: "#D4EDDA" },
  csv:    { label: "Compatible via CSV",  color: "#856404", bg: "#FFF3CD" },
  soon:   { label: "Bientôt disponible",  color: "#555",    bg: "#F0F0F0" },
};

const PARTNERS_POS = [
  { name: "Lightspeed",   category: "Caisse",         status: "csv",  logo: "LS" },
  { name: "Zelty",        category: "Caisse",         status: "csv",  logo: "ZL" },
  { name: "Cashpad",      category: "Caisse",         status: "csv",  logo: "CP" },
  { name: "Sunday",       category: "Paiement table", status: "soon", logo: "SU" },
  { name: "Laddition",    category: "Caisse",         status: "csv",  logo: "LA" },
  { name: "Tiller",       category: "Caisse",         status: "soon", logo: "TI" },
  { name: "Revo",         category: "Caisse",         status: "csv",  logo: "RV" },
  { name: "Innovorder",   category: "Borne commande", status: "soon", logo: "IN" },
];

const PARTNERS_FOOD = [
  { name: "Uber Eats",    category: "Livraison",  status: "soon", logo: "UE" },
  { name: "Deliveroo",    category: "Livraison",  status: "soon", logo: "DL" },
  { name: "Just Eat",     category: "Livraison",  status: "soon", logo: "JE" },
  { name: "Lyf Pay",      category: "Paiement",   status: "csv",  logo: "LY" },
];

const PARTNERS_TOOLS = [
  { name: "Stripe",       category: "Paiement",              status: "native", logo: "ST" },
  { name: "Resend",       category: "Email",                 status: "native", logo: "RS" },
  { name: "Anthropic AI", category: "Intelligence artificielle", status: "native", logo: "AI" },
  { name: "Supabase",     category: "Base de données",       status: "native", logo: "SB" },
];

const EXPORT_FORMATS = [
  { Icon: Download, title: "Export CSV", desc: "Exportez toutes vos recettes avec leurs allergènes. Compatible avec Excel, Google Sheets et la majorité des logiciels de restauration.", badge: "Plans Pro & Réseau", steps: ["Dashboard → Export", "Choisir l'établissement", "Télécharger en 1 clic"] },
  { Icon: QrCode, title: "PDF conforme INCO", desc: "Document A4 paysage avec tous vos plats classés par catégorie. Prêt à imprimer et plastifier.", badge: "Tous les plans", steps: ["Dashboard → PDF", "Sélectionner la carte", "Télécharger le PDF"] },
  { Icon: Code2, title: "API REST", desc: "Accès programmatique à l'ensemble de vos données allergènes. Intégrez MenuSafe dans votre back-office, TPV, site web ou application.", badge: "Plan Réseau", steps: ["Générer une clé API", "Consulter la documentation", "Intégrer en quelques lignes"] },
  { Icon: QrCode, title: "QR code universel", desc: "Un QR code permanent par établissement. Fonctionne avec n'importe quel smartphone sans application. Collez-le partout.", badge: "Tous les plans", steps: ["Dashboard → QR code", "Télécharger le PNG ou SVG", "Coller et oublier"] },
];

function PartnerCard({ partner }) {
  const sc = STATUS_CONFIG[partner.status];
  return (
    <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "18px 14px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 8, opacity: partner.status === "soon" ? 0.65 : 1 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: partner.status === "soon" ? "#F5F5F5" : "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: partner.status === "soon" ? "#888" : "white", letterSpacing: "0.02em" }}>
        {partner.logo}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#1A1A1A" }}>{partner.name}</div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{partner.category}</div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: sc.color, background: sc.bg }}>
        {sc.label}
      </span>
    </div>
  );
}

function PartnerGroup({ title, partners }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>{title}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
        {partners.map((p, i) => <PartnerCard key={i} partner={p} />)}
      </div>
    </div>
  );
}

export default function PartenairesPage() {
  const router = useRouter();
  const { isMobile } = useWindowSize();

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "white", color: "#1A1A1A" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ background: "#0F0F0F", padding: isMobile ? "56px 20px" : "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#4ADE80", marginBottom: 24, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Intégrations & Compatibilité
          </div>
          <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, color: "white", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            MenuSafe s'intègre dans votre organisation existante
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 28px" }}>
            Compatible avec les principales caisses, exportable en CSV et PDF, avec une API pour les intégrations avancées.
          </p>
          {/* Legend */}
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {Object.values(STATUS_CONFIG).map((sc, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: sc.color, background: sc.bg }}>{sc.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section style={{ padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <PartnerGroup title="Logiciels de caisse & paiement table" partners={PARTNERS_POS} />
          <PartnerGroup title="Livraison & paiement" partners={PARTNERS_FOOD} />
          <PartnerGroup title="Technologies intégrées nativement" partners={PARTNERS_TOOLS} />
        </div>
      </section>

      {/* Exports */}
      <section style={{ background: "#F7F7F5", padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>Formats disponibles</p>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 36px", letterSpacing: "-0.02em" }}>
            Exportez vos données comme vous voulez
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 16 }}>
            {EXPORT_FORMATS.map(({ Icon, title, desc, badge, steps }, i) => (
              <div key={i} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color="#4ADE80" strokeWidth={1.75} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, background: "#F0F0F0", color: "#555" }}>{badge}</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px" }}>{title}</p>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>{desc}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {steps.map((step, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {j > 0 && <span style={{ color: "#CCC", fontSize: 10 }}>→</span>}
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#888", background: "#F5F5F5", padding: "3px 8px", borderRadius: 6 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0F0F0F", padding: isMobile ? "56px 20px" : "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Une question sur les intégrations ?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 28px", lineHeight: 1.7 }}>
            Notre équipe peut vous aider à connecter MenuSafe à votre système existant.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/support")} style={{ fontSize: 14, fontWeight: 700, padding: "12px 24px", background: "transparent", color: "white", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 12, cursor: "pointer" }}>
              Contacter le support
            </button>
            <button onClick={() => router.push("/auth")} style={{ fontSize: 14, fontWeight: 700, padding: "12px 24px", background: "white", color: "#1A1A1A", border: "none", borderRadius: 12, cursor: "pointer" }}>
              Essayer gratuitement →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#080808", padding: "24px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/")}>
            <Logo size={18} light />
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>MenuSafe</span>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2026 MenuSafe · Intégrations et exports</p>
        </div>
      </footer>
    </div>
  );
}