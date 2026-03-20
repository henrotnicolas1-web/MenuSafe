"use client";
import { useState } from "react";
import { useWindowSize } from "@/lib/useWindowSize";

const STEPS = [
  { num: "1", label: "Créer une recette" },
  { num: "2", label: "Import IA" },
  { num: "3", label: "QR Code" },
  { num: "4", label: "Vue client" },
];

const LANGS = ["🇫🇷","🇬🇧","🇪🇸","🇩🇪","🇯🇵"];
const LANG_KEYS = ["fr","en","es","de","ja"];
const TRANSLATIONS = {
  fr: { title:"Mes allergies", cat:"Plats", sole:"Sole meunière", magret:"Magret de canard", blanquette:"Blanquette de veau", is:"sole, beurre, farine, citron", im:"canard, miel, thym, orange", ib:"veau, crème, beurre, carottes" },
  en: { title:"My allergies", cat:"Main courses", sole:"Pan-fried sole", magret:"Duck breast", blanquette:"Veal blanquette", is:"sole, butter, flour, lemon", im:"duck, honey, thyme, orange", ib:"veal, cream, butter, carrots" },
  es: { title:"Mis alergias", cat:"Platos", sole:"Lenguado meunière", magret:"Magret de pato", blanquette:"Blanqueta de ternera", is:"lenguado, mantequilla, harina", im:"pato, miel, tomillo", ib:"ternera, nata, mantequilla" },
  de: { title:"Meine Allergien", cat:"Gerichte", sole:"Seezunge Müllerin", magret:"Entenbrust", blanquette:"Kalbsblanquette", is:"Seezunge, Butter, Mehl", im:"Ente, Honig, Thymian", ib:"Kalb, Sahne, Butter" },
  ja: { title:"アレルギー", cat:"メイン", sole:"ムニエール", magret:"鴨のマグレ", blanquette:"仔牛のブランケット", is:"舌平目、バター", im:"鴨、蜂蜜", ib:"仔牛、生クリーム" },
};

