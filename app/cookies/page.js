"use client";
import { useRouter } from "next/navigation";

export default function CookiesPage() {
  const router = useRouter();
  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between" }}>
          <span onClick={() => router.push("/")} style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", cursor: "pointer", letterSpacing: "-0.02em" }}>MenuSafe</span>
          <button onClick={() => router.push("/")} style={{ fontSize: 13, color: "#888", background: "none", border: "none", cursor: "pointer" }}>← Retour</button>
        </div>
      </nav>
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 20px 80px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Gestion des cookies</h1>
        <p style={{ fontSize: 13, color: "#999", margin: "0 0 40px" }}>Version en vigueur au 20 mars 2026</p>
        {[
          { title: "Qu'est-ce qu'un cookie ?", content: "Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web. Il permet de mémoriser des informations entre les visites." },
          { title: "Les cookies utilisés par MenuSafe", content: "MenuSafe utilise uniquement des cookies strictement nécessaires au fonctionnement du Service :\n\n• Cookie de session (auth-token) : maintient votre connexion active pendant votre navigation. Durée : session ou 7 jours si vous cochez 'Rester connecté'.\n• Cookie de préférences : mémorise vos préférences d'affichage (langue, paramètres). Durée : 1 an.\n\nCes cookies sont indispensables au fonctionnement du Service et ne peuvent pas être désactivés." },
          { title: "Ce que nous n'utilisons PAS", content: "MenuSafe n'utilise aucun cookie publicitaire, aucun cookie de tracking tiers (Google Analytics, Facebook Pixel, etc.), et aucun cookie de partage sur les réseaux sociaux." },
          { title: "Comment gérer les cookies ?", content: "Vous pouvez configurer votre navigateur pour refuser les cookies. Attention : la désactivation des cookies techniques empêchera le fonctionnement correct du Service (vous ne pourrez pas rester connecté).\n\nGuides de gestion des cookies par navigateur :\n• Chrome : Paramètres → Confidentialité et sécurité → Cookies\n• Firefox : Paramètres → Vie privée et sécurité\n• Safari : Préférences → Confidentialité\n• Edge : Paramètres → Cookies et autorisations de site" },
          { title: "Contact", content: "Pour toute question sur nos pratiques en matière de cookies : contact@menusafe.fr" },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px", paddingBottom: 8, borderBottom: "1px solid #EBEBEB" }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" }}>{s.content}</p>
          </div>
        ))}
      </main>
    </div>
  );
}