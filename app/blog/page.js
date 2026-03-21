export const metadata = {
  title: "Blog MenuSafe — Allergènes, conformité INCO et restauration",
  description: "Guides, conseils et actualités sur la réglementation allergènes en restauration. Conformité INCO, contrôles DGCCRF, gestion des allergènes.",
};

const ARTICLES = [
  { slug: "obligation-allergenes-restaurant-france", title: "Allergènes en restaurant : ce que la loi vous oblige vraiment à faire", excerpt: "Le règlement INCO oblige tous les restaurants à déclarer 14 allergènes par écrit. Ce guide explique exactement vos obligations, les sanctions encourues et comment vous conformer rapidement.", date: "2026-03-01", readTime: "8 min", category: "Réglementation" },
  { slug: "amende-dgccrf-allergenes-restauration", title: "Amende DGCCRF allergènes : combien risquez-vous vraiment ?", excerpt: "1 500€ par infraction, publication sur Alim'Confiance, fermeture temporaire. Découvrez comment se déroulent les contrôles DGCCRF et comment vous protéger.", date: "2026-03-05", readTime: "6 min", category: "Réglementation" },
  { slug: "carte-allergenes-qr-code-restaurant", title: "QR code allergènes : la solution moderne pour votre restaurant", excerpt: "Un QR code sur chaque table remplace avantageusement le classeur papier. Vos clients scannent, filtrent leurs allergènes en temps réel, dans leur langue. Mode d'emploi complet.", date: "2026-03-08", readTime: "5 min", category: "Solutions" },
  { slug: "menu-multilingue-restaurant-touristes", title: "Carte de restaurant multilingue : comment accueillir les touristes étrangers", excerpt: "8 langues, traduction automatique, filtrage allergènes. Comment équiper votre restaurant pour les clientèles britanniques, espagnoles, allemandes et asiatiques.", date: "2026-03-12", readTime: "7 min", category: "Solutions" },
  { slug: "14-allergenes-liste-complete-restauration", title: "Les 14 allergènes obligatoires : guide complet pour les restaurateurs", excerpt: "Gluten, crustacés, œufs, poissons, arachides, soja, lait, fruits à coque, céleri, moutarde, sésame, sulfites, lupin, mollusques. Ce qu'il faut savoir sur chacun.", date: "2026-03-15", readTime: "10 min", category: "Guides" },
  { slug: "import-ia-menu-restaurant-allergenes", title: "Importer sa carte de restaurant avec l'IA : gain de temps et conformité immédiate", excerpt: "Photographier sa carte, laisser l'IA extraire les plats et détecter les allergènes en 60 secondes. Comment cette technologie révolutionne la mise en conformité.", date: "2026-03-18", readTime: "6 min", category: "Technologie" },
  { slug: "alim-confiance-restaurant-mauvaise-note", title: "Alim'Confiance : comment une mauvaise note peut tuer votre restaurant", excerpt: "Une note défavorable sur Alim'Confiance apparaît en premier sur Google. Ce que ça signifie pour votre réputation et comment l'éviter en étant en conformité allergènes.", date: "2026-03-20", readTime: "7 min", category: "Réputation" },
];

const CATEGORY_COLORS = {
  "Réglementation": { bg: "#FFF0F0", color: "#CC0000" },
  "Solutions":      { bg: "#F0FFF4", color: "#155724" },
  "Guides":         { bg: "#F0F7FF", color: "#084298" },
  "Technologie":    { bg: "#F5F0FF", color: "#5A189A" },
  "Réputation":     { bg: "#FFF8E6", color: "#856404" },
};

export default function BlogPage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "white", color: "#1A1A1A", minHeight: "100vh" }}>

      <nav style={{ borderBottom: "1px solid #EBEBEB", padding: "12px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="#1A1A1A"/>
              <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#2D2D2D"/>
              <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>MenuSafe</span>
          </a>
          <a href="/auth" style={{ fontSize: 13, fontWeight: 700, padding: "8px 16px", background: "#1A1A1A", color: "white", borderRadius: 10, textDecoration: "none" }}>
            Essayer gratuitement →
          </a>
        </div>
      </nav>

      <section style={{ background: "#0F0F0F", padding: "64px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#4ADE80", marginBottom: 20, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Ressources
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Blog MenuSafe
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
            Guides pratiques, actualités réglementaires et conseils pour mettre votre restaurant en conformité INCO.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: "0 auto", padding: "56px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
          {ARTICLES.map((article) => {
            const cat = CATEGORY_COLORS[article.category] || { bg: "#F5F5F5", color: "#555" };
            return (
              <a key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "24px", height: "100%", display: "flex", flexDirection: "column", transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#1A1A1A"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#EBEBEB"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: cat.bg, color: cat.color }}>
                      {article.category}
                    </span>
                    <span style={{ fontSize: 11, color: "#BBB" }}>{article.readTime}</span>
                  </div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 10px", lineHeight: 1.35, flex: 1 }}>
                    {article.title}
                  </h2>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: "0 0 16px" }}>
                    {article.excerpt}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#BBB" }}>
                      {new Date(article.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Lire →</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <footer style={{ background: "#080808", padding: "24px 20px", marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>MenuSafe</span>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2026 MenuSafe</p>
        </div>
      </footer>
    </div>
  );
}