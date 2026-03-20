"use client";
import { useRouter } from "next/navigation";

export default function ConfidentialitePage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Politique de confidentialité</h1>
        <p style={{ fontSize: 13, color: "#999", margin: "0 0 40px" }}>Version en vigueur au 20 mars 2026</p>

        {[
          { title: "1. Responsable du traitement", content: "MenuSafe est responsable du traitement de vos données personnelles. Contact : contact@menusafe.fr" },
          { title: "2. Données collectées", content: "Nous collectons : votre adresse email (inscription et connexion), les informations relatives à votre établissement (nom, adresses), vos recettes et ingrédients, et les données de navigation (logs de connexion). Nous ne collectons aucune donnée bancaire — les paiements sont gérés exclusivement par Stripe." },
          { title: "3. Finalité du traitement", content: "Vos données sont utilisées pour : la fourniture du Service MenuSafe, la gestion de votre abonnement, l'envoi d'emails transactionnels (confirmation d'inscription, factures), et l'amélioration du Service. Nous n'utilisons pas vos données à des fins publicitaires et ne les revendons pas à des tiers." },
          { title: "4. Base légale", content: "Le traitement de vos données repose sur : l'exécution du contrat (CGU) pour la fourniture du Service, votre consentement pour les communications marketing optionnelles, et notre intérêt légitime pour l'amélioration du Service et la sécurité." },
          { title: "5. Durée de conservation", content: "Vos données sont conservées pendant toute la durée de votre abonnement, plus 3 ans après la résiliation pour des raisons légales (obligations comptables et fiscales). Les données de navigation sont conservées 13 mois maximum." },
          { title: "6. Hébergement et transferts", content: "Vos données sont hébergées sur l'infrastructure Supabase (AWS, région Europe — Frankfurt). Aucun transfert hors Union Européenne n'est effectué sans garanties appropriées (clauses contractuelles types)." },
          { title: "7. Vos droits", content: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression (droit à l'oubli), de portabilité, d'opposition et de limitation du traitement. Pour exercer ces droits : contact@menusafe.fr. Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr)." },
          { title: "8. Cookies", content: "MenuSafe utilise uniquement des cookies techniques nécessaires au fonctionnement du Service (session d'authentification). Aucun cookie publicitaire ou de tracking tiers n'est utilisé." },
          { title: "9. Sécurité", content: "Nous mettons en œuvre des mesures de sécurité appropriées : chiffrement des communications (HTTPS/TLS), authentification sécurisée via Supabase Auth, et accès aux données restreint aux seuls services nécessaires." },
          { title: "10. Contact", content: "Pour toute question relative à cette politique : contact@menusafe.fr" },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px", paddingBottom: 8, borderBottom: "1px solid #EBEBEB" }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.75, margin: 0 }}>{s.content}</p>
          </div>
        ))}
      </main>
    </div>
  );
}