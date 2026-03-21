"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/lib/useWindowSize";
import { Utensils, Croissant, Truck, Building2, Link2, Check } from "lucide-react";

function Logo({ size = 26, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill={light ? "white" : "#1A1A1A"}/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill={light ? "#E5E5E5" : "#2D2D2D"}/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const SECTORS = [
  {
    id: "restaurant", Icon: Utensils, label: "Restaurant",
    tagline: "De la brasserie au gastronomique",
    hero: "Votre carte change selon les saisons, les arrivages du marché, les suggestions du chef. MenuSafe suit le rythme sans effort.",
    pain: ["Carte saisonnière difficile à maintenir", "Serveurs ne connaissent pas tous les ingrédients", "Clientèle touristique ne parle pas français", "Classeur papier toujours en retard"],
    solution: [
      { title: "Mise à jour en 20 secondes", desc: "Nouveau plat du jour ? 3 clics. La carte QR code est à jour avant le service." },
      { title: "8 langues automatiques", desc: "Import IA d'une photo de carte → traductions EN, ES, DE, IT, NL, JA, ZH générées instantanément." },
      { title: "Briefing équipe simplifié", desc: "Chaque serveur peut consulter la fiche complète d'un plat depuis son téléphone." },
    ],
    stat: { num: "85%", label: "des restaurants font confiance à la mémoire du serveur pour les allergènes. Insuffisant légalement." },
  },
  {
    id: "boulangerie", Icon: Croissant, label: "Boulangerie / Pâtisserie",
    tagline: "Du pain artisanal aux créations saisonnières",
    hero: "Galette des rois en janvier, bûches en décembre, viennoiseries au levain toute l'année. Chaque produit contient du gluten, souvent des œufs et du lait — une erreur peut coûter cher.",
    pain: ["Produits très allergènes (gluten, lait, œufs partout)", "Gamme change selon saisons et fournisseurs", "Petite structure : pas de responsable dédié", "Clients au comptoir, pas de menu à consulter"],
    solution: [
      { title: "QR code vitrine et comptoir", desc: "Un QR code affiché en vitrine. Le client scanne et voit tous les allergènes avant d'acheter." },
      { title: "Gluten et lait pré-détectés", desc: "La base 900+ ingrédients reconnaît les produits boulangers. Farine → gluten. Beurre → lait. Automatique." },
      { title: "PDF affichage légal", desc: "Un document A4 à imprimer et plastifier. Conforme INCO, prêt en 2 minutes." },
    ],
    stat: { num: "100%", label: "des produits de boulangerie contiennent au moins 1 des 14 allergènes. La déclaration est obligatoire sans exception." },
  },
  {
    id: "food_truck", Icon: Truck, label: "Food Truck",
    tagline: "Mobilité, rapidité, conformité",
    hero: "Vous travaillez en espace réduit, avec une carte courte mais dense. La conformité allergènes ne peut pas ralentir votre flux de service.",
    pain: ["Pas de place pour un classeur ou menu physique", "Service très rapide, clients pressés", "Carte qui change souvent", "Clientèle mix : touristes, salariés, familles"],
    solution: [
      { title: "100% numérique, zéro papier", desc: "Un QR code collé sur votre camion. Accessible depuis n'importe quel smartphone sans app." },
      { title: "Carte modifiable entre deux services", desc: "Plus de saumon ? Vous retirez le plat en 10 secondes depuis votre téléphone." },
      { title: "Conformité sans friction", desc: "Vos clients allergiques vérifient eux-mêmes. Vous continuez votre service sans interruption." },
    ],
    stat: { num: "3x", label: "plus de contrôles DGCCRF sur les food trucks que sur les restaurants fixes selon les professionnels du secteur." },
  },
  {
    id: "hotel", Icon: Building2, label: "Hôtel & Room Service",
    tagline: "Restaurant, bar, room service, petit-déjeuner",
    hero: "Un hôtel cumule plusieurs points de restauration avec une clientèle internationale exigeante. Chaque service a ses propres contraintes légales.",
    pain: ["Plusieurs menus à gérer simultanément", "Clientèle internationale ne lit pas le français", "Buffet : plats changent chaque jour", "Équipes différentes selon les services"],
    solution: [
      { title: "Multi-établissements natifs", desc: "Restaurant, bar, room service : chaque espace a sa propre carte et son propre QR code depuis un seul compte." },
      { title: "8 langues pour clientèle internationale", desc: "Vos clients choisissent leur langue. Traductions générées une fois, disponibles à vie." },
      { title: "Buffet du jour en 2 minutes", desc: "Chaque matin, mise à jour du buffet en quelques clics. Le QR code pointe vers la fiche à jour." },
    ],
    stat: { num: "8", label: "langues disponibles. Vos clients britanniques, espagnols, allemands et japonais vérifient les allergènes dans leur langue." },
  },
  {
    id: "franchise", Icon: Link2, label: "Franchise & Multi-sites",
    tagline: "Cohérence et contrôle à grande échelle",
    hero: "Gérer la conformité allergènes sur 5, 10 ou 50 points de vente est un défi organisationnel majeur. Une erreur dans un établissement met en danger toute l'enseigne.",
    pain: ["Cohérence des menus entre établissements impossible manuellement", "Un nouveau plat national → mise à jour de tous les sites", "Contrôle qualité difficile à distance", "Responsabilité juridique centralisée mais exécution locale"],
    solution: [
      { title: "Établissements illimités (plan Réseau)", desc: "Tous vos sites dans un seul compte. Vue d'ensemble, gestion individuelle. Ajoutez un site en 2 minutes." },
      { title: "Gestion des équipes par site", desc: "Chaque manager local a accès uniquement à son établissement. Vous gardez la main sur les données centrales." },
      { title: "Export CSV et accès API", desc: "Intégrez vos données allergènes dans votre back-office existant. Compatible avec vos systèmes de gestion." },
    ],
    stat: { num: "1 500€", label: "par infraction, par établissement. Sur 10 sites non conformes, l'exposition potentielle dépasse 15 000€." },
  },
];

export default function MetiersPage() {
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const [activeSector, setActiveSector] = useState("restaurant");
  const sector = SECTORS.find(s => s.id === activeSector);

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
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#4ADE80", marginBottom: 24, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Par secteur d'activité
          </div>
          <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, color: "white", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            MenuSafe adapté à votre métier
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
            Restaurant, boulangerie, food truck, hôtel ou franchise — les enjeux allergènes sont différents. Découvrez comment MenuSafe répond à vos contraintes spécifiques.
          </p>
        </div>
      </section>

      {/* Selector */}
      <div style={{ background: "#F7F7F5", borderBottom: "1px solid #EBEBEB", padding: "0 20px", overflowX: "auto" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 0 }}>
          {SECTORS.map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setActiveSector(id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 16px", fontSize: 13, fontWeight: activeSector === id ? 700 : 500,
                background: "transparent", border: "none", cursor: "pointer", whiteSpace: "nowrap",
                color: activeSector === id ? "#1A1A1A" : "#888",
                borderBottom: activeSector === id ? "2px solid #1A1A1A" : "2px solid transparent",
              }}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sector content */}
      {sector && (
        <div key={sector.id}>
          {/* Intro */}
          <section style={{ padding: isMobile ? "40px 20px" : "64px 20px", background: "white" }}>
            <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 40, alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{sector.tagline}</p>
                <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "#1A1A1A", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {sector.label}
                </h2>
                <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, margin: "0 0 24px" }}>{sector.hero}</p>
                <div style={{ background: "#1A1A1A", borderRadius: 14, padding: "20px 24px" }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: "#4ADE80", letterSpacing: "-0.02em" }}>{sector.stat.num}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, marginTop: 4 }}>{sector.stat.label}</div>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#CC0000", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Points de friction</p>
                {sector.pain.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < sector.pain.length - 1 ? "1px solid #F5F5F5" : "none" }}>
                    <span style={{ color: "#CC0000", fontWeight: 700, flexShrink: 0, fontSize: 14 }}>✗</span>
                    <span style={{ fontSize: 13, color: "#444" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Solutions */}
          <section style={{ background: "#F7F7F5", padding: isMobile ? "40px 20px" : "56px 20px" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 28 }}>
                Ce que MenuSafe change pour vous
              </p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
                {sector.solution.map((sol, i) => (
                  <div key={i} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 14, padding: "22px" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <Check size={16} color="#4ADE80" strokeWidth={2.5} />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px" }}>{sol.title}</p>
                    <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>{sol.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* CTA */}
      <section style={{ background: "#0F0F0F", padding: isMobile ? "56px 20px" : "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Prêt à être en conformité ?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 28px", lineHeight: 1.7 }}>
            Rejoignez les restaurateurs qui ont sécurisé leur conformité INCO en moins de 5 minutes.
          </p>
          <button onClick={() => router.push("/auth")} style={{ fontSize: 15, fontWeight: 700, padding: "14px 32px", background: "white", color: "#1A1A1A", border: "none", borderRadius: 12, cursor: "pointer" }}>
            Essayer gratuitement →
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
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2026 MenuSafe · Conformité allergènes par secteur</p>
        </div>
      </footer>
    </div>
  );
}