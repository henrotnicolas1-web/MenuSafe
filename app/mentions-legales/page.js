"use client";
import { useRouter } from "next/navigation";

export default function MentionsLegalesPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Mentions légales</h1>
        <p style={{ fontSize: 13, color: "#999", margin: "0 0 40px" }}>Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique</p>

        {[
          { title: "Éditeur du site", content: "MenuSafe\nSite web : menusafe.fr\nEmail : contact@menusafe.fr" },
          { title: "Directeur de la publication", content: "Le directeur de la publication est le représentant légal de MenuSafe." },
          { title: "Hébergement", content: "Le site est hébergé par :\nVercel Inc. — 440 N Barranca Ave #4133, Covina, CA 91723, USA\nLes données utilisateurs sont hébergées sur Supabase (AWS Frankfurt, Union Européenne)." },
          { title: "Propriété intellectuelle", content: "L'ensemble du contenu du site MenuSafe (textes, images, logo, interface) est protégé par le droit d'auteur et appartient à MenuSafe. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite." },
          { title: "Données personnelles", content: "Le traitement des données personnelles est décrit dans notre Politique de confidentialité, accessible sur ce site. Conformément au RGPD, vous pouvez exercer vos droits en contactant : contact@menusafe.fr" },
          { title: "Liens hypertextes", content: "MenuSafe décline toute responsabilité concernant les liens vers des sites externes. La présence de ces liens ne constitue pas une validation de leur contenu." },
          { title: "Droit applicable", content: "Le présent site est soumis au droit français. Tout litige relatif à son utilisation sera soumis à la compétence exclusive des tribunaux français." },
          { title: "Contact", content: "Pour toute question : contact@menusafe.fr" },
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