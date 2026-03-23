"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/lib/useWindowSize";
import { AllergenIcon, ALLERGENS } from "@/lib/allergens-db";
import { ShieldCheck, CheckCircle, ArrowRight, Users } from "lucide-react";
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

// ── Niveaux de risque ─────────────────────────────────────────────────────────
const RISK_LEVELS = [
  { min: 0,  max: 25,  key: "faible",   label: "Bien positionné",  color: "#155724", bg: "#F0FFF4", border: "#C6F6D5",
    headline: "Vous êtes globalement conforme.", sub: "Quelques points à consolider pour une conformité totale. Vous faites partie des 25% les mieux préparés." },
  { min: 26, max: 50,  key: "modere",   label: "À améliorer",      color: "#856404", bg: "#FFFBEB", border: "#FDE68A",
    headline: "Des lacunes identifiées.", sub: "Votre score est supérieur à 40% des établissements analysés, mais un contrôle aujourd'hui vous exposerait." },
  { min: 51, max: 75,  key: "eleve",    label: "Risque élevé",     color: "#CC0000", bg: "#FFF0F0", border: "#FFD0D0",
    headline: "Votre établissement est exposé.", sub: "Votre score est inférieur à 70% des établissements que nous analysons. Un contrôle DGCCRF aujourd'hui se traduirait par une amende." },
  { min: 76, max: 100, key: "critique", label: "Risque critique",  color: "#7B0000", bg: "#FFF0F0", border: "#FF9999",
    headline: "Action immédiate requise.", sub: "Profil parmi les plus exposés. Risque d'amende ET de fermeture administrative en cas de contrôle." },
];

// ── Questions — scoring croisé ────────────────────────────────────────────────
// Les scores sont intentionnellement déséquilibrés :
// "verbal" + "often" ensemble = catastrophe légale → multiplié dans le calcul final
const QUESTIONS = [
  {
    key: "type",
    label: "Quel type d'établissement gérez-vous ?",
    sub: "Le type d'établissement détermine la fréquence des contrôles DGCCRF.",
    options: [
      { label: "Boulangerie / café",     value: "bakery",      score: 10, desc: "Produits très allergènes (gluten, lait, œufs)" },
      { label: "Food truck",              value: "food_truck",  score: 15, desc: "Contrôles en hausse depuis 2022" },
      { label: "Restaurant",             value: "restaurant",  score: 20, desc: "Profil le plus inspecté" },
      { label: "Traiteur / événementiel", value: "catering",   score: 28, desc: "Clientèle diverse, risque maximal" },
    ],
  },
  {
    key: "dishes_count",
    label: "Combien de plats avez-vous exactement à votre carte ?",
    sub: "Chaque plat non conforme est une infraction indépendante à 1 500€.",
    type: "number",
    placeholder: "Ex : 24",
    options: [], // Saisie numérique — traitée séparément
  },
  {
    key: "updates",
    label: "À quelle fréquence changez-vous votre carte ?",
    sub: "Chaque modification non tracée est une source d'infraction potentielle.",
    options: [
      { label: "Stable (1×/an)",          value: "rare",     score: 5 },
      { label: "Saisonnière",             value: "sometimes", score: 12 },
      { label: "Plat du jour",            value: "often",    score: 28, desc: "Risque élevé sans solution numérique" },
    ],
  },
  {
    key: "format",
    label: "Comment déclarez-vous vos allergènes aujourd'hui ?",
    sub: "La mention verbale d'un serveur est illégale depuis 2014. Un document écrit est exigé.",
    options: [
      { label: "Solution numérique / QR", value: "digital", score: 0,  desc: "Conforme — mise à jour en temps réel" },
      { label: "PDF imprimé",             value: "pdf",     score: 18, desc: "Risque si pas remis à jour" },
      { label: "Classeur papier",         value: "paper",   score: 28, desc: "Difficile à maintenir à jour" },
      { label: "Le serveur l'annonce",    value: "verbal",  score: 45, desc: "Infraction en soi depuis 2014" },
    ],
  },
  {
    key: "controls",
    label: "Avez-vous déjà eu un contrôle DGCCRF ?",
    sub: "Les établissements ayant reçu un avertissement sont revisités en priorité.",
    options: [
      { label: "Jamais",                  value: "never",   score: 8 },
      { label: "Oui, sans problème",      value: "ok",      score: 5 },
      { label: "Oui, avec avertissement", value: "warning", score: 22, desc: "Récidive = sanctions aggravées" },
    ],
  },
  {
    key: "team",
    label: "Combien de personnes travaillent dans votre établissement ?",
    sub: "Plus l'équipe est grande, plus le risque de dérive informelle est élevé.",
    options: [
      { label: "Seul(e)",          value: "solo",   score: 5 },
      { label: "2 à 5 personnes",  value: "small",  score: 10 },
      { label: "6 à 15 personnes", value: "medium", score: 18 },
      { label: "Plus de 15",       value: "large",  score: 25 },
    ],
  },
];

