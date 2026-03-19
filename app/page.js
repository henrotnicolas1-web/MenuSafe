"use client";
import { useRouter } from "next/navigation";

function Logo({ size = 28, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill={light ? "white" : "#1A1A1A"}/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill={light ? "#E5E5E5" : "#2D2D2D"}/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Mockup interactif de la carte client
function MenuMockup() {
  return (
    <div style={{ background: "#1A1A1A", borderRadius: 24, padding: 3, maxWidth: 320, margin: "0 auto", boxShadow: "0 32px 64px rgba(0,0,0,0.2)" }}>
      <div style={{ background: "white", borderRadius: 22, overflow: "hidden" }}>
        {/* Header téléphone */}
        <div style={{ background: "#1A1A1A", padding: "10px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: "white", margin: 0 }}>Le Bistrot du Coin</p>
          <div style={{ display: "flex", gap: 4 }}>
            {["🇫🇷","🇬🇧","🇪🇸","🇩🇪"].map((f, i) => (
              <span key={i} style={{ fontSize: 13, opacity: i === 0 ? 1 : 0.4 }}>{f}</span>
            ))}
          </div>
        </div>
        {/* Sélection allergènes */}
        <div style={{ padding: "10px 12px 6px", background: "#F7F7F5", borderBottom: "1px solid #EBEBEB" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#888", margin: "0 0 6px", textTransform: "uppercase" }}>Mes allergies</p>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {[
              { label: "Gluten", color: "#FFF3CD", text: "#856404", active: true },
              { label: "Lait", color: "#D0E8FF", text: "#084298", active: false },
              { label: "Œufs", color: "#FFF3CD", text: "#856404", active: false },
              { label: "Poissons", color: "#D0E8FF", text: "#084298", active: true },
            ].map((a, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: a.active ? a.color : "#F0F0F0", color: a.active ? a.text : "#BBB", border: a.active ? `1px solid ${a.text}30` : "1px solid #E8E8E8" }}>
                {a.label}
              </span>
            ))}
          </div>
        </div>
        {/* Plats */}
        <div style={{ padding: "8px 12px" }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>Plats</p>
          {[
            { name: "Blanquette de veau", ok: true, allergens: ["Lait"] },
            { name: "Sole meunière", ok: false, allergens: ["Gluten", "Poissons"] },
            { name: "Magret de canard", ok: true, allergens: [] },
          ].map((plat, i) => (
            <div key={i} style={{ padding: "7px 8px", borderRadius: 8, marginBottom: 5, background: plat.ok ? "white" : "#F9F9F9", border: `1px solid ${plat.ok ? "#EBEBEB" : "#F0F0F0"}`, opacity: plat.ok ? 1 : 0.55 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: plat.ok ? "#1A1A1A" : "#999", margin: 0 }}>{plat.name}</p>
                {!plat.ok && <span style={{ fontSize: 9, background: "#FFF3CD", color: "#856404", padding: "2px 6px", borderRadius: 10, fontWeight: 600 }}>⚠️ Allergène</span>}
              </div>
              {plat.allergens.length > 0 && (
                <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
                  {plat.allergens.map((a, j) => (
                    <span key={j} style={{ fontSize: 9, background: "#F0F0F0", color: "#888", padding: "1px 6px", borderRadius: 10 }}>{a}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: "4px 12px 10px", textAlign: "center" }}>
          <p style={{ fontSize: 9, color: "#CCC", margin: 0 }}>Propulsé par MenuSafe</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const goAuth = () => router.push("/auth");
  const goDashboard = () => router.push("/dashboard");

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "white" }}>

      {/* Navbar */}
      <nav style={s.nav}>
        <div style={{ ...s.navInner, maxWidth: 1100 }}>
          <div style={s.logo}>
            <Logo size={26} />
            <p style={s.logoName}>MenuSafe</p>
          </div>
          <div style={s.navRight}>
            <a href="#features" style={s.navLink}>Fonctionnalités</a>
            <a href="#pricing" style={s.navLink}>Tarifs</a>
            <button style={s.btnSecondary} onClick={goDashboard}>Se connecter</button>
            <button style={s.btnPrimary} onClick={goAuth}>Essayer gratuitement →</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
            <div>
              <div style={s.heroBadge}>✅ Conforme loi INCO · 14 allergènes légaux</div>
              <h1 style={s.h1}>Vos fiches allergènes,<br />votre carte interactive,<br /><span style={{ color: "#1A1A1A" }}>en 5 minutes.</span></h1>
              <p style={s.heroSub}>
                Obligation légale depuis 2014, encore violée par <strong>75% des restaurants</strong>. MenuSafe gère vos allergènes, génère vos PDF conformes, crée votre carte interactive multilingue avec filtrage allergènes en temps réel.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
                <button style={s.ctaPrimary} onClick={goAuth}>Créer mon compte gratuitement →</button>
                <p style={s.ctaNote}>7 jours gratuits · Sans CB · Annulation en 1 clic</p>
              </div>
              <div style={s.heroStats}>
                {[
                  { n: "1 500€", l: "Amende par infraction" },
                  { n: "75%", l: "Non conformes" },
                  { n: "8", l: "Langues supportées" },
                ].map((st, i) => (
                  <div key={i} style={s.heroStat}>
                    <span style={s.heroStatN}>{st.n}</span>
                    <span style={s.heroStatL}>{st.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <MenuMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={s.section}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>Fonctionnalités</p>
          <h2 style={s.h2}>Tout ce qu'il faut, rien de superflu</h2>
          <div style={s.featureGrid}>
            {[
              { icon: "🔍", title: "Détection allergènes en temps réel", desc: "Base de 900+ ingrédients. Tapez un ingrédient, les 14 allergènes légaux s'affichent instantanément. Autocomplétion intelligente." },
              { icon: "📱", title: "Carte interactive multilingue", desc: "Un QR code par établissement. Vos clients scannent, choisissent leur langue (8 disponibles) et cochent leurs allergies. Les plats incompatibles sont grisés automatiquement." },
              { icon: "📄", title: "PDF carte complète", desc: "Un document A4 paysage avec tous vos plats organisés par catégorie — Entrées, Plats, Desserts, Boissons — avec les allergènes de chaque plat. À plastifier sur vos tables." },
              { icon: "🧠", title: "Import IA depuis une photo", desc: "Photographiez votre carte existante. L'IA lit les plats et leurs ingrédients. Si aucun ingrédient n'est listé, elle propose la recette traditionnelle. Vous validez plat par plat." },
              { icon: "🏪", title: "Multi-établissements", desc: "Gérez plusieurs adresses depuis un seul compte avec navigation par onglets. Chaque établissement a son propre QR code et sa propre carte." },
              { icon: "🔄", title: "Mise à jour instantanée", desc: "Modifiez une recette et la carte interactive se met à jour en temps réel. Le QR code ne change jamais — imprimez-le une seule fois." },
            ].map((f, i) => (
              <div key={i} style={s.featureCard}>
                <span style={s.featureIcon}>{f.icon}</span>
                <p style={s.featureTitle}>{f.title}</p>
                <p style={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section carte interactive focus */}
      <section style={{ ...s.section, background: "#0F0F0F", padding: "80px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <p style={{ ...s.eyebrow, color: "#4ADE80", textAlign: "left" }}>Nouveau</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              La carte interactive<br />que vos clients adorent
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 28 }}>
              Un seul QR code sur chaque table. Le client scanne, sélectionne sa langue et coche ses allergies. Les plats incompatibles s'affichent grisés avec une alerte. La carte se filtre en temps réel, sans rechargement.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[
                { icon: "🌍", text: "8 langues : français, anglais, espagnol, allemand, italien, néerlandais, japonais, mandarin" },
                { icon: "⚠️", text: "Filtrage allergènes en temps réel — plats incompatibles grisés avec alerte" },
                { icon: "🔄", text: "Mise à jour automatique quand vous modifiez vos recettes" },
                { icon: "📱", text: "100% optimisé mobile — aucune app à télécharger" },
                { icon: "🖨️", text: "QR code permanent — imprimez-le une fois, plastifiez-le sur vos tables" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{f.icon}</span>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0, lineHeight: 1.5 }}>{f.text}</p>
                </div>
              ))}
            </div>
            <button style={{ ...s.ctaPrimary, background: "#4ADE80", color: "#0F0F0F" }} onClick={goAuth}>
              Créer ma carte interactive →
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <MenuMockup />
          </div>
        </div>
      </section>

      {/* Section import IA */}
      <section style={{ ...s.section, background: "#F7F7F5" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div style={{ background: "white", borderRadius: 20, padding: 28, border: "1px solid #EBEBEB" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>Import IA en action</p>
            <div style={{ background: "#F7F7F5", borderRadius: 12, padding: "14px 16px", marginBottom: 12, border: "1px dashed #DDD" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px" }}>📸 Carte uploadée</p>
              <p style={{ fontSize: 12, color: "#888", margin: 0 }}>maison-louvard-carte.jpg</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "Blanquette de veau", source: "carte", allergens: ["Lait"] },
                { name: "Sole meunière", source: "ia", allergens: ["Poissons", "Gluten", "Lait"] },
                { name: "Tarte tatin", source: "ia", allergens: ["Gluten", "Lait", "Œufs"] },
              ].map((p, i) => (
                <div key={i} style={{ background: p.source === "ia" ? "#FDFAFF" : "white", border: `1px solid ${p.source === "ia" ? "#E8D5FF" : "#EBEBEB"}`, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>{p.name}</p>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: p.source === "ia" ? "#F0E6FF" : "#E6F1FB", color: p.source === "ia" ? "#5A2D8E" : "#084298" }}>
                      {p.source === "ia" ? "🧠 Suggestion IA" : "📋 Depuis carte"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {p.allergens.map((a, j) => (
                      <span key={j} style={{ fontSize: 10, background: "#FFF3CD", color: "#856404", padding: "2px 6px", borderRadius: 10 }}>{a}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <div style={{ flex: 1, padding: "5px", fontSize: 11, fontWeight: 600, background: "#1A1A1A", color: "white", borderRadius: 7, textAlign: "center" }}>✓ Valider</div>
                    <div style={{ padding: "5px 10px", fontSize: 11, color: "#888", border: "1px solid #E0E0E0", borderRadius: 7, textAlign: "center" }}>Ignorer</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ ...s.eyebrow, textAlign: "left" }}>Import IA · Pro & Réseau</p>
            <h2 style={{ ...s.h2, textAlign: "left", marginBottom: 16 }}>Toute votre carte<br />en une photo</h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 20 }}>
              Photographiez votre carte ou uploadez un PDF. L'IA lit tous vos plats et leurs ingrédients. Si un plat n'a pas d'ingrédients détaillés, elle propose la recette traditionnelle correspondante.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {[
                "Photo, image ou PDF de votre carte",
                "Ingrédients lus directement si présents",
                "Recette traditionnelle suggérée si absents",
                "Détection allergènes automatique",
                "Validation plat par plat avant import",
                "Tout importer en masse en 1 clic",
              ].map((f, i) => (
                <p key={i} style={{ fontSize: 13, color: "#444", margin: 0, display: "flex", gap: 8 }}>
                  <span style={{ color: "#4ADE80" }}>✓</span> {f}
                </p>
              ))}
            </div>
            <button style={s.btnPrimary} onClick={goAuth}>Essayer gratuitement →</button>
          </div>
        </div>
      </section>

      {/* Risk */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>Le risque réel</p>
          <h2 style={s.h2}>Une amende qui se justifie en 3 secondes</h2>
          <div style={s.riskGrid}>
            <div style={s.riskCard}>
              <p style={s.riskIcon}>⚠️</p>
              <p style={s.riskTitle}>Sans MenuSafe</p>
              <ul style={s.riskList}>
                {["Amende DGCCRF : jusqu'à 1 500€ par infraction", "Publication sur Alim'Confiance (visible sur Google)", "Fermeture temporaire en récidive", "Classeur papier toujours périmé", "3-4h par mois de mise à jour manuelle"].map((t, i) => (
                  <li key={i} style={s.riskItem}><span style={{ color: "#E53E3E" }}>✗</span> {t}</li>
                ))}
              </ul>
            </div>
            <div style={{ ...s.riskCard, border: "2px solid #1A1A1A" }}>
              <p style={s.riskIcon}>✅</p>
              <p style={s.riskTitle}>Avec MenuSafe</p>
              <ul style={s.riskList}>
                {["Conformité garantie en 5 minutes", "PDF légal téléchargeable instantanément", "Carte interactive multilingue pour vos clients", "QR code permanent — imprimez-le une fois", "Moins de 1€/jour — ROI en 1 amende évitée"].map((t, i) => (
                  <li key={i} style={s.riskItem}><span style={{ color: "#38A169" }}>✓</span> {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ ...s.section, background: "#F7F7F5" }}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>Témoignages</p>
          <h2 style={s.h2}>Ils ont évité l'amende</h2>
          <div style={s.testiGrid}>
            {[
              { name: "Sophie M.", role: "Restauratrice · Lyon", quote: "J'avais reçu un avertissement de la DGCCRF. Avec MenuSafe j'ai mis tous mes plats en conformité en une après-midi. Le QR code sur les tables, c'est bluffant.", stars: 5 },
              { name: "Karim B.", role: "Food truck · Paris", quote: "Mon menu change chaque semaine. J'ai photographié ma carte, l'IA a tout importé en 10 minutes. Mes clients étrangers adorent choisir leur langue.", stars: 5 },
              { name: "Marie-Claire D.", role: "Boulangerie · Bordeaux", quote: "Simple, rapide, efficace. Le PDF carte complète est vraiment professionnel — je l'ai plastifié et affiché derrière la caisse.", stars: 5 },
            ].map((t, i) => (
              <div key={i} style={s.testiCard}>
                <p style={s.stars}>{"★".repeat(t.stars)}</p>
                <p style={s.testiQuote}>"{t.quote}"</p>
                <div style={s.testiAuthor}>
                  <div style={s.testiAvatar}>{t.name[0]}</div>
                  <div>
                    <p style={s.testiName}>{t.name}</p>
                    <p style={s.testiRole}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={s.section}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>Tarifs</p>
          <h2 style={s.h2}>Moins cher qu'une seule amende</h2>
          <p style={{ textAlign: "center", fontSize: 15, color: "#666", marginBottom: 40, marginTop: -16 }}>
            Une amende DGCCRF coûte 1 500€. L'abonnement annuel MenuSafe coûte 249€.
          </p>
          <div style={s.pricingGrid}>
            {[
              {
                name: "Solo", price: "29", badge: null, desc: "Pour 1 établissement",
                features: ["Jusqu'à 3 recettes (gratuit)", "50 recettes max", "PDF conformes INCO", "QR code par plat", "Carte multilingue basique", "1 établissement", "Support email"],
              },
              {
                name: "Pro", price: "59", badge: "Plus populaire", desc: "Jusqu'à 3 établissements",
                features: ["Recettes illimitées", "3 établissements", "Carte interactive multilingue", "Import IA depuis photo", "PDF carte complète", "Gestion équipe (3 membres)", "Export CSV", "Support prioritaire"],
              },
              {
                name: "Réseau", price: "149", badge: null, desc: "4+ établissements / franchises",
                features: ["Tout Pro inclus", "Établissements illimités", "Membres illimités", "Accès API", "Account manager dédié", "Contrat annuel possible"],
              },
            ].map((plan, i) => (
              <div key={i} style={{ ...s.pricingCard, ...(plan.badge ? s.pricingCardFeatured : {}) }}>
                {plan.badge && <div style={s.pricingBadge}>{plan.badge}</div>}
                <p style={s.planName}>{plan.name}</p>
                <p style={s.planDesc}>{plan.desc}</p>
                <div style={s.planPriceRow}>
                  <span style={s.planPrice}>{plan.price}€</span>
                  <span style={s.planPeriod}>/mois</span>
                </div>
                <p style={s.planAnnual}>ou {plan.price * 10}€/an <span style={s.planSaving}>(2 mois offerts)</span></p>
                <ul style={s.planFeatures}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={s.planFeature}><span style={{ color: "#38A169", marginRight: 8 }}>✓</span>{f}</li>
                  ))}
                </ul>
                <button style={plan.badge ? s.ctaPrimary : s.ctaSecondary} onClick={goAuth}>
                  Commencer l'essai gratuit
                </button>
                <p style={s.planNote}>7 jours gratuits · Sans CB</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ ...s.section, background: "#F7F7F5" }}>
        <div style={{ ...s.sectionInner, maxWidth: 720 }}>
          <p style={s.eyebrow}>FAQ</p>
          <h2 style={s.h2}>Questions fréquentes</h2>
          {[
            { q: "Est-ce vraiment obligatoire ?", a: "Oui. Le règlement UE n°1169/2011 (INCO), entré en vigueur en France en décembre 2014, oblige tous les établissements de restauration commerciale à déclarer les 14 allergènes majeurs. L'absence d'information est passible d'une amende allant jusqu'à 1 500€ par infraction constatée par la DGCCRF ou la DDETSPP." },
            { q: "La carte interactive fonctionne dans quelles langues ?", a: "Français, anglais, espagnol, allemand, italien, néerlandais, japonais et mandarin. La traduction est générée automatiquement par IA et mise en cache — le chargement est quasi-instantané pour les langues déjà consultées." },
            { q: "Que se passe-t-il si je change une recette ?", a: "La carte interactive se met à jour instantanément pour tous vos clients. Le QR code que vous avez imprimé sur vos tables ne change jamais — vous n'avez rien à réimprimer." },
            { q: "Comment fonctionne l'import par photo ?", a: "Vous photographiez votre carte (ou uploadez un PDF) depuis le dashboard. L'IA lit tous vos plats et leurs ingrédients. Si un plat n'a pas d'ingrédients détaillés, elle propose automatiquement la recette traditionnelle française correspondante. Vous validez ou ignorez chaque plat avant l'import. Disponible en plan Pro et Réseau." },
            { q: "Puis-je gérer plusieurs restaurants ?", a: "Oui. Le plan Pro permet jusqu'à 3 établissements, le plan Réseau est illimité. Chaque établissement a sa propre carte, son propre QR code et ses propres recettes, tous accessibles depuis un seul compte." },
            { q: "Puis-je essayer avant de payer ?", a: "Oui, 7 jours d'essai complet sans carte bancaire. Accès à toutes les fonctionnalités de votre formule. Si vous n'êtes pas convaincu, vous ne payez rien." },
          ].map((faq, i) => (
            <div key={i} style={s.faqItem}>
              <p style={s.faqQ}>{faq.q}</p>
              <p style={s.faqA}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section style={{ background: "#0F0F0F", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Logo size={52} light />
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Prêt à être en conformité ?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 32, lineHeight: 1.7 }}>
            Rejoignez les restaurateurs qui dorment tranquilles. Carte interactive multilingue, PDF conformes, import IA — tout en un.
          </p>
          <button style={{ ...s.ctaPrimary, background: "white", color: "#0F0F0F", fontSize: 16, padding: "16px 32px" }} onClick={goAuth}>
            Créer mon compte gratuitement →
          </button>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>7 jours gratuits · Sans carte bancaire · Annulation en 1 clic</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#080808", padding: "28px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Logo size={20} light />
            <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", margin: 0 }}>MenuSafe</p>
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
            © 2026 MenuSafe · Conforme règlement INCO UE n°1169/2011 · contact@menusafe.fr
          </p>
        </div>
      </footer>
    </div>
  );
}

const s = {
  nav: { background: "white", borderBottom: "1px solid #F0F0F0", position: "sticky", top: 0, zIndex: 100 },
  navInner: { maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoName: { fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: "-0.02em" },
  navRight: { display: "flex", alignItems: "center", gap: 12 },
  navLink: { fontSize: 13, color: "#555", textDecoration: "none", fontWeight: 500 },
  btnPrimary: { fontSize: 13, fontWeight: 600, padding: "8px 16px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" },
  btnSecondary: { fontSize: 13, fontWeight: 600, padding: "8px 16px", background: "white", color: "#1A1A1A", border: "1px solid #E0E0E0", borderRadius: 10, cursor: "pointer" },
  hero: { background: "white", padding: "72px 20px 80px", borderBottom: "1px solid #F0F0F0" },
  heroInner: { maxWidth: 1100, margin: "0 auto" },
  heroBadge: { display: "inline-block", fontSize: 12, fontWeight: 600, background: "#D4EDDA", color: "#155724", padding: "5px 14px", borderRadius: 20, marginBottom: 20 },
  h1: { fontSize: 40, fontWeight: 800, color: "#1A1A1A", margin: "0 0 20px", letterSpacing: "-0.03em", lineHeight: 1.15 },
  heroSub: { fontSize: 16, color: "#555", lineHeight: 1.7, marginBottom: 28 },
  ctaPrimary: { fontSize: 15, fontWeight: 700, padding: "14px 28px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, cursor: "pointer" },
  ctaSecondary: { width: "100%", fontSize: 14, fontWeight: 600, padding: "11px", background: "white", color: "#1A1A1A", border: "1.5px solid #1A1A1A", borderRadius: 10, cursor: "pointer", marginTop: 10 },
  ctaNote: { fontSize: 12, color: "#999", margin: "8px 0 0" },
  heroStats: { display: "flex", gap: 28, marginTop: 32 },
  heroStat: { display: "flex", flexDirection: "column" },
  heroStatN: { fontSize: 24, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" },
  heroStatL: { fontSize: 12, color: "#888", marginTop: 2 },
  section: { padding: "80px 20px" },
  sectionInner: { maxWidth: 1100, margin: "0 auto" },
  eyebrow: { fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 12 },
  h2: { fontSize: 32, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 48px", letterSpacing: "-0.02em" },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  featureCard: { background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "24px" },
  featureIcon: { fontSize: 24, display: "block", marginBottom: 12 },
  featureTitle: { fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px" },
  featureDesc: { fontSize: 13, color: "#666", lineHeight: 1.65, margin: 0 },
  riskGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 760, margin: "0 auto" },
  riskCard: { background: "white", border: "1px solid #E8E8E8", borderRadius: 16, padding: "28px" },
  riskIcon: { fontSize: 28, marginBottom: 8 },
  riskTitle: { fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 },
  riskList: { listStyle: "none", padding: 0, margin: 0 },
  riskItem: { fontSize: 13, color: "#444", padding: "7px 0", borderBottom: "1px solid #F5F5F5", display: "flex", gap: 8 },
  testiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 },
  testiCard: { background: "white", borderRadius: 16, padding: "24px", border: "1px solid #EBEBEB" },
  stars: { color: "#F6C000", fontSize: 16, margin: "0 0 12px" },
  testiQuote: { fontSize: 14, color: "#333", lineHeight: 1.65, margin: "0 0 16px", fontStyle: "italic" },
  testiAuthor: { display: "flex", alignItems: "center", gap: 10 },
  testiAvatar: { width: 36, height: 36, borderRadius: "50%", background: "#1A1A1A", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 },
  testiName: { fontSize: 13, fontWeight: 600, color: "#1A1A1A", margin: 0 },
  testiRole: { fontSize: 11, color: "#999", margin: 0 },
  pricingGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 960, margin: "0 auto" },
  pricingCard: { background: "white", border: "1px solid #E8E8E8", borderRadius: 18, padding: "28px", position: "relative" },
  pricingCardFeatured: { border: "2px solid #1A1A1A" },
  pricingBadge: { position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#1A1A1A", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" },
  planName: { fontSize: 18, fontWeight: 800, color: "#1A1A1A", margin: "0 0 4px" },
  planDesc: { fontSize: 12, color: "#999", margin: "0 0 16px" },
  planPriceRow: { display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 },
  planPrice: { fontSize: 36, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" },
  planPeriod: { fontSize: 14, color: "#999" },
  planAnnual: { fontSize: 12, color: "#888", margin: "0 0 20px" },
  planSaving: { color: "#38A169", fontWeight: 600 },
  planFeatures: { listStyle: "none", padding: 0, margin: "0 0 24px" },
  planFeature: { fontSize: 13, color: "#444", padding: "5px 0", display: "flex", alignItems: "flex-start" },
  planNote: { fontSize: 11, color: "#BBB", textAlign: "center", margin: "8px 0 0" },
  faqItem: { borderBottom: "1px solid #EBEBEB", padding: "22px 0" },
  faqQ: { fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px" },
  faqA: { fontSize: 13, color: "#666", lineHeight: 1.7, margin: 0 },
};