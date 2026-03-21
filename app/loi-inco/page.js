"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/lib/useWindowSize";
import { AllergenIcon, ALLERGENS } from "@/lib/allergens-db";
import { AlertTriangle, ShieldCheck, Clock } from "lucide-react";
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

const TIMELINE = [
  { year: "2011", title: "Règlement UE n°1169/2011", desc: "Publication du règlement européen INCO imposant la déclaration des 14 allergènes majeurs." },
  { year: "2014", title: "Entrée en vigueur en France", desc: "Obligation légale pour tous les établissements de restauration commerciale de déclarer par écrit les allergènes." },
  { year: "2015", title: "Contrôles DGCCRF débutent", desc: "La DGCCRF lance des inspections systématiques dans les établissements de restauration." },
  { year: "2026", title: "Durcissement des sanctions", desc: "Les amendes atteignent 1 500€ par infraction. Publication sur Alim'Confiance indexée par Google." },
];

const RISK_LEVELS = [
  { min: 0,  max: 25,  label: "Risque faible",   color: "#155724", bg: "#F0FFF4", border: "#C6F6D5" },
  { min: 26, max: 50,  label: "Risque modéré",   color: "#856404", bg: "#FFFBEB", border: "#FDE68A" },
  { min: 51, max: 75,  label: "Risque élevé",    color: "#CC0000", bg: "#FFF0F0", border: "#FFD0D0" },
  { min: 76, max: 100, label: "Risque critique", color: "#7B0000", bg: "#FFF0F0", border: "#FF9999" },
];

const questions = [
  { key: "type", label: "Quel type d'établissement ?", options: [
    { label: "Food truck", value: "food_truck", score: 15 },
    { label: "Boulangerie / café", value: "bakery", score: 10 },
    { label: "Restaurant", value: "restaurant", score: 20 },
    { label: "Traiteur / événementiel", value: "catering", score: 25 },
  ]},
  { key: "dishes", label: "Combien de plats à votre carte ?", options: [
    { label: "Moins de 10", value: "few", score: 5 },
    { label: "10 à 30", value: "medium", score: 10 },
    { label: "Plus de 30", value: "many", score: 20 },
  ]},
  { key: "updates", label: "À quelle fréquence changez-vous votre carte ?", options: [
    { label: "Rarement (1x/an)", value: "rare", score: 5 },
    { label: "Occasionnellement", value: "sometimes", score: 15 },
    { label: "Souvent (plat du jour)", value: "often", score: 25 },
  ]},
  { key: "format", label: "Comment déclarez-vous actuellement vos allergènes ?", options: [
    { label: "Classeur / fiche papier", value: "paper", score: 25 },
    { label: "PDF imprimé", value: "pdf", score: 20 },
    { label: "Verbal uniquement", value: "verbal", score: 40 },
    { label: "Solution numérique", value: "digital", score: 0 },
  ]},
  { key: "controls", label: "Avez-vous déjà eu un contrôle DGCCRF ?", options: [
    { label: "Jamais", value: "never", score: 10 },
    { label: "Oui, sans problème", value: "ok", score: 5 },
    { label: "Oui, avec avertissement", value: "warning", score: 20 },
  ]},
];