// ── Actions personnalisées selon le profil ────────────────────────────────────
function getActions(riskKey, formData) {
  const base = {
    faible: [
      { title: "Vérifiez la complétude", desc: "Assurez-vous que chaque plat — y compris les suggestions du jour — a ses allergènes déclarés par écrit." },
      { title: "Accessibilité client", desc: "Le document doit être visible sans que le client n'ait à le demander explicitement." },
      { title: "Anticipez les mises à jour", desc: "Tout changement d'ingrédient ou de fournisseur impose une mise à jour immédiate." },
    ],
    modere: [
      { title: "Formalisez par écrit immédiatement", desc: "Un document écrit par plat est exigé par la loi — la mémoire verbale ne suffit plus depuis 2014." },
      { title: "Remplacez vos supports statiques", desc: "Un PDF imprimé ne se met pas à jour seul. Chaque modification de recette crée un risque légal." },
      { title: "Préparez-vous au prochain contrôle", desc: "Les établissements avec des lacunes modérées sont souvent ciblés lors des inspections de routine." },
    ],
    eleve: [
      { title: "Formalisez immédiatement", desc: "Un contrôle DGCCRF aujourd'hui se traduirait par une amende. Documentez vos 14 allergènes par plat, par écrit, cette semaine.", urgent: true },
      { title: "Cessez la déclaration orale", desc: "La mention verbale est une infraction en soi depuis 2014. Elle n'a aucune valeur légale.", urgent: true },
      { title: "Mettez à jour tous vos supports", desc: "Chaque document obsolète est une infraction supplémentaire lors d'un contrôle." },
      { title: "Formez vos équipes", desc: "Vos serveurs doivent savoir où trouver les informations sur les allergènes." },
    ],
    critique: [
      { title: "Agissez dans les 48h", desc: "Risque d'amende ET de fermeture administrative. Ne repoussez pas.", urgent: true },
      { title: "Documentez 100% de vos plats", desc: "Chaque plat sans déclaration écrite est une infraction indépendante à 1 500€.", urgent: true },
      { title: "Remplacez vos processus manuels", desc: "Un classeur papier ou fichier Excel n'offre aucune traçabilité ni protection juridique.", urgent: true },
      { title: "Formez vos équipes en urgence", desc: "Les agents DGCCRF vérifient aussi que les serveurs savent où trouver les informations." },
      { title: "Adoptez une solution numérique", desc: "C'est le seul moyen de garantir des déclarations toujours à jour et accessibles." },
    ],
  };

  const actions = [...base[riskKey]];

  // Personnalisation croisée
  if (formData.format === "verbal" && riskKey !== "faible") {
    // Déjà couvert dans "eleve" et "critique" — on évite le doublon
  }
  if (formData.updates === "often" && formData.format !== "digital") {
    actions.push({ title: "Solution urgente pour le plat du jour", desc: "Vous changez votre carte quotidiennement : sans outil numérique, vous êtes en infraction à chaque service." });
  }
  if (formData.controls === "warning") {
    actions.unshift({ title: "Récidive à éviter absolument", desc: "Vous avez déjà reçu un avertissement. Une récidive entraîne des sanctions aggravées et une possible publication sur Alim'Confiance.", urgent: true });
  }
  if (formData.team === "large" || formData.team === "medium") {
    actions.push({ title: "Formation d'équipe prioritaire", desc: "Avec une équipe de cette taille, un protocole écrit et une formation régulière sont indispensables." });
  }

  return actions.slice(0, 5);
}

// ── Composants UI ─────────────────────────────────────────────────────────────

