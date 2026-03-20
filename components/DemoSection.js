"use client";
import { useState } from "react";

const STEPS = [
  { num: "1", label: "Créer une recette" },
  { num: "2", label: "Import IA" },
  { num: "3", label: "QR Code table" },
  { num: "4", label: "Vue client" },
];

const LANGS = ["🇫🇷","🇬🇧","🇪🇸","🇩🇪","🇯🇵"];
const LANG_KEYS = ["fr","en","es","de","ja"];
const TRANSLATIONS = {
  fr: { title:"Mes allergies", cat:"Plats", sole:"Sole meunière", magret:"Magret de canard", blanquette:"Blanquette de veau", is:"sole, beurre, farine, citron", im:"canard, miel, thym, orange", ib:"veau, crème, beurre, carottes" },
  en: { title:"My allergies", cat:"Main courses", sole:"Pan-fried sole", magret:"Duck breast", blanquette:"Veal blanquette", is:"sole, butter, flour, lemon", im:"duck, honey, thyme, orange", ib:"veal, cream, butter, carrots" },
  es: { title:"Mis alergias", cat:"Platos principales", sole:"Lenguado meunière", magret:"Magret de pato", blanquette:"Blanqueta de ternera", is:"lenguado, mantequilla, harina, limón", im:"pato, miel, tomillo, naranja", ib:"ternera, nata, mantequilla, zanahorias" },
  de: { title:"Meine Allergien", cat:"Hauptgerichte", sole:"Seezunge Müllerin", magret:"Entenbrust", blanquette:"Kalbsblanquette", is:"Seezunge, Butter, Mehl, Zitrone", im:"Ente, Honig, Thymian, Orange", ib:"Kalb, Sahne, Butter, Karotten" },
  ja: { title:"アレルギー選択", cat:"メインコース", sole:"ムニエール", magret:"鴨のマグレ", blanquette:"仔牛のブランケット", is:"舌平目、バター、小麦粉、レモン", im:"鴨、蜂蜜、タイム、オレンジ", ib:"仔牛、生クリーム、バター、にんじん" },
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
    <div style={{ background: "#1A1A1A", border: "2px solid rgba(255,255,255,0.1)", borderRadius: 24, width: 220, overflow: "hidden", margin: "0 auto" }}>
      <div style={{ background: "#111", padding: "12px 16px" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "white", margin: "0 0 6px" }}>Le Bistrot du Coin</p>
        <div style={{ display: "flex", gap: 5 }}>
          {LANGS.map((f, i) => (
            <button key={i} onClick={() => setLang(i)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: i === lang ? 1 : 0.35, padding: 0 }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ background: "#0F0F0F", borderRadius: 10, padding: 10, marginBottom: 10 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{t.title}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {[["gluten","Gluten"],["lait","Lait"],["oeufs","Œufs"],["poissons","Poissons"]].map(([id, label]) => (
              <button key={id} onClick={() => toggleAllerg(id)}
                style={{ fontSize: 9, fontWeight: 600, padding: "3px 7px", borderRadius: 20, border: "1px solid", cursor: "pointer",
                  background: activeAllergs.has(id) ? "#FFF3CD" : "transparent",
                  color: activeAllergs.has(id) ? "#856404" : "rgba(255,255,255,0.3)",
                  borderColor: activeAllergs.has(id) ? "#F6D860" : "rgba(255,255,255,0.1)" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{t.cat}</p>
        {[
          { key: "sole", name: t.sole, ing: t.is, blocked: soleBlocked, allergens: ["Gluten","Poissons","Lait"] },
          { key: "magret", name: t.magret, ing: t.im, blocked: false, allergens: [] },
          { key: "blanquette", name: t.blanquette, ing: t.ib, blocked: blanqBlocked, allergens: ["Lait"] },
        ].map((dish) => (
          <div key={dish.key} style={{ background: dish.blocked ? "#1A1A1A" : "#222", borderRadius: 8, padding: "8px 10px", marginBottom: 6, opacity: dish.blocked ? 0.45 : 1, transition: "all 0.3s" }}>
            {dish.blocked && <p style={{ fontSize: 9, color: "#856404", background: "#FFF3CD", padding: "2px 6px", borderRadius: 10, display: "inline-block", marginBottom: 3 }}>⚠️ Contient vos allergènes</p>}
            <p style={{ fontSize: 11, fontWeight: 600, color: dish.blocked ? "#666" : "white", margin: "0 0 3px" }}>{dish.name}</p>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", margin: "0 0 4px" }}>{dish.ing}</p>
            {dish.allergens.length > 0 && (
              <div style={{ display: "flex", gap: 3 }}>
                {dish.allergens.map((a) => (
                  <span key={a} style={{ fontSize: 8, background: "#333", color: "rgba(255,255,255,0.5)", padding: "2px 5px", borderRadius: 6 }}>{a}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", textAlign: "center", marginTop: 8 }}>Propulsé par MenuSafe</p>
      </div>
    </div>
  );
}

export default function DemoSection() {
  const [step, setStep] = useState(0);

  return (
    <section style={{ background: "#0F0F0F", padding: "80px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#4ADE80", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 12 }}>
          Démonstration interactive
        </p>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "white", textAlign: "center", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          MenuSafe en 4 étapes
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", textAlign: "center", margin: "0 0 40px" }}>
          Cliquez sur chaque étape pour voir comment ça fonctionne
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 28 }}>
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              flex: 1, padding: "12px 8px", background: "transparent", border: "none",
              borderBottom: step === i ? "2px solid #4ADE80" : "2px solid transparent",
              color: step === i ? "white" : "rgba(255,255,255,0.4)",
              cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
            }}>
              <span style={{ display: "block", fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{s.num}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Step content */}
        <div style={{ background: "#1A1A1A", borderRadius: 16, padding: 24, minHeight: 360 }}>

          {/* Step 1 */}
          {step === 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Saisie d'une recette</p>
                <div style={{ background: "#222", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 5, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Nom du plat</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Sole meunière</p>
                </div>
                <div style={{ background: "#2A2A2A", borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
                  {[["sole","🐟 Poissons",true],["sole meunière","🐟",false]].map(([name,badge,hl]) => (
                    <div key={name} style={{ padding: "7px 12px", fontSize: 11, background: hl ? "#333" : "transparent", color: hl ? "white" : "rgba(255,255,255,0.7)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between" }}>
                      <span>{name}</span><span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{badge}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 8, textTransform: "uppercase", fontWeight: 700 }}>Allergènes détectés</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 5 }}>
                  {[["#FFF3CD","#856404","🌾 Gluten",true],["#D0E8FF","#084298","🐟 Poissons",true],["#D0E8FF","#084298","🥛 Lait",true],["#2A2A2A","rgba(255,255,255,0.3)","🥚 Œufs",false],["#2A2A2A","rgba(255,255,255,0.3)","🌿 Moutarde",false],["#2A2A2A","rgba(255,255,255,0.3)","🫘 Soja",false]].map(([bg,color,label,on]) => (
                    <div key={label} style={{ background: bg, color, borderRadius: 7, padding: "5px 7px", fontSize: 10, fontWeight: 600, opacity: on ? 1 : 0.3 }}>{label}</div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>900+ ingrédients en base</p>
                <div style={{ background: "#1A2A1A", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: "#4ADE80", fontWeight: 600, margin: "0 0 4px" }}>✓ Autocomplétion intelligente</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>Tapez "beu" → beurre, beurre clarifié, beurre de cacahuète...</p>
                </div>
                <div style={{ background: "#1A2A1A", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: "#4ADE80", fontWeight: 600, margin: "0 0 4px" }}>✓ Détection en cascade</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>Ajouter "pâtes fraîches" → gluten + œufs détectés simultanément</p>
                </div>
                <div style={{ background: "#1A2A1A", borderRadius: 10, padding: "12px 14px" }}>
                  <p style={{ fontSize: 12, color: "#4ADE80", fontWeight: 600, margin: "0 0 4px" }}>✓ Toutes catégories</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>Entrée, Plat, Dessert, Boisson — organisées sur votre carte</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Photo uploadée</p>
                <div style={{ background: "#222", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 12 }}>
                  <p style={{ fontSize: 28, margin: "0 0 8px" }}>📸</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 6px" }}>maison-louvard-carte.jpg</p>
                  <p style={{ fontSize: 11, color: "#4ADE80", fontWeight: 600, margin: 0 }}>✓ 11 plats détectés</p>
                </div>
                <div style={{ display: "flex", gap: 8, background: "#1A2A1A", borderRadius: 10, padding: "10px 12px" }}>
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
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Validation plat par plat</p>
                <div style={{ background: "#222", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ background: "#2A2A2A", padding: "8px 12px", fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700, textTransform: "uppercase" }}>Plat 2 / 11 — Sole meunière</div>
                  <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Sole meunière</span>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "#1B3A5C", color: "#7EC8FF" }}>📋 Lu depuis carte</span>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                      {["sole","beurre","farine","citron"].map((i) => (
                        <span key={i} style={{ fontSize: 9, background: "#333", color: "rgba(255,255,255,0.6)", padding: "2px 6px", borderRadius: 6 }}>{i}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <div style={{ flex: 2, padding: "6px", fontSize: 11, fontWeight: 700, background: "#4ADE80", color: "#0F0F0F", borderRadius: 7, textAlign: "center" }}>✓ Valider</div>
                      <div style={{ flex: 1, padding: "6px", fontSize: 11, color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, textAlign: "center" }}>Ignorer</div>
                    </div>
                  </div>
                  <div style={{ padding: "10px 12px", opacity: 0.55 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "white" }}>Blanquette de veau</span>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "#2D1A4A", color: "#C4A0FF" }}>🧠 Suggestion IA</span>
                    </div>
                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", margin: 0 }}>Recette traditionnelle proposée automatiquement</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
              <div style={{ background: "white", borderRadius: 16, padding: 20, textAlign: "center", flexShrink: 0 }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <rect width="120" height="120" fill="white"/>
                  <rect x="8" y="8" width="40" height="40" rx="4" fill="#1A1A1A"/><rect x="14" y="14" width="28" height="28" rx="2" fill="white"/><rect x="20" y="20" width="16" height="16" rx="1" fill="#1A1A1A"/>
                  <rect x="72" y="8" width="40" height="40" rx="4" fill="#1A1A1A"/><rect x="78" y="14" width="28" height="28" rx="2" fill="white"/><rect x="84" y="20" width="16" height="16" rx="1" fill="#1A1A1A"/>
                  <rect x="8" y="72" width="40" height="40" rx="4" fill="#1A1A1A"/><rect x="14" y="78" width="28" height="28" rx="2" fill="white"/><rect x="20" y="84" width="16" height="16" rx="1" fill="#1A1A1A"/>
                  <rect x="56" y="56" width="8" height="8" fill="#1A1A1A"/><rect x="68" y="56" width="8" height="8" fill="#1A1A1A"/><rect x="80" y="56" width="8" height="8" fill="#1A1A1A"/>
                  <rect x="56" y="68" width="8" height="8" fill="#1A1A1A"/><rect x="80" y="68" width="8" height="8" fill="#1A1A1A"/>
                  <rect x="56" y="80" width="8" height="8" fill="#1A1A1A"/><rect x="68" y="80" width="8" height="8" fill="#1A1A1A"/><rect x="80" y="80" width="8" height="8" fill="#1A1A1A"/>
                  <rect x="104" y="56" width="8" height="8" fill="#1A1A1A"/><rect x="104" y="68" width="8" height="8" fill="#1A1A1A"/><rect x="104" y="80" width="8" height="8" fill="#1A1A1A"/>
                </svg>
                <p style={{ fontSize: 10, color: "#888", marginTop: 8, wordBreak: "break-all", maxWidth: 120 }}>menusafe.app/menu/bistrot-a3f2</p>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: "white", margin: "0 0 6px" }}>Un QR code par établissement</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 20px", lineHeight: 1.6 }}>Imprimez-le une seule fois, plastifiez-le sur chaque table. La carte se met à jour automatiquement quand vous modifiez vos recettes.</p>
                {[
                  ["🖨️","Permanent — ne change jamais, même si vous modifiez des recettes"],
                  ["🌍","Page client disponible en 8 langues — FR, EN, ES, DE, IT, NL, JA, ZH"],
                  ["⚠️","Filtrage allergènes en temps réel — plats grisés si incompatibles"],
                  ["📱","100% mobile — aucune app à télécharger, fonctionne dans le navigateur"],
                  ["📄","PDF carte complète inclus — tous vos plats par catégorie avec colonnes allergènes"],
                ].map(([icon, text], i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.5 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 3 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Vue client interactive — essayez !</p>
                <PhoneMockup />
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Comment ça fonctionne</p>
                {[
                  ["✓","Cliquez sur un allergène dans le téléphone — les plats incompatibles se grisent instantanément"],
                  ["✓","Changez de langue en cliquant sur un drapeau — traduction automatique par IA"],
                  ["✓","Aucune app à télécharger — fonctionne directement dans Safari ou Chrome"],
                  ["✓","Mise à jour automatique — chaque modification de recette est reflétée immédiatement"],
                ].map(([icon, text], i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                    <span style={{ color: "#4ADE80", fontWeight: 700, flexShrink: 0 }}>{icon}</span>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.6 }}>{text}</p>
                  </div>
                ))}
                <div style={{ marginTop: 20, background: "#1A2A1A", borderRadius: 12, padding: "14px 16px" }}>
                  <p style={{ fontSize: 12, color: "#4ADE80", fontWeight: 600, margin: "0 0 4px" }}>Essayez maintenant</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5 }}>Cliquez sur les boutons allergènes dans le téléphone à gauche pour voir le filtrage en temps réel</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 20 }}>
          {STEPS.map((_, i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              width: step === i ? 24 : 8, height: 8, borderRadius: step === i ? 4 : "50%",
              background: step === i ? "#4ADE80" : "rgba(255,255,255,0.2)",
              border: "none", cursor: "pointer", transition: "all 0.2s", padding: 0,
            }} />
          ))}
          <button onClick={() => setStep(Math.max(0, step - 1))} style={{ marginLeft: 12, background: "rgba(255,255,255,0.1)", border: "none", color: "white", fontSize: 12, fontWeight: 600, padding: "8px 18px", borderRadius: 20, cursor: "pointer" }}>
            ← Précédent
          </button>
          <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} style={{ background: "#4ADE80", border: "none", color: "#0F0F0F", fontSize: 12, fontWeight: 700, padding: "8px 18px", borderRadius: 20, cursor: "pointer" }}>
            {step === STEPS.length - 1 ? "Commencer →" : "Suivant →"}
          </button>
        </div>
      </div>
    </section>
  );
}