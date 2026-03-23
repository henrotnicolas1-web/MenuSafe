"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/lib/useWindowSize";
import { AllergenIcon, ALLERGENS } from "@/lib/allergens-db";
import { ShieldCheck, FileText, Smartphone, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

function Logo({ size = 26, light = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill={light ? "white" : "#1A1A1A"}/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill={light ? "#E5E5E5" : "#2D2D2D"}/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const RISK_LEVELS = [
  { min: 0,  max: 25,  label: "Risque faible",   color: "#155724", bg: "#F0FFF4", border: "#C6F6D5",
    headline: "Vous êtes sur la bonne voie.", sub: "Quelques points à consolider pour une conformité totale." },
  { min: 26, max: 50,  label: "Risque modéré",   color: "#856404", bg: "#FFFBEB", border: "#FDE68A",
    headline: "Des lacunes à combler rapidement.", sub: "Un contrôle DGCCRF aujourd'hui pourrait vous coûter cher." },
  { min: 51, max: 75,  label: "Risque élevé",    color: "#CC0000", bg: "#FFF0F0", border: "#FFD0D0",
    headline: "Situation préoccupante.", sub: "Votre établissement est exposé à des sanctions significatives." },
  { min: 76, max: 100, label: "Risque critique", color: "#7B0000", bg: "#FFF0F0", border: "#FF9999",
    headline: "Action urgente requise.", sub: "Un contrôle aujourd'hui = amende quasi certaine." },
];

const QUESTIONS = [
  {
    key: "type", label: "Quel type d'établissement ?",
    sub: "Chaque profil a ses propres obligations et niveaux de contrôle.",
    options: [
      { label: "Food truck", value: "food_truck", score: 15, desc: "Mobile, clientèle pressée" },
      { label: "Boulangerie / café", value: "bakery", score: 10, desc: "Produits très allergènes" },
      { label: "Restaurant", value: "restaurant", score: 20, desc: "Le profil le plus contrôlé" },
      { label: "Traiteur / événementiel", value: "catering", score: 25, desc: "Haut risque, clientèle diverse" },
    ],
  },
  {
    key: "dishes", label: "Combien de plats à votre carte ?",
    sub: "Plus vous avez de plats, plus le risque d'oubli est élevé.",
    options: [
      { label: "Moins de 10", value: "few", score: 5 },
      { label: "10 à 30", value: "medium", score: 10 },
      { label: "Plus de 30", value: "many", score: 20 },
    ],
  },
  {
    key: "updates", label: "À quelle fréquence changez-vous votre carte ?",
    sub: "Chaque changement doit s'accompagner d'une mise à jour des allergènes.",
    options: [
      { label: "Rarement (1×/an)", value: "rare", score: 5 },
      { label: "Occasionnellement", value: "sometimes", score: 15 },
      { label: "Souvent (plat du jour)", value: "often", score: 25 },
    ],
  },
  {
    key: "format", label: "Comment déclarez-vous vos allergènes aujourd'hui ?",
    sub: "La mention verbale ne suffit plus depuis 2014. Un document écrit est obligatoire.",
    options: [
      { label: "Solution numérique à jour", value: "digital", score: 0 },
      { label: "PDF imprimé", value: "pdf", score: 20 },
      { label: "Classeur / fiche papier", value: "paper", score: 25 },
      { label: "À l'oral par les serveurs", value: "verbal", score: 40 },
    ],
  },
  {
    key: "controls", label: "Avez-vous déjà eu un contrôle DGCCRF ?",
    sub: "Les établissements ayant reçu un avertissement sont re-contrôlés en priorité.",
    options: [
      { label: "Jamais", value: "never", score: 10 },
      { label: "Oui, sans problème", value: "ok", score: 5 },
      { label: "Oui, avec avertissement", value: "warning", score: 20 },
    ],
  },
];

const RISK_ACTIONS = {
  faible: [
    { title: "Vérifiez la complétude", desc: "Assurez-vous que chaque plat a bien ses allergènes déclarés par écrit, y compris les suggestions du jour." },
    { title: "Accessibilité client", desc: "Le document doit être visible et accessible sans que le client n'ait à le demander." },
    { title: "Anticipez les mises à jour", desc: "Tout changement d'ingrédient ou de fournisseur doit déclencher une mise à jour immédiate." },
  ],
  modere: [
    { title: "Formalisez par écrit", desc: "La mémoire verbale de vos serveurs ne suffit plus. Un document écrit par plat est exigé par la loi." },
    { title: "Remplacez vos supports statiques", desc: "Un PDF imprimé ne se met pas à jour seul. Chaque modification de recette crée un risque." },
    { title: "Préparez-vous au contrôle", desc: "Les établissements avec des lacunes modérées sont la cible privilégiée des inspections de routine." },
  ],
  eleve: [
    { title: "Urgence : formalisez immédiatement", desc: "Un contrôle DGCCRF aujourd'hui se traduirait par une amende. Documentez vos 14 allergènes par plat, par écrit, maintenant." },
    { title: "Cessez la déclaration orale", desc: "La mention verbale est une infraction en soi depuis 2014. Elle n'a aucune valeur légale." },
    { title: "Mettez à jour tous vos supports", desc: "Chaque document obsolète est une infraction supplémentaire lors d'un contrôle." },
    { title: "Formez vos équipes", desc: "Vos serveurs doivent connaître les obligations légales et savoir où trouver les informations." },
  ],
  critique: [
    { title: "Agissez dans les 48h", desc: "Risque d'amende et de fermeture administrative en cas de contrôle. Ne repoussez pas." },
    { title: "Documentez 100% de vos plats", desc: "Chaque plat sans déclaration écrite est une infraction indépendante à 1 500€." },
    { title: "Remplacez vos processus manuels", desc: "Un classeur papier ou un fichier Excel n'offre aucune traçabilité ni protection juridique." },
    { title: "Informez vos équipes en urgence", desc: "En cas de contrôle, les agents vérifient aussi que les serveurs savent où trouver les informations." },
    { title: "Mettez en place une solution numérique", desc: "C'est le seul moyen de garantir que vos déclarations sont toujours à jour et accessibles." },
  ],
};

function getRiskKey(risk) {
  if (risk.min <= 25) return "faible";
  if (risk.min <= 50) return "modere";
  if (risk.min <= 75) return "eleve";
  return "critique";
}

function GaugeBar({ score, color }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(score), 150); return () => clearTimeout(t); }, [score]);
  const segments = [{ c: "#4ADE80" }, { c: "#FBBF24" }, { c: "#EF4444" }, { c: "#991B1B" }];
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", marginBottom: 8, gap: 2 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ flex: 1, background: s.c, opacity: animated > i * 25 ? 1 : 0.15, transition: "opacity 0.8s ease", borderRadius: 3 }} />
        ))}
      </div>
      <div style={{ position: "relative", height: 18 }}>
        <div style={{ position: "absolute", left: `${animated}%`, transform: "translateX(-50%)", transition: "left 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: color, border: "3px solid white", boxShadow: `0 0 0 2px ${color}55, 0 2px 8px rgba(0,0,0,0.15)` }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {["Faible", "Modéré", "Élevé", "Critique"].map((l, i) => (
          <span key={i} style={{ fontSize: 10, color: "#BBB", fontWeight: 500 }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function ConcreteEquivalent({ score }) {
  if (score <= 25) return null;
  const amende = score > 75 ? 4500 : score > 50 ? 1500 : 750;
  const equivalents = [
    `${Math.round(amende / 12)} mois d'abonnement MenuSafe Pro`,
    `${Math.round(amende / 80)} heures de travail en cuisine`,
    `${Math.round(amende / 25)} repas vendus`,
  ];
  return (
    <div style={{ background: "#FFF8E6", border: "1px solid #FDE68A", borderRadius: 10, padding: "12px 16px", marginTop: 12, textAlign: "left" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#856404", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
        Ce que représente {amende.toLocaleString("fr-FR")}€ pour votre activité
      </p>
      {equivalents.map((e, i) => (
        <div key={i} style={{ fontSize: 12, color: "#7A4F00", display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{ color: "#FBBF24", fontWeight: 700 }}>≈</span> {e}
        </div>
      ))}
    </div>
  );
}

export default function LoiIncoPage() {
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const [step, setStep] = useState("quiz");
  const [formData, setFormData] = useState({});
  const [score, setScore] = useState(0);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sendingReport, setSendingReport] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const resultRef = useRef(null);
  const simulRef = useRef(null);

  const allAnswered = QUESTIONS.every(q => formData[q.key] !== undefined);
  const risk = RISK_LEVELS.find(r => score >= r.min && score <= r.max) || RISK_LEVELS[0];
  const amendeEstimee = score > 50 ? Math.round((score / 100) * 4500 / 500) * 500 : 0;
  const actions = RISK_ACTIONS[getRiskKey(risk)];

  function handleCalculate() {
    let total = 0;
    QUESTIONS.forEach(q => {
      const opt = q.options.find(o => o.value === formData[q.key]);
      if (opt) total += opt.score;
    });
    const maxScore = QUESTIONS.reduce((acc, q) => acc + Math.max(...q.options.map(o => o.score)), 0);
    setScore(Math.round((total / maxScore) * 100));
    setStep("result");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  async function handleSendReport() {
    if (!email.includes("@")) return;
    setSendingReport(true);
    try {
      await fetch("/api/send-simulator-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, score, formData }),
      });
      setEmailSent(true);
    } catch {}
    setSendingReport(false);
  }

  function selectOption(key, value) {
    setFormData(f => ({ ...f, [key]: value }));
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 280);
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "white", color: "#1A1A1A" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ background: "#0F0F0F", padding: isMobile ? "56px 20px 48px" : "80px 20px 72px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#4ADE80", marginBottom: 24, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Règlement UE n°1169/2011 · En vigueur depuis 2014
          </div>
          <h1 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 800, color: "white", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Vos allergènes sont-ils<br />vraiment déclarés correctement ?
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            75% des restaurants français ne respectent pas la loi INCO. En 5 questions, découvrez si vous en faites partie — et ce que ça risque de vous coûter.
          </p>
          <button onClick={() => simulRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{ fontSize: 15, fontWeight: 700, padding: "14px 32px", background: "white", color: "#1A1A1A", border: "none", borderRadius: 12, cursor: "pointer" }}>
            Faire le test gratuit →
          </button>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 10 }}>2 minutes · Résultat immédiat · Sans inscription</p>
        </div>
      </section>

      {/* ── CHIFFRES CLÉS ── */}
      <section style={{ background: "#F7F7F5", padding: isMobile ? "40px 20px" : "56px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
          {[
            { n: "1 500€", l: "Amende par infraction", sub: "= 4 semaines de denrées", color: "#CC0000" },
            { n: "75%", l: "Des restaurateurs", sub: "exposés sans le savoir", color: "#856404" },
            { n: "2014", l: "Date d'obligation", sub: "12 ans de retard possible", color: "#1A1A1A" },
            { n: "14", l: "Allergènes légaux", sub: "à déclarer par plat", color: "#1A1A1A" },
          ].map((st, i) => (
            <div key={i} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 14, padding: isMobile ? "16px" : "20px", textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: st.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{st.n}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginTop: 6 }}>{st.l}</div>
              <div style={{ fontSize: 11, color: "#AAA", marginTop: 3 }}>{st.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 OBLIGATIONS ── */}
      <section style={{ padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>Ce que la loi exige concrètement</p>
          <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            3 obligations que beaucoup ignorent
          </h2>
          <p style={{ fontSize: 15, color: "#888", textAlign: "center", margin: "0 0 40px", maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
            La loi INCO ne se résume pas à "avoir une liste quelque part". Elle impose des règles précises.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                icon: <FileText size={22} color="#1A1A1A" strokeWidth={1.75} />,
                num: "01", title: "Obligatoirement par écrit",
                desc: "La mention verbale de vos serveurs n'a aucune valeur légale depuis 2014. Un document écrit, accessible à tout moment, est exigé.",
                bad: "\"Demandez au serveur\" → Infraction",
                good: "Document écrit accessible → Conforme",
              },
              {
                icon: <RefreshCw size={22} color="#1A1A1A" strokeWidth={1.75} />,
                num: "02", title: "Mis à jour à chaque changement",
                desc: "Un nouveau fournisseur, une modification de recette, un plat du jour : chaque changement oblige une mise à jour immédiate.",
                bad: "PDF imprimé de l'année dernière → Infraction",
                good: "Document mis à jour en temps réel → Conforme",
              },
              {
                icon: <Smartphone size={22} color="#1A1A1A" strokeWidth={1.75} />,
                num: "03", title: "Accessible sans demande",
                desc: "Votre client ne doit pas avoir à solliciter les informations. Elles doivent être disponibles spontanément.",
                bad: "Classeur en cuisine uniquement → Infraction",
                good: "QR code sur la table → Conforme",
              },
            ].map((c, i) => (
              <div key={i} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {c.icon}
                  </div>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "#EBEBEB", lineHeight: 1 }}>{c.num}</span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", margin: "0 0 10px", letterSpacing: "-0.01em" }}>{c.title}</p>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: "0 0 16px" }}>{c.desc}</p>
                <div style={{ fontSize: 12, color: "#CC0000", background: "#FFF0F0", borderRadius: 8, padding: "7px 10px", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <XCircle size={13} color="#CC0000" /> {c.bad}
                </div>
                <div style={{ fontSize: 12, color: "#155724", background: "#F0FFF4", borderRadius: 8, padding: "7px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                  <CheckCircle2 size={13} color="#155724" /> {c.good}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 14 ALLERGÈNES ── */}
      <section style={{ background: "#F7F7F5", padding: isMobile ? "48px 20px" : "64px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>Liste officielle annexe II</p>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Les 14 allergènes à déclarer
          </h2>
          <p style={{ fontSize: 14, color: "#AAA", textAlign: "center", margin: "0 0 28px" }}>Pour chaque plat, chaque ingrédient dérivé doit être identifié.</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(190px, 1fr))", gap: 8 }}>
            {ALLERGENS.map((a) => (
              <div key={a.id} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <AllergenIcon id={a.id} size={16} color={a.text} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "#AAA", marginTop: 1 }}>
                    {a.id === "gluten" && "Blé, seigle, orge, avoine"}
                    {a.id === "crustaces" && "Crevettes, homard, crabe"}
                    {a.id === "oeufs" && "Tous les œufs et dérivés"}
                    {a.id === "poissons" && "Tous les poissons"}
                    {a.id === "arachides" && "Cacahuètes et dérivés"}
                    {a.id === "soja" && "Tofu, lait de soja, édamame"}
                    {a.id === "lait" && "Lait, beurre, fromage, crème"}
                    {a.id === "fruits_coq" && "Noix, amande, noisette, cajou"}
                    {a.id === "celeri" && "Céleri-rave, graines, branche"}
                    {a.id === "moutarde" && "Graines, farine, huile"}
                    {a.id === "sesame" && "Tahini, huile, pain sésame"}
                    {a.id === "so2" && "Vins, fruits secs, conserves"}
                    {a.id === "lupin" && "Farine et graines de lupin"}
                    {a.id === "mollusques" && "Moules, huîtres, coquillages"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CE QUE FONT LES RESTAURANTS CONFORMES — Soulagement ── */}
      <section style={{ padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>La conformité, c'est simple</p>
          <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Les restaurants conformes font ça
          </h2>
          <p style={{ fontSize: 15, color: "#888", textAlign: "center", margin: "0 0 40px" }}>
            Ce n'est pas réservé aux grandes chaînes. Chaque restaurateur peut y être en moins d'une heure.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            {[
              { time: "5 min", action: "Lister tous leurs plats avec leurs ingrédients", note: "Une seule fois — l'IA peut le faire depuis une photo de votre carte" },
              { time: "10 min", action: "Identifier les allergènes de chaque plat", note: "MenuSafe détecte automatiquement les 14 allergènes depuis vos ingrédients" },
              { time: "2 min", action: "Générer le PDF conforme à imprimer", note: "Document A4 paysage prêt à plastifier, conforme règlement INCO" },
              { time: "1 min", action: "Mettre à jour quand une recette change", note: "Modification → carte à jour en temps réel, QR code inchangé" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "#F7F7F5", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ background: "#4ADE80", borderRadius: 8, padding: "4px 10px", flexShrink: 0, marginTop: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#1A1A1A" }}>{s.time}</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>{s.action}</p>
                  <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.5 }}>{s.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIMULATEUR ── */}
      <section ref={simulRef} style={{ background: "#F7F7F5", padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>Outil gratuit</p>
          <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Quel est votre niveau de risque ?
          </h2>
          <p style={{ fontSize: 14, color: "#888", textAlign: "center", margin: "0 0 28px" }}>5 questions · Score personnalisé · Rapport par email</p>

          <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>

            {step === "quiz" && (
              <div>
                {/* Progress bar */}
                <div style={{ padding: "16px 24px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>Question {currentQ + 1} sur {QUESTIONS.length}</span>
                    <span style={{ fontSize: 12, color: "#BBB" }}>{Object.keys(formData).length}/{QUESTIONS.length} répondues</span>
                  </div>
                  <div style={{ background: "#F0F0F0", borderRadius: 4, height: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "#1A1A1A", borderRadius: 4, width: `${(Object.keys(formData).length / QUESTIONS.length) * 100}%`, transition: "width 0.3s ease" }} />
                  </div>
                </div>

                {/* Questions */}
                <div style={{ padding: "24px 24px 8px" }}>
                  {QUESTIONS.map((q, qi) => (
                    <div key={q.key} style={{ marginBottom: 28, opacity: qi === currentQ ? 1 : qi < currentQ ? 0.5 : 0.4, transition: "opacity 0.2s" }}>
                      <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                        {qi + 1}. {q.label}
                      </p>
                      <p style={{ fontSize: 12, color: "#AAA", margin: "0 0 12px", lineHeight: 1.5 }}>{q.sub}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {q.options.map(opt => {
                          const selected = formData[q.key] === opt.value;
                          return (
                            <button key={opt.value} onClick={() => selectOption(q.key, opt.value)}
                              style={{ padding: "9px 14px", borderRadius: 10, fontSize: 13, fontWeight: selected ? 700 : 500,
                                cursor: "pointer", transition: "all 0.15s",
                                border: selected ? "2px solid #1A1A1A" : "1.5px solid #E8E8E8",
                                background: selected ? "#1A1A1A" : "white",
                                color: selected ? "white" : "#555",
                                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                              {opt.label}
                              {opt.desc && <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.65 }}>{opt.desc}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Nav */}
                <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
                  {currentQ > 0 && (
                    <button onClick={() => setCurrentQ(q => q - 1)}
                      style={{ padding: "10px 16px", fontSize: 13, background: "white", color: "#888", border: "1px solid #E0E0E0", borderRadius: 10, cursor: "pointer" }}>
                      ← Précédent
                    </button>
                  )}
                  {currentQ < QUESTIONS.length - 1 ? (
                    <button onClick={() => setCurrentQ(q => q + 1)} disabled={!formData[QUESTIONS[currentQ].key]}
                      style={{ flex: 1, padding: "11px", background: formData[QUESTIONS[currentQ].key] ? "#F7F7F5" : "#F0F0F0",
                        color: formData[QUESTIONS[currentQ].key] ? "#555" : "#BBB",
                        border: "1px solid #E0E0E0", borderRadius: 10, fontWeight: 600, fontSize: 13,
                        cursor: formData[QUESTIONS[currentQ].key] ? "pointer" : "not-allowed" }}>
                      Question suivante →
                    </button>
                  ) : (
                    <button onClick={handleCalculate} disabled={!allAnswered}
                      style={{ flex: 1, padding: "13px", background: allAnswered ? "#1A1A1A" : "#E0E0E0",
                        color: allAnswered ? "white" : "#AAA", border: "none", borderRadius: 12,
                        fontWeight: 700, fontSize: 14, cursor: allAnswered ? "pointer" : "not-allowed" }}>
                      Voir mon score →
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === "result" && (
              <div ref={resultRef}>
                {/* Score */}
                <div style={{ background: risk.bg, borderBottom: `3px solid ${risk.border}`, padding: "32px 28px", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: risk.color, color: "white", borderRadius: 100, padding: "6px 18px", marginBottom: 20, fontWeight: 700, fontSize: 13 }}>
                    {risk.label}
                  </div>
                  <div style={{ fontSize: 80, fontWeight: 800, color: risk.color, lineHeight: 0.9, marginBottom: 6, letterSpacing: "-0.04em" }}>
                    {score}<span style={{ fontSize: 28, fontWeight: 600, color: risk.color + "99" }}>/100</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: risk.color, margin: "8px 0 4px" }}>{risk.headline}</p>
                  <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px" }}>{risk.sub}</p>
                  <GaugeBar score={score} color={risk.color} />
                  {amendeEstimee > 0 && (
                    <div style={{ background: "white", borderRadius: 12, padding: "16px 20px", marginTop: 4, border: `1px solid ${risk.border}` }}>
                      <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Exposition financière estimée</div>
                      <div style={{ fontSize: 36, fontWeight: 800, color: "#CC0000", letterSpacing: "-0.02em" }}>
                        {amendeEstimee.toLocaleString("fr-FR")}€
                      </div>
                      <div style={{ fontSize: 11, color: "#BBB" }}>en cas de contrôle DGCCRF aujourd'hui</div>
                    </div>
                  )}
                  <ConcreteEquivalent score={score} />
                </div>

                <div style={{ padding: "24px 28px" }}>
                  {/* Actions */}
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px" }}>
                    {actions.length} actions prioritaires pour vous
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {actions.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: "#F7F7F5", borderRadius: 10 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: risk.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
                          {i + 1}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 3px" }}>{a.title}</p>
                          <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.5 }}>{a.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Email capture — fond sombre */}
                  {!emailSent ? (
                    <div style={{ background: "#0F0F0F", borderRadius: 14, padding: "20px 22px", marginBottom: 14 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "white", margin: "0 0 4px" }}>Recevez ce rapport par email</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 14px", lineHeight: 1.5 }}>
                        Score détaillé · Plan d'action personnalisé · Guide de mise en conformité
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="votre@restaurant.fr"
                          onKeyDown={e => e.key === "Enter" && handleSendReport()}
                          style={{ flex: 1, padding: "10px 14px", fontSize: 13, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 9, outline: "none", fontFamily: "inherit", background: "rgba(255,255,255,0.08)", color: "white" }} />
                        <button onClick={handleSendReport} disabled={sendingReport || !email.includes("@")}
                          style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, background: "white", color: "#1A1A1A", border: "none", borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap", opacity: sendingReport || !email.includes("@") ? 0.5 : 1 }}>
                          {sendingReport ? "Envoi..." : "Envoyer →"}
                        </button>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: "8px 0 0" }}>Pas de spam · Désabonnement en 1 clic</p>
                    </div>
                  ) : (
                    <div style={{ background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 12, padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                      <ShieldCheck size={18} color="#155724" />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#155724", margin: 0 }}>Rapport envoyé à {email}</p>
                        <p style={{ fontSize: 11, color: "#276749", margin: 0 }}>Vérifiez votre boîte mail · Pensez aux spams.</p>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <button onClick={() => router.push("/auth")}
                    style={{ width: "100%", padding: "14px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 8 }}>
                    Voir comment MenuSafe résout ça →
                  </button>
                  <p style={{ textAlign: "center", fontSize: 12, color: "#BBB", margin: "0 0 12px" }}>
                    7 jours gratuits · Sans carte bancaire · Annulation en 1 clic
                  </p>
                  <button onClick={() => { setStep("quiz"); setFormData({}); setScore(0); setEmail(""); setEmailSent(false); setCurrentQ(0); }}
                    style={{ background: "none", border: "none", color: "#AAA", fontSize: 12, cursor: "pointer", textDecoration: "underline", width: "100%", textAlign: "center" }}>
                    Refaire le test
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ background: "#0F0F0F", padding: isMobile ? "56px 20px" : "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Logo size={44} light />
          </div>
          <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Conforme en 5 minutes
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color: "rgba(255,255,255,0.5)", margin: "0 0 28px", lineHeight: 1.7 }}>
            MenuSafe gère vos 14 allergènes, génère vos PDF conformes et crée votre carte interactive multilingue.
          </p>
          <button onClick={() => router.push("/auth")}
            style={{ fontSize: 15, fontWeight: 700, padding: "14px 36px", background: "white", color: "#1A1A1A", border: "none", borderRadius: 12, cursor: "pointer" }}>
            Essayer gratuitement →
          </button>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 10 }}>Sans frais pendant 7 jours · Annulation en 1 clic</p>
        </div>
      </section>

      <footer style={{ background: "#080808", padding: "24px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/")}>
            <Logo size={18} light />
            <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>MenuSafe</span>
          </div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2026 MenuSafe · Règlement UE n°1169/2011</p>
        </div>
      </footer>
    </div>
  );
}