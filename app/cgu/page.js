"use client";
import { useRouter } from "next/navigation";

function Logo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="#1A1A1A"/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#2D2D2D"/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function CGUPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/")}>
            <Logo size={22} />
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>MenuSafe</span>
          </div>
          <button onClick={() => router.push("/")} style={{ fontSize: 13, color: "#888", background: "none", border: "none", cursor: "pointer" }}>← Retour</button>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 20px 80px" }}>
        <h1 style={s.h1}>Conditions Générales d'Utilisation</h1>
        <p style={s.meta}>Version en vigueur au 20 mars 2026 · MenuSafe SAS</p>

        <Section title="1. Présentation du service">
          <p>MenuSafe (ci-après « le Service ») est une plateforme SaaS éditée par MenuSafe, permettant aux professionnels de la restauration de gérer la déclaration des allergènes conformément au règlement UE n°1169/2011 (INCO).</p>
          <p>Le Service est accessible à l'adresse <strong>menusafe.fr</strong>.</p>
          <p>En utilisant le Service, l'Utilisateur accepte sans réserve les présentes Conditions Générales d'Utilisation (CGU).</p>
        </Section>

        <Section title="2. Responsabilité de l'Utilisateur — clause essentielle">
          <p style={{ background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 10, padding: "14px 16px", fontWeight: 600, color: "#CC0000" }}>
            CLAUSE IMPORTANTE — À LIRE ATTENTIVEMENT
          </p>
          <p><strong>MenuSafe est un outil d'aide à la gestion des allergènes. Il ne se substitue en aucun cas à la responsabilité légale du professionnel de la restauration.</strong></p>
          <p>L'Utilisateur reconnaît expressément que :</p>
          <ul style={s.ul}>
            <li>Il lui appartient de <strong>vérifier, valider et corriger</strong> l'intégralité des informations relatives aux ingrédients et aux allergènes saisies ou importées dans le Service, avant toute publication ou communication à des tiers.</li>
            <li>Les suggestions d'ingrédients générées par intelligence artificielle (fonction « Import IA ») sont des <strong>propositions automatiques non garanties</strong>, basées sur des recettes traditionnelles courantes. Elles peuvent être incomplètes, incorrectes ou ne pas correspondre à la préparation réelle de l'établissement.</li>
            <li>MenuSafe <strong>n'assume aucune responsabilité</strong> en cas d'allergie, de réaction allergique, de préjudice corporel ou matériel résultant d'une information erronée, manquante ou non vérifiée par l'Utilisateur.</li>
            <li>Le respect du règlement UE n°1169/2011 (INCO) et de toute réglementation applicable en matière d'allergènes est de la <strong>seule et entière responsabilité de l'exploitant de l'établissement</strong>.</li>
            <li>MenuSafe ne peut être tenu responsable des sanctions administratives, amendes, fermetures ou poursuites judiciaires résultant d'une information allergène incorrecte ou incomplète.</li>
          </ul>
          <p>En cas de doute sur un ingrédient ou un allergène, l'Utilisateur est tenu de consulter ses fiches techniques fournisseurs et, le cas échéant, un professionnel de la réglementation alimentaire.</p>
        </Section>

        <Section title="3. Description des fonctionnalités">
          <p>Le Service propose notamment :</p>
          <ul style={s.ul}>
            <li>La saisie manuelle de recettes et la détection automatique d'allergènes parmi les 14 allergènes majeurs définis par le règlement INCO</li>
            <li>La génération de fiches allergènes au format PDF</li>
            <li>La création d'une carte interactive multilingue accessible via QR code</li>
            <li>L'import de recettes par analyse d'image (IA) avec suggestions d'ingrédients</li>
            <li>La gestion multi-établissements selon le plan souscrit</li>
          </ul>
          <p>Les fonctionnalités disponibles varient selon le plan souscrit (Solo, Pro, Réseau). MenuSafe se réserve le droit de faire évoluer les fonctionnalités du Service à tout moment.</p>
        </Section>

        <Section title="4. Accès au Service et création de compte">
          <p>L'accès au Service nécessite la création d'un compte avec une adresse email valide et un mot de passe. L'Utilisateur est responsable de la confidentialité de ses identifiants.</p>
          <p>MenuSafe se réserve le droit de suspendre ou de résilier un compte en cas de violation des présentes CGU, d'utilisation abusive ou frauduleuse du Service.</p>
        </Section>

        <Section title="5. Conditions tarifaires et abonnement">
          <p><strong>Période d'essai :</strong> Une période d'essai de 7 jours est proposée lors de la souscription. Une carte bancaire valide est requise pour activer l'essai. Aucun débit n'est effectué pendant la période d'essai. À l'issue des 7 jours, l'abonnement est automatiquement activé sauf annulation préalable.</p>
          <p><strong>Annulation :</strong> L'Utilisateur peut annuler son abonnement à tout moment depuis son espace client. L'accès au Service reste actif jusqu'à la fin de la période de facturation en cours. Aucun remboursement partiel n'est effectué.</p>
          <p><strong>Modification des tarifs :</strong> MenuSafe se réserve le droit de modifier ses tarifs avec un préavis de 30 jours. La poursuite de l'utilisation du Service après ce délai vaut acceptation des nouveaux tarifs.</p>
          <p><strong>Paiement :</strong> Les paiements sont traités par Stripe, prestataire de services de paiement agréé. MenuSafe ne stocke aucune donnée bancaire.</p>
        </Section>

        <Section title="6. Disponibilité du Service">
          <p>MenuSafe s'efforce de maintenir le Service accessible 24h/24, 7j/7. Toutefois, des interruptions pour maintenance, mises à jour ou en cas de force majeure peuvent survenir. MenuSafe ne garantit pas une disponibilité sans interruption et ne saurait être tenu responsable des préjudices résultant d'une indisponibilité temporaire.</p>
        </Section>

        <Section title="7. Propriété intellectuelle">
          <p>L'ensemble des éléments constituant le Service (logiciels, interfaces, contenus, marques) sont la propriété exclusive de MenuSafe et sont protégés par le droit de la propriété intellectuelle.</p>
          <p>L'Utilisateur conserve la propriété de ses données (recettes, ingrédients, informations établissements). En utilisant le Service, il accorde à MenuSafe le droit d'héberger et traiter ces données dans le cadre de la fourniture du Service.</p>
        </Section>

        <Section title="8. Protection des données personnelles">
          <p>MenuSafe collecte et traite les données personnelles des Utilisateurs dans le respect du Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679).</p>
          <p>Les données collectées (email, informations établissement, recettes) sont utilisées exclusivement pour la fourniture du Service. Elles ne sont ni vendues ni cédées à des tiers.</p>
          <p>L'Utilisateur dispose d'un droit d'accès, de rectification, de suppression et de portabilité de ses données. Pour exercer ces droits : <strong>contact@menusafe.fr</strong>.</p>
          <p>Les données sont hébergées sur des serveurs sécurisés (Supabase, infrastructure AWS Europe).</p>
        </Section>

        <Section title="9. Limitation de responsabilité">
          <p>Dans les limites autorisées par la loi applicable, la responsabilité de MenuSafe est expressément limitée aux dommages directs prouvés, à l'exclusion de tout dommage indirect, perte d'exploitation, perte de données ou perte de revenus.</p>
          <p>En toute hypothèse, la responsabilité de MenuSafe ne pourra excéder le montant des sommes effectivement versées par l'Utilisateur au cours des 12 derniers mois précédant le fait générateur du dommage.</p>
          <p><strong>MenuSafe n'est pas responsable des conséquences sanitaires, légales ou financières résultant d'une information allergène incorrecte ou non vérifiée par l'Utilisateur.</strong> Voir article 2 pour les détails.</p>
        </Section>

        <Section title="10. Force majeure">
          <p>MenuSafe ne pourra être tenu responsable de tout manquement à ses obligations en cas de force majeure, incluant notamment les défaillances de réseau, pannes d'infrastructure, cyberattaques, catastrophes naturelles ou décisions gouvernementales.</p>
        </Section>

        <Section title="11. Modification des CGU">
          <p>MenuSafe se réserve le droit de modifier les présentes CGU à tout moment. Les Utilisateurs seront informés par email des modifications substantielles avec un préavis de 15 jours. La poursuite de l'utilisation du Service vaut acceptation des nouvelles CGU.</p>
        </Section>

        <Section title="12. Droit applicable et juridiction">
          <p>Les présentes CGU sont régies par le droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut d'accord amiable, le litige sera soumis aux tribunaux compétents de Paris.</p>
        </Section>

        <Section title="13. Contact">
          <p>Pour toute question relative aux présentes CGU : <strong>contact@menusafe.fr</strong></p>
        </Section>

        <p style={{ fontSize: 12, color: "#BBB", marginTop: 40, paddingTop: 20, borderTop: "1px solid #EBEBEB" }}>
          © 2026 MenuSafe — Tous droits réservés
        </p>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 12px", paddingBottom: 8, borderBottom: "1px solid #EBEBEB" }}>{title}</h2>
      <div style={{ fontSize: 14, color: "#444", lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}

const s = {
  h1: { fontSize: 28, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.02em" },
  meta: { fontSize: 13, color: "#999", margin: "0 0 40px" },
  ul: { paddingLeft: 20, margin: "10px 0" },
};