function PhoneMockup() {
  const [activeAllergs, setActiveAllergs] = useState(new Set());
  const [lang, setLang] = useState(0);
  const t = TRANSLATIONS[LANG_KEYS[lang]];

  function toggleAllerg(id) {
    setActiveAllergs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const soleBlocked = activeAllergs.has("gluten") || activeAllergs.has("poissons") || activeAllergs.has("lait");
  const blanqBlocked = activeAllergs.has("lait");

  return (
    <div style={{ background: "#1A1A1A", border: "2px solid rgba(255,255,255,0.1)", borderRadius: 20, width: 200, overflow: "hidden", margin: "0 auto", flexShrink: 0 }}>
      <div style={{ background: "#111", padding: "10px 14px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "white", margin: "0 0 5px" }}>Le Bistrot du Coin</p>
        <div style={{ display: "flex", gap: 4 }}>
          {LANGS.map((f, i) => (
            <button key={i} onClick={() => setLang(i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, opacity: i === lang ? 1 : 0.3, padding: 0 }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: 10 }}>
        <div style={{ background: "#0F0F0F", borderRadius: 8, padding: 8, marginBottom: 8 }}>
          <p style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 5 }}>{t.title}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {[["gluten","Gluten"],["lait","Lait"],["poissons","Poissons"]].map(([id, label]) => (
              <button key={id} onClick={() => toggleAllerg(id)}
                style={{ fontSize: 8, fontWeight: 600, padding: "2px 6px", borderRadius: 20, border: "1px solid", cursor: "pointer",
                  background: activeAllergs.has(id) ? "#FFF3CD" : "transparent",
                  color: activeAllergs.has(id) ? "#856404" : "rgba(255,255,255,0.3)",
                  borderColor: activeAllergs.has(id) ? "#F6D860" : "rgba(255,255,255,0.1)" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 4 }}>{t.cat}</p>
        {[
          { key: "sole", name: t.sole, ing: t.is, blocked: soleBlocked },
          { key: "magret", name: t.magret, ing: t.im, blocked: false },
          { key: "blanquette", name: t.blanquette, ing: t.ib, blocked: blanqBlocked },
        ].map((dish) => (
          <div key={dish.key} style={{ background: dish.blocked ? "#1A1A1A" : "#222", borderRadius: 7, padding: "6px 8px", marginBottom: 5, opacity: dish.blocked ? 0.45 : 1, transition: "all 0.3s" }}>
            {dish.blocked && <p style={{ fontSize: 7, color: "#856404", background: "#FFF3CD", padding: "1px 5px", borderRadius: 8, display: "inline-block", marginBottom: 2 }}>⚠️ Allergène</p>}
            <p style={{ fontSize: 10, fontWeight: 600, color: dish.blocked ? "#666" : "white", margin: 0 }}>{dish.name}</p>
            <p style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", margin: "2px 0 0" }}>{dish.ing}</p>
          </div>
        ))}
        <p style={{ fontSize: 7, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 6 }}>Propulsé par MenuSafe</p>
      </div>
    </div>
  );
}

export default function DemoSection() {
  const [step, setStep] = useState(0);
  const { isMobile } = useWindowSize();

  // Hauteur fixe identique pour toutes les étapes
  const SCREEN_HEIGHT = isMobile ? "auto" : 340;
  const MIN_HEIGHT = isMobile ? 320 : 340;

  return (
    <section style={{ background: "#0F0F0F", padding: isMobile ? "48px 16px" : "80px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 10 }}>
          Démonstration interactive
        </p>
        <h2 style={{ fontSize: isMobile ? 22 : 32, fontWeight: 800, color: "white", textAlign: "center", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          MenuSafe en 4 étapes
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", margin: "0 0 28px" }}>
          {isMobile ? "Appuyez sur une étape" : "Cliquez sur chaque étape pour voir comment ça fonctionne"}
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 20 }}>
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              flex: 1, padding: isMobile ? "10px 4px" : "12px 8px", background: "transparent", border: "none",
              borderBottom: step === i ? "2px solid #4ADE80" : "2px solid transparent",
              color: step === i ? "white" : "rgba(255,255,255,0.35)",
              cursor: "pointer", fontSize: isMobile ? 10 : 12, fontWeight: 600, transition: "all 0.2s",
            }}>
              <span style={{ display: "block", fontSize: isMobile ? 16 : 18, fontWeight: 800, marginBottom: 2 }}>{s.num}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Contenu — hauteur FIXE pour éviter les sauts */}
        <div style={{ background: "#1A1A1A", borderRadius: 14, padding: isMobile ? "16px" : "24px", minHeight: MIN_HEIGHT, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>

          {/* ── Étape 1 ── */}
          {step === 0 && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 24 }}>
              <div>
                <p style={sl.label}>Saisie d'une recette</p>
                <div style={{ background: "#222", borderRadius: 8, padding: 10, marginBottom: 8 }}>
                  <p style={sl.sublabel}>Nom du plat</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0 }}>Sole meunière</p>
                </div>
                <div style={{ background: "#2A2A2A", borderRadius: 7, overflow: "hidden", marginBottom: 8 }}>
                  {[["sole","🐟 Poissons",true],["sole meunière","🐟",false]].map(([name,badge,hl]) => (
                    <div key={name} style={{ padding: "6px 10px", fontSize: 11, background: hl ? "#333" : "transparent", color: hl ? "white" : "rgba(255,255,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between" }}>
                      <span>{name}</span><span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{badge}</span>
                    </div>
                  ))}
                </div>
                <p style={sl.sublabel}>Allergènes détectés</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {[["#FFF3CD","#856404","🌾 Gluten",true],["#D0E8FF","#084298","🐟 Poissons",true],["#D0E8FF","#084298","🥛 Lait",true]].map(([bg,color,label]) => (
                    <div key={label} style={{ background: bg, color, borderRadius: 6, padding: "4px 8px", fontSize: 10, fontWeight: 600 }}>{label}</div>
                  ))}
                </div>
              </div>
              {!isMobile && (
                <div>
                  <p style={sl.label}>Résultat immédiat</p>
                  {[["✓ Autocomplétion intelligente","900+ ingrédients en base"],["✓ Détection en cascade","pâtes fraîches → gluten + œufs"],["✓ Toutes catégories","Entrée, Plat, Dessert, Boisson"]].map(([title, sub], i) => (
                    <div key={i} style={{ background: "#1A2A1A", borderRadius: 8, padding: "10px 12px", marginBottom: 8 }}>
                      <p style={{ fontSize: 12, color: "#4ADE80", fontWeight: 600, margin: "0 0 2px" }}>{title}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>{sub}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Étape 2 ── */}
          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 24 }}>
              <div>
                <p style={sl.label}>Photo uploadée</p>
                <div style={{ background: "#222", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 10, padding: 16, textAlign: "center", marginBottom: 10 }}>
                  <p style={{ fontSize: 24, margin: "0 0 6px" }}>📸</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 6px" }}>maison-louvard-carte.jpg</p>
                  <p style={{ fontSize: 10, color: "#4ADE80", fontWeight: 600, margin: 0 }}>✓ 11 plats détectés</p>
                </div>
                <div style={{ display: "flex", gap: 8, background: "#1A2A1A", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ fontSize: 18, fontWeight: 800, color: "#4ADE80", margin: 0 }}>7</p>
                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", margin: 0 }}>lus depuis la carte</p>
                  </div>
                  <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p style={{ fontSize: 18, fontWeight: 800, color: "#C4A0FF", margin: 0 }}>4</p>
                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", margin: 0 }}>suggérés par l'IA</p>
                  </div>
                </div>
              </div>
              <div>
                <p style={sl.label}>Validation plat par plat</p>
                <div style={{ background: "#222", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ background: "#2A2A2A", padding: "6px 10px", fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase" }}>Plat 2 / 11</div>
                  <div style={{ padding: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "white" }}>Sole meunière</span>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 20, background: "#1B3A5C", color: "#7EC8FF" }}>📋 Carte</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <div style={{ flex: 2, padding: "6px", fontSize: 11, fontWeight: 700, background: "#4ADE80", color: "#0F0F0F", borderRadius: 6, textAlign: "center" }}>✓ Valider</div>
                      <div style={{ flex: 1, padding: "6px", fontSize: 11, color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, textAlign: "center" }}>Ignorer</div>
                    </div>
                  </div>
                  <div style={{ padding: "8px 10px", opacity: 0.5, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "white" }}>Blanquette de veau</span>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 20, background: "#2D1A4A", color: "#C4A0FF" }}>🧠 IA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Étape 3 ── */}
          {step === 2 && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "auto 1fr", gap: isMobile ? 16 : 28, alignItems: "start" }}>
              {/* QR Code SVG */}
              <div style={{ background: "white", borderRadius: 12, padding: 14, textAlign: "center", width: isMobile ? "100%" : "auto", maxWidth: isMobile ? 200 : "none", margin: isMobile ? "0 auto" : 0 }}>
                <svg width="110" height="110" viewBox="0 0 120 120" style={{ display: "block", margin: "0 auto 6px" }}>
                  <rect width="120" height="120" fill="white"/>
                  <rect x="8" y="8" width="40" height="40" rx="4" fill="#1A1A1A"/><rect x="14" y="14" width="28" height="28" rx="2" fill="white"/><rect x="20" y="20" width="16" height="16" rx="1" fill="#1A1A1A"/>
                  <rect x="72" y="8" width="40" height="40" rx="4" fill="#1A1A1A"/><rect x="78" y="14" width="28" height="28" rx="2" fill="white"/><rect x="84" y="20" width="16" height="16" rx="1" fill="#1A1A1A"/>
                  <rect x="8" y="72" width="40" height="40" rx="4" fill="#1A1A1A"/><rect x="14" y="78" width="28" height="28" rx="2" fill="white"/><rect x="20" y="84" width="16" height="16" rx="1" fill="#1A1A1A"/>
                  <rect x="56" y="56" width="8" height="8" fill="#1A1A1A"/><rect x="68" y="56" width="8" height="8" fill="#1A1A1A"/><rect x="80" y="56" width="8" height="8" fill="#1A1A1A"/>
                  <rect x="56" y="68" width="8" height="8" fill="#1A1A1A"/><rect x="80" y="68" width="8" height="8" fill="#1A1A1A"/>
                  <rect x="56" y="80" width="8" height="8" fill="#1A1A1A"/><rect x="68" y="80" width="8" height="8" fill="#1A1A1A"/><rect x="80" y="80" width="8" height="8" fill="#1A1A1A"/>
                  <rect x="104" y="56" width="8" height="8" fill="#1A1A1A"/><rect x="104" y="68" width="8" height="8" fill="#1A1A1A"/>
                </svg>
                <p style={{ fontSize: 9, color: "#888", margin: 0 }}>menusafe.app/menu/bistrot</p>
              </div>
              <div>
                <p style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: "white", margin: "0 0 10px" }}>Un QR code par établissement</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    ["🖨️", "Permanent — ne change jamais"],
                    ["🌍", "Page client en 8 langues"],
                    ["⚠️", "Filtrage allergènes en temps réel"],
                    ["📱", "Aucune app à télécharger"],
                  ].map(([icon, text], i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                      <p style={{ fontSize: isMobile ? 12 : 13, color: "rgba(255,255,255,0.65)", margin: 0 }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Étape 4 ── */}
          {step === 3 && (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "auto 1fr", gap: isMobile ? 16 : 28, alignItems: "start" }}>
              <PhoneMockup />
              <div>
                <p style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: "white", margin: "0 0 12px" }}>
                  {isMobile ? "Essayez ci-dessus !" : "Vue client interactive — essayez !"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Cliquez sur un allergène — les plats incompatibles se grisent",
                    "Changez de langue — traduction instantanée",
                    "Aucune app à télécharger",
                    "Mise à jour automatique",
                  ].map((text, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#4ADE80", fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <p style={{ fontSize: isMobile ? 12 : 13, color: "rgba(255,255,255,0.65)", margin: 0 }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 16 }}>
          {STEPS.map((_, i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              width: step === i ? 24 : 8, height: 8, borderRadius: step === i ? 4 : "50%",
              background: step === i ? "#4ADE80" : "rgba(255,255,255,0.2)",
              border: "none", cursor: "pointer", transition: "all 0.2s", padding: 0,
            }} />
          ))}
          <button onClick={() => setStep(Math.max(0, step - 1))} style={{ marginLeft: 10, background: "rgba(255,255,255,0.1)", border: "none", color: "white", fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 20, cursor: "pointer" }}>
            ← Préc.
          </button>
          <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} style={{ background: "#4ADE80", border: "none", color: "#0F0F0F", fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 20, cursor: "pointer" }}>
            {step === STEPS.length - 1 ? "Commencer →" : "Suivant →"}
          </button>
        </div>
      </div>
    </section>
  );
}

const sl = {
  label: { fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 },
  sublabel: { fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 4, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" },
};