function GaugeBar({ score, color }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(score), 150); return () => clearTimeout(t); }, [score]);
  const segments = [{ color: "#4ADE80" }, { color: "#FBBF24" }, { color: "#EF4444" }, { color: "#991B1B" }];
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", marginBottom: 6, gap: 2 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ flex: 1, background: s.color, opacity: animated > i * 25 ? 1 : 0.15, transition: "opacity 0.8s ease", borderRadius: 3 }} />
        ))}
      </div>
      <div style={{ position: "relative", height: 16 }}>
        <div style={{ position: "absolute", left: `${animated}%`, transform: "translateX(-50%)", transition: "left 1s cubic-bezier(0.34,1.56,0.64,1)" }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: color, border: "2px solid white", boxShadow: `0 0 0 2px ${color}44` }} />
        </div>
      </div>
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
  const resultRef = useRef(null);

  const allAnswered = questions.every(q => formData[q.key] !== undefined);

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

  function handleCalculate() {
    let total = 0;
    questions.forEach(q => {
      const opt = q.options.find(o => o.value === formData[q.key]);
      if (opt) total += opt.score;
    });
    const maxScore = questions.reduce((acc, q) => acc + Math.max(...q.options.map(o => o.score)), 0);
    setScore(Math.round((total / maxScore) * 100));
    setStep("result");
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  const risk = RISK_LEVELS.find(r => score >= r.min && score <= r.max) || RISK_LEVELS[0];
  const amendeEstimee = score > 50 ? Math.round((score / 100) * 4500 / 500) * 500 : 0;

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "white", color: "#1A1A1A" }}>

      <Navbar />

      {/* Hero */}
      <section style={{ background: "#0F0F0F", padding: isMobile ? "56px 20px" : "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 12, color: "#4ADE80", marginBottom: 24, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Règlement UE n°1169/2011
          </div>
          <h1 style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, color: "white", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            La loi INCO expliquée aux restaurateurs
          </h1>
          <p style={{ fontSize: isMobile ? 15 : 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
            Ce que vous devez vraiment faire, les sanctions réelles, et comment vous conformer en 5 minutes.
          </p>
        </div>
      </section>

      {/* Chiffres clés */}
      <section style={{ background: "#F7F7F5", padding: isMobile ? "40px 20px" : "56px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 16 }}>
          {[
            { n: "1 500€", l: "Amende par infraction", color: "#CC0000" },
            { n: "75%", l: "Des restaurants non conformes", color: "#856404" },
            { n: "2014", l: "Entrée en vigueur en France", color: "#1A1A1A" },
            { n: "14", l: "Allergènes à déclarer", color: "#1A1A1A" },
          ].map((st, i) => (
            <div key={i} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 14, padding: "20px", textAlign: "center" }}>
              <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: st.color, letterSpacing: "-0.02em" }}>{st.n}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4, lineHeight: 1.4 }}>{st.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>Historique</p>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 40px", letterSpacing: "-0.02em" }}>
            Comment la loi INCO s'est imposée
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 24, paddingBottom: i < TIMELINE.length - 1 ? 32 : 0 }}>
                {/* Colonne gauche : année + ligne */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 56 }}>
                  <div style={{ background: "#1A1A1A", borderRadius: 10, padding: "6px 10px", textAlign: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "white", letterSpacing: "-0.01em" }}>{item.year}</span>
                  </div>
                  {i < TIMELINE.length - 1 && <div style={{ width: 2, flex: 1, background: "#EBEBEB", marginTop: 8 }} />}
                </div>
                {/* Colonne droite : contenu */}
                <div style={{ paddingTop: 4, paddingBottom: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: "#666", lineHeight: 1.65 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Les 14 allergènes */}
      <section style={{ background: "#F7F7F5", padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>Liste officielle</p>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Les 14 allergènes à déclarer obligatoirement
          </h2>
          <p style={{ fontSize: 14, color: "#888", textAlign: "center", margin: "0 0 32px" }}>
            Définis par l'annexe II du règlement UE n°1169/2011
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {ALLERGENS.map((a, i) => (
              <div key={a.id} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: a.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <AllergenIcon id={a.id} size={18} color={a.text} />
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

      {/* Simulateur de risque */}
      <section style={{ padding: isMobile ? "48px 20px" : "72px 20px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>Outil gratuit</p>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "#1A1A1A", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Évaluez votre niveau de risque INCO
          </h2>
          <p style={{ fontSize: 14, color: "#888", textAlign: "center", margin: "0 0 32px" }}>5 questions · Résultat immédiat</p>

          <div style={{ background: "#F7F7F5", border: "1px solid #EBEBEB", borderRadius: 20, padding: isMobile ? 20 : 32 }}>
            {step === "quiz" && (
              <div>
                {questions.map((q, qi) => (
                  <div key={q.key} style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 10px" }}>
                      {qi + 1}. {q.label}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {q.options.map(opt => (
                        <button key={opt.value} onClick={() => setFormData(f => ({ ...f, [q.key]: opt.value }))}
                          style={{ padding: "8px 14px", borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                            border: formData[q.key] === opt.value ? "2px solid #1A1A1A" : "1px solid #E0E0E0",
                            background: formData[q.key] === opt.value ? "#1A1A1A" : "white",
                            color: formData[q.key] === opt.value ? "white" : "#444",
                          }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={handleCalculate} disabled={!allAnswered}
                  style={{ width: "100%", padding: "13px", background: allAnswered ? "#1A1A1A" : "#E0E0E0", color: allAnswered ? "white" : "#AAA", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: allAnswered ? "pointer" : "not-allowed" }}>
                  Calculer mon niveau de risque →
                </button>
              </div>
            )}

            {step === "result" && (
              <div ref={resultRef}>
                <div style={{ background: risk.bg, border: `2px solid ${risk.border}`, borderRadius: 16, padding: "28px", textAlign: "center", marginBottom: 20 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: risk.color, color: "white", borderRadius: 100, padding: "6px 16px", marginBottom: 16, fontWeight: 700, fontSize: 13 }}>
                    {risk.label}
                  </div>
                  <div style={{ fontSize: 72, fontWeight: 800, color: risk.color, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.03em" }}>
                    {score}<span style={{ fontSize: 28, fontWeight: 600 }}>/100</span>
                  </div>
                  <GaugeBar score={score} color={risk.color} />
                  {amendeEstimee > 0 && (
                    <div style={{ background: "white", borderRadius: 10, padding: "14px", marginTop: 12 }}>
                      <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>Exposition financière estimée</div>
                      <div style={{ fontSize: 32, fontWeight: 800, color: "#CC0000" }}>{amendeEstimee.toLocaleString("fr-FR")}€</div>
                      <div style={{ fontSize: 11, color: "#BBB" }}>en cas de contrôle DGCCRF aujourd'hui</div>
                    </div>
                  )}
                </div>
                {/* Email capture */}
                {!emailSent ? (
                  <div style={{ background: "#F7F7F5", border: "1px solid #EBEBEB", borderRadius: 14, padding: "20px", marginBottom: 16 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>Recevez votre rapport complet par email</p>
                    <p style={{ fontSize: 13, color: "#888", margin: "0 0 14px", lineHeight: 1.5 }}>Score détaillé + actions prioritaires personnalisées selon votre profil.</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="votre@restaurant.fr"
                        style={{ flex: 1, padding: "10px 14px", fontSize: 13, border: "1px solid #E0E0E0", borderRadius: 9, outline: "none", fontFamily: "inherit" }} />
                      <button onClick={handleSendReport} disabled={sendingReport || !email.includes("@")}
                        style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap", opacity: sendingReport ? 0.7 : 1 }}>
                        {sendingReport ? "Envoi..." : "Envoyer →"}
                      </button>
                    </div>
                    <p style={{ fontSize: 11, color: "#BBB", margin: "8px 0 0" }}>Pas de spam · Désabonnement en 1 clic</p>
                  </div>
                ) : (
                  <div style={{ background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 12, padding: "14px 16px", marginBottom: 16, textAlign: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#155724", margin: "0 0 3px" }}>Rapport envoyé !</p>
                    <p style={{ fontSize: 12, color: "#276749", margin: 0 }}>Vérifiez votre boîte mail — pensez aux spams.</p>
                  </div>
                )}
                <button onClick={() => router.push("/auth")} style={{ width: "100%", padding: "13px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10 }}>
                  Me mettre en conformité maintenant →
                </button>
                <p style={{ textAlign: "center", fontSize: 12, color: "#BBB", margin: "0 0 12px" }}>Sans frais pendant 7 jours</p>
                <button onClick={() => { setStep("quiz"); setFormData({}); setScore(0); setEmail(""); setEmailSent(false); }}
                  style={{ background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", textDecoration: "underline", width: "100%" }}>
                  Refaire le test
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0F0F0F", padding: isMobile ? "56px 20px" : "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Logo size={44} light />
          </div>
          <h2 style={{ fontSize: isMobile ? 24 : 30, fontWeight: 800, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Conformité INCO en 5 minutes
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 28px", lineHeight: 1.7 }}>
            MenuSafe gère vos 14 allergènes, génère vos PDF conformes et crée votre carte interactive multilingue.
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
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", margin: 0 }}>© 2026 MenuSafe · Règlement UE n°1169/2011</p>
        </div>
      </footer>
    </div>
  );
}