function GaugeBar({ score, color }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(score), 200); return () => clearTimeout(t); }, [score]);
  const segments = [
    { c: "#4ADE80", label: "OK" },
    { c: "#FBBF24", label: "Modéré" },
    { c: "#EF4444", label: "Élevé" },
    { c: "#991B1B", label: "Critique" },
  ];
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", gap: 3, marginBottom: 10 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ flex: 1, background: s.c, borderRadius: 3, opacity: animated > i * 25 ? 1 : 0.15, transition: "opacity 0.8s ease" }} />
        ))}
      </div>
      <div style={{ position: "relative", height: 20 }}>
        <div style={{ position: "absolute", left: `${animated}%`, transform: "translateX(-50%)", transition: "left 1.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: color, border: "3px solid white", boxShadow: `0 0 0 3px ${color}55, 0 2px 8px rgba(0,0,0,0.15)` }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {segments.map((s, i) => <span key={i} style={{ fontSize: 10, color: "#CCC", fontWeight: 500 }}>{s.label}</span>)}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LoiIncoPage() {
  const router = useRouter();
  const { isMobile } = useWindowSize();

  const [step, setStep]               = useState("quiz");
  const [formData, setFormData]       = useState({});
  const [dishesCount, setDishesCount] = useState("");
  const [currentQ, setCurrentQ]       = useState(0);
  const [score, setScore]             = useState(0);
  const [email, setEmail]             = useState("");
  const [emailSent, setEmailSent]     = useState(false);
  const [sendingReport, setSendingReport] = useState(false);

  const simulRef = useRef(null);
  const resultRef = useRef(null);

  const currentQuestion = QUESTIONS[currentQ];
  const isNumberQuestion = currentQuestion?.type === "number";
  const currentAnswered = isNumberQuestion
    ? dishesCount.trim() !== "" && !isNaN(Number(dishesCount)) && Number(dishesCount) > 0
    : formData[currentQuestion?.key] !== undefined;
  const allAnswered = QUESTIONS.every(q =>
    q.type === "number" ? (dishesCount.trim() !== "" && Number(dishesCount) > 0) : formData[q.key] !== undefined
  );

  // ── Scoring croisé ────────────────────────────────────────────────────────
  function computeScore() {
    let total = 0;
    let multiplier = 1;

    QUESTIONS.forEach(q => {
      if (q.type === "number") {
        // Plus de plats = plus de risque, mais logarithmique
        const n = Math.max(1, Number(dishesCount) || 10);
        total += Math.min(30, Math.round(Math.log(n) * 5));
        return;
      }
      const opt = q.options.find(o => o.value === formData[q.key]);
      if (opt) total += opt.score;
    });

    // Croisements qui amplifient le risque
    if (formData.format === "verbal" && formData.updates === "often") multiplier *= 1.25;
    if (formData.format === "verbal" || formData.format === "paper") {
      if (formData.controls === "warning") multiplier *= 1.15;
    }
    if (formData.team === "large" && formData.format !== "digital") multiplier *= 1.1;

    const maxBase = QUESTIONS.reduce((acc, q) => {
      if (q.type === "number") return acc + 30;
      return acc + Math.max(...q.options.map(o => o.score));
    }, 0);

    return Math.min(100, Math.round((total * multiplier / maxBase) * 100));
  }

  function handleCalculate() {
    const s = computeScore();
    setScore(s);
    setStep("result");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }

  function selectOption(key, value) {
    setFormData(f => ({ ...f, [key]: value }));
    if (currentQ < QUESTIONS.length - 1) setTimeout(() => setCurrentQ(q => q + 1), 260);
  }

  async function handleSendReport() {
    if (!email.includes("@")) return;
    setSendingReport(true);
    try {
      await fetch("/api/send-simulator-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, score, formData: { ...formData, dishes_count: dishesCount } }),
      });
      setEmailSent(true);
    } catch {}
    setSendingReport(false);
  }

  function reset() {
    setStep("quiz"); setFormData({}); setDishesCount(""); setScore(0);
    setEmail(""); setEmailSent(false); setCurrentQ(0);
  }

  const risk = RISK_LEVELS.find(r => score >= r.min && score <= r.max) || RISK_LEVELS[0];
  const dishCount = Math.max(1, Number(dishesCount) || 10);
  // Exposition totale = nb plats non conformes estimés × 1500€
  // On estime que 60-100% des plats sont non conformes selon le format
  const nonConfRate = { digital: 0, pdf: 0.3, paper: 0.6, verbal: 1 }[formData.format] ?? 0.7;
  const expositionMax = Math.round(dishCount * nonConfRate) * 1500;
  const actions = getActions(risk.key, formData);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "white", color: "#1A1A1A" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ background: "#0F0F0F", padding: isMobile ? "56px 20px 48px" : "80px 20px 72px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#4ADE80", marginBottom: 24, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Règlement UE n°1169/2011 · En vigueur depuis 2014
          </div>
          <h1 style={{ fontSize: isMobile ? 28 : 44, fontWeight: 800, color: "white", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            Vos allergènes sont-ils<br />vraiment déclarés correctement ?
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 18, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            75% des restaurants français ne respectent pas la loi INCO. En 6 questions, découvrez si vous en faites partie — et ce que ça risque de vous coûter.
          </p>
          <button onClick={() => simulRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{ fontSize: 15, fontWeight: 700, padding: "14px 32px", background: "white", color: "#1A1A1A", border: "none", borderRadius: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
            Tester ma conformité gratuitement <ArrowRight size={16} />
          </button>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 10 }}>2 minutes · Résultat immédiat · Sans inscription</p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: "#F7F7F5", padding: isMobile ? "32px 20px" : "48px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12 }}>
          {[
            { n: "1 500€", l: "Amende par infraction",  sub: "Montant légal fixe INCO",            color: "#CC0000" },
            { n: "75%",    l: "Des restos exposés",      sub: "Sans le savoir (DGCCRF 2023)",        color: "#856404" },
            { n: "2014",   l: "Obligation légale",        sub: "Toujours en vigueur — ignorée",      color: "#1A1A1A" },
            { n: "14",     l: "Allergènes à déclarer",   sub: "Par plat, par écrit, sans exception", color: "#1A1A1A" },
          ].map((st, i) => (
            <div key={i} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 14, padding: isMobile ? "16px" : "20px", textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: st.color, letterSpacing: "-0.02em", lineHeight: 1 }}>{st.n}</div>
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
          <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 36px", letterSpacing: "-0.02em" }}>
            3 obligations que peu de restaurants respectent
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                num: "01", title: "Déclarer par écrit",
                desc: "La mention orale d'un serveur ne suffit plus depuis 2014. Un document écrit accessible au client avant la commande est exigé.",
                ok: "Menu, ardoise, QR code, classeur à disposition",
                bad: "La mémoire de votre équipe",
              },
              {
                num: "02", title: "Couvrir les 14 allergènes",
                desc: "Pour chaque plat, vous devez identifier les 14 allergènes officiels — y compris dans les sauces, marinades et accompagnements.",
                ok: "Déclaration exhaustive par plat",
                bad: "Une liste générale vague",
              },
              {
                num: "03", title: "Maintenir à jour",
                desc: "Chaque modification d'une recette ou d'un fournisseur impose une mise à jour immédiate. Un document périmé compte comme une infraction.",
                ok: "Mise à jour à chaque changement",
                bad: "La carte de la saison dernière",
              },
            ].map((c, i) => (
              <div key={i} style={{ background: "#F7F7F5", borderRadius: 16, padding: "24px", border: "1px solid #EBEBEB" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: "#E8E8E8", marginBottom: 12, lineHeight: 1 }}>{c.num}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 10 }}>{c.title}</div>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: "0 0 14px" }}>{c.desc}</p>
                <div style={{ fontSize: 12, color: "#155724", fontWeight: 600, display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 6 }}>
                  <CheckCircle size={13} color="#4ADE80" style={{ flexShrink: 0, marginTop: 1 }} /> {c.ok}
                </div>
                <div style={{ fontSize: 12, color: "#CC0000", fontWeight: 600, display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <span style={{ fontSize: 13, flexShrink: 0 }}>✗</span> {c.bad}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RASSURANCE — La solution est simple ── */}
      <section style={{ background: "#F7F7F5", padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>La bonne nouvelle</p>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Se conformer prend moins de temps<br />qu'une mise en place du soir
          </h2>
          <p style={{ fontSize: 15, color: "#666", textAlign: "center", margin: "0 auto 40px", lineHeight: 1.7, maxWidth: 540 }}>
            Les restaurateurs qui rejoignent MenuSafe ont leur première carte conforme en 8 minutes en moyenne. Pas 3 semaines — 8 minutes.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
            {[
              { time: "2 min", label: "Créer votre compte" },
              { time: "5 min", label: "Photographier votre carte" },
              { time: "< 1 min", label: "Valider les plats" },
              { time: "0 min", label: "Carte à jour en continu" },
            ].map((s, i) => (
              <div key={i} style={{ background: "white", borderRadius: 14, padding: "16px", border: "1px solid #EBEBEB", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#4ADE80", marginBottom: 6 }}>{s.time}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#555", lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => simulRef.current?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontSize: 14, fontWeight: 700, padding: "12px 28px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>
              Tester ma conformité →
            </button>
          </div>
        </div>
      </section>

      {/* ── LES 14 ALLERGÈNES ── */}
      <section style={{ padding: isMobile ? "48px 20px" : "64px 20px", background: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>Liste officielle</p>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Les 14 allergènes à déclarer
          </h2>
          <p style={{ fontSize: 13, color: "#AAA", textAlign: "center", margin: "0 0 28px" }}>Annexe II — Règlement UE n°1169/2011</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(190px, 1fr))", gap: 8 }}>
            {ALLERGENS.map((a) => (
              <div key={a.id} style={{ background: "#F7F7F5", border: "1px solid #EBEBEB", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <AllergenIcon id={a.id} size={17} color={a.text} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
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

      {/* ── SIMULATEUR ── */}
      <section ref={simulRef} style={{ background: "#F7F7F5", padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>Outil gratuit</p>
          <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Quel est votre niveau de risque ?
          </h2>
          <p style={{ fontSize: 14, color: "#888", textAlign: "center", margin: "0 0 28px" }}>6 questions · Score personnalisé · Rapport détaillé par email</p>

          <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

            {step === "quiz" && (
              <div>
                {/* Progress */}
                <div style={{ padding: "16px 24px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#888" }}>
                      Question {currentQ + 1} / {QUESTIONS.length}
                    </span>
                    <span style={{ fontSize: 12, color: "#BBB" }}>
                      {Object.keys(formData).length + (dishesCount ? 1 : 0)}/{QUESTIONS.length} répondues
                    </span>
                  </div>
                  <div style={{ background: "#F0F0F0", borderRadius: 4, height: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "#1A1A1A", borderRadius: 4, transition: "width 0.3s ease",
                      width: `${((Object.keys(formData).length + (dishesCount ? 1 : 0)) / QUESTIONS.length) * 100}%` }} />
                  </div>
                </div>

                {/* Questions */}
                <div style={{ padding: "24px 24px 8px" }}>
                  {QUESTIONS.map((q, qi) => {
                    const isActive = qi === currentQ;
                    const isDone = q.type === "number"
                      ? (dishesCount.trim() !== "" && Number(dishesCount) > 0)
                      : formData[q.key] !== undefined;

                    return (
                      <div key={q.key} style={{ marginBottom: 28, opacity: isActive ? 1 : qi < currentQ ? 0.45 : 0.35, transition: "opacity 0.25s", pointerEvents: isActive ? "auto" : qi < currentQ ? "auto" : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: "-0.01em", flex: 1 }}>
                            {qi + 1}. {q.label}
                          </p>
                          {isDone && <CheckCircle size={16} color="#4ADE80" style={{ flexShrink: 0 }} />}
                        </div>
                        {isActive && <p style={{ fontSize: 12, color: "#AAA", margin: "0 0 12px", fontStyle: "italic" }}>{q.sub}</p>}

                        {q.type === "number" ? (
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <input
                              type="number" min="1" max="500"
                              value={dishesCount}
                              onChange={e => setDishesCount(e.target.value)}
                              placeholder={q.placeholder}
                              style={{ width: 120, padding: "10px 14px", fontSize: 16, fontWeight: 700, border: "2px solid #E0E0E0", borderRadius: 10, outline: "none", fontFamily: "inherit", textAlign: "center" }}
                              onFocus={e => e.target.style.borderColor = "#1A1A1A"}
                              onBlur={e => e.target.style.borderColor = "#E0E0E0"}
                            />
                            <span style={{ fontSize: 13, color: "#888" }}>plats à votre carte</span>
                            {dishesCount && Number(dishesCount) > 0 && (
                              <span style={{ fontSize: 12, color: "#CC0000", fontWeight: 600 }}>
                                = {Number(dishesCount) * 1500 >= 10000
                                  ? `jusqu'à ${(Number(dishesCount) * 1500).toLocaleString("fr-FR")}€ d'exposition max`
                                  : `${Number(dishesCount)} × 1 500€ possibles`}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {q.options.map(opt => {
                              const selected = formData[q.key] === opt.value;
                              return (
                                <button key={opt.value} onClick={() => selectOption(q.key, opt.value)}
                                  style={{ padding: "9px 14px", borderRadius: 10, fontSize: 13,
                                    fontWeight: selected ? 700 : 500, cursor: "pointer", transition: "all 0.15s",
                                    border: selected ? "2px solid #1A1A1A" : "1.5px solid #E8E8E8",
                                    background: selected ? "#1A1A1A" : "white",
                                    color: selected ? "white" : "#555",
                                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1,
                                    transform: selected ? "scale(1.02)" : "scale(1)" }}>
                                  <span>{opt.label}</span>
                                  {opt.desc && <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.6, marginTop: 1 }}>{opt.desc}</span>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
                  {currentQ > 0 && (
                    <button onClick={() => setCurrentQ(q => q - 1)}
                      style={{ padding: "10px 16px", fontSize: 13, background: "white", color: "#888", border: "1px solid #E0E0E0", borderRadius: 10, cursor: "pointer" }}>
                      ← Précédent
                    </button>
                  )}
                  {currentQ < QUESTIONS.length - 1 ? (
                    <button onClick={() => setCurrentQ(q => q + 1)} disabled={!currentAnswered}
                      style={{ flex: 1, padding: "11px", background: currentAnswered ? "#F7F7F5" : "#F0F0F0",
                        color: currentAnswered ? "#555" : "#BBB", border: "1px solid #E0E0E0",
                        borderRadius: 10, fontWeight: 600, fontSize: 13,
                        cursor: currentAnswered ? "pointer" : "not-allowed" }}>
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
                {/* Score hero */}
                <div style={{ background: risk.bg, borderBottom: `3px solid ${risk.border}`, padding: isMobile ? "28px 20px" : "36px 32px", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: risk.color, color: "white", borderRadius: 100, padding: "6px 18px", marginBottom: 20, fontWeight: 700, fontSize: 13 }}>
                    {risk.label}
                  </div>
                  <div style={{ fontSize: isMobile ? 72 : 88, fontWeight: 800, color: risk.color, lineHeight: 0.9, marginBottom: 6, letterSpacing: "-0.04em" }}>
                    {score}<span style={{ fontSize: 28, fontWeight: 600, color: risk.color + "99" }}>/100</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: risk.color, margin: "12px 0 4px" }}>{risk.headline}</p>
                  <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px", lineHeight: 1.5 }}>{risk.sub}</p>
                  <GaugeBar score={score} color={risk.color} />

                  {/* Exposition totale si plats connus */}
                  {expositionMax > 0 && formData.format !== "digital" && (
                    <div style={{ background: "white", borderRadius: 14, padding: "20px", marginTop: 12, border: `1px solid ${risk.border}` }}>
                      <div style={{ fontSize: 11, color: "#888", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                        Exposition totale estimée pour votre carte
                      </div>
                      <div style={{ fontSize: isMobile ? 36 : 48, fontWeight: 800, color: "#CC0000", letterSpacing: "-0.02em", lineHeight: 1 }}>
                        {expositionMax.toLocaleString("fr-FR")}€
                      </div>
                      <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
                        {Math.round(dishCount * nonConfRate)} plats estimés non conformes × 1 500€ par infraction
                      </div>
                      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
                        {[
                          `${Math.round(expositionMax / 59)} mois d'abonnement Pro`,
                          `${Math.round(expositionMax / 11.65)} h au SMIC`,
                          `${Math.round(expositionMax / 18)} repas`,
                        ].map((e, i) => (
                          <span key={i} style={{ fontSize: 12, color: "#856404", fontWeight: 600 }}>≈ {e}</span>
                        ))}
                      </div>
                      <div style={{ fontSize: 10, color: "#CCC", marginTop: 10, lineHeight: 1.5 }}>
                        Montant théorique basé sur l'amende maximale de 5ème classe (Art. R451-1 du Code de la Consommation) par infraction constatée.
                      </div>
                    </div>
                  )}

                  {/* Comparatif social proof */}
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Users size={13} color="#AAA" />
                    <span style={{ fontSize: 12, color: "#AAA" }}>
                      {score <= 25
                        ? "Vous faites partie des 25% les mieux préparés"
                        : score <= 50
                        ? "Score supérieur à 40% des établissements analysés"
                        : score <= 75
                        ? "Score inférieur à 70% des établissements analysés"
                        : "Parmi les profils les plus exposés que nous analysons"}
                    </span>
                  </div>
                </div>

                <div style={{ padding: isMobile ? "20px" : "28px 32px" }}>
                  {/* Actions */}
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px" }}>
                    {actions.length} actions prioritaires pour votre profil
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {actions.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: a.urgent ? risk.bg : "#F7F7F5", borderRadius: 10, border: a.urgent ? `1px solid ${risk.border}` : "none" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: a.urgent ? risk.color : "#E0E0E0", color: a.urgent ? "white" : "#888", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
                          {i + 1}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: a.urgent ? risk.color : "#1A1A1A", margin: "0 0 3px" }}>{a.title}</p>
                          <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.5 }}>{a.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Email capture */}
                  {!emailSent ? (
                    <div style={{ background: "#0F0F0F", borderRadius: 14, padding: "22px", marginBottom: 14 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: "white", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                        Recevez votre rapport complet par email
                      </p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "0 0 14px", lineHeight: 1.5 }}>
                        Score détaillé · Plan d'action personnalisé · Checklist de mise en conformité à imprimer
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="votre@restaurant.fr"
                          onKeyDown={e => e.key === "Enter" && handleSendReport()}
                          style={{ flex: 1, padding: "10px 14px", fontSize: 13, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 9, outline: "none", fontFamily: "inherit", background: "rgba(255,255,255,0.08)", color: "white" }} />
                        <button onClick={handleSendReport} disabled={sendingReport || !email.includes("@")}
                          style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, background: email.includes("@") ? "white" : "rgba(255,255,255,0.15)", color: email.includes("@") ? "#1A1A1A" : "rgba(255,255,255,0.3)", border: "none", borderRadius: 9, cursor: email.includes("@") ? "pointer" : "not-allowed", whiteSpace: "nowrap", transition: "all 0.15s" }}>
                          {sendingReport ? "Envoi..." : "Recevoir →"}
                        </button>
                      </div>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: "8px 0 0" }}>Pas de spam · Rapport unique · Désabonnement en 1 clic</p>
                    </div>
                  ) : (
                    <div style={{ background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 12, padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                      <ShieldCheck size={18} color="#155724" />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#155724", margin: 0 }}>Rapport envoyé à {email}</p>
                        <p style={{ fontSize: 11, color: "#276749", margin: 0 }}>Vérifiez votre boîte mail — pensez aux spams.</p>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <button onClick={() => router.push("/auth")}
                    style={{ width: "100%", padding: "14px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    Générer ma première carte conforme <ArrowRight size={16} />
                  </button>
                  <p style={{ textAlign: "center", fontSize: 12, color: "#BBB", margin: "0 0 14px" }}>
                    Gratuit 7 jours · Prêt en 8 minutes · Sans carte bancaire
                  </p>
                  <button onClick={reset}
                    style={{ background: "none", border: "none", color: "#CCC", fontSize: 12, cursor: "pointer", textDecoration: "underline", width: "100%", textAlign: "center" }}>
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
            Votre carte conforme vous attend
          </h2>
          <p style={{ fontSize: isMobile ? 14 : 16, color: "rgba(255,255,255,0.5)", margin: "0 0 28px", lineHeight: 1.7 }}>
            Rejoignez les restaurateurs qui ont réglé leur conformité allergènes une bonne fois pour toutes.
          </p>
          <button onClick={() => router.push("/auth")}
            style={{ fontSize: 15, fontWeight: 700, padding: "14px 36px", background: "white", color: "#1A1A1A", border: "none", borderRadius: 12, cursor: "pointer" }}>
            Créer ma carte gratuitement →
          </button>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 12 }}>Sans frais pendant 7 jours · Annulation en 1 clic</p>
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