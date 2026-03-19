"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { getPlan } from "@/lib/plans";
import { detectAllergens, ALLERGENS } from "@/lib/allergens-db";
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

const STEPS = { upload: "upload", scanning: "scanning", review: "review", saving: "saving", done: "done" };

export default function ImportPage() {
  const [step, setStep]           = useState(STEPS.upload);
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [plats, setPlats]         = useState([]);
  const [current, setCurrent]     = useState(0);
  const [saved, setSaved]         = useState([]);
  const [skipped, setSkipped]     = useState([]);
  const [error, setError]         = useState("");
  const [scanStats, setScanStats] = useState(null);
  const [scanNote, setScanNote]   = useState("");
  const [user, setUser]           = useState(null);
  const [subscription, setSub]    = useState(null);
  const [estId, setEstId]         = useState(null);
  const [checkDone, setCheckDone] = useState(false);
  const fileRef = useRef(null);
  const router = useRouter();
  const supabase = createClient();

  useState(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }
      setUser(user);
      const [{ data: sub }, { data: ests }] = await Promise.all([
        supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
        supabase.from("establishments").select("id").eq("user_id", user.id).limit(1),
      ]);
      setSub(sub);
      setEstId(ests?.[0]?.id ?? null);
      setCheckDone(true);
    })();
  }, []);

  const plan = subscription?.plan ?? "free";
  const planInfo = getPlan(plan);
  const hasAccess = plan === "pro" || plan === "reseau";

  function handleFile(f) {
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("Fichier trop lourd (max 20MB)."); return; }
    setError("");
    setFile(f);
    if (f.type !== "application/pdf") setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  async function handleScan() {
    if (!file) return;
    setStep(STEPS.scanning);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/scan-menu", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      if (!data.plats || data.plats.length === 0) {
        setError("Aucun plat détecté. Essayez avec une image plus nette.");
        setStep(STEPS.upload);
        return;
      }
      const enriched = data.plats.map((plat) => ({
        ...plat,
        allergens: [...detectAllergens(plat.ingredients)],
      }));
      setPlats(enriched);
      setScanStats(data.stats ?? null);
      setScanNote(data.note ?? "");
      setCurrent(0);
      setSaved([]);
      setSkipped([]);
      setStep(STEPS.review);
    } catch (err) {
      setError(`Erreur lors du scan : ${err.message}`);
      setStep(STEPS.upload);
    }
  }

  function handleEditIngredient(idx, value) {
    setPlats((prev) => {
      const updated = [...prev];
      const ing = [...updated[current].ingredients];
      ing[idx] = value;
      updated[current] = { ...updated[current], ingredients: ing, allergens: [...detectAllergens(ing)] };
      return updated;
    });
  }

  function handleRemoveIngredient(idx) {
    setPlats((prev) => {
      const updated = [...prev];
      const ing = updated[current].ingredients.filter((_, i) => i !== idx);
      updated[current] = { ...updated[current], ingredients: ing, allergens: [...detectAllergens(ing)] };
      return updated;
    });
  }

  function handleAddIngredient() {
    const val = prompt("Ajouter un ingrédient :");
    if (!val) return;
    setPlats((prev) => {
      const updated = [...prev];
      const ing = [...updated[current].ingredients, val.trim().toLowerCase()];
      updated[current] = { ...updated[current], ingredients: ing, allergens: [...detectAllergens(ing)] };
      return updated;
    });
  }

  async function goNext(action) {
    if (action === "save") setSaved((p) => [...p, plats[current]]);
    else setSkipped((p) => [...p, plats[current]]);

    if (current < plats.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      // Dernier plat — sauvegarde tout
      setStep(STEPS.saving);
      const toSave = action === "save" ? [...saved, plats[current]] : saved;
      if (user && estId && toSave.length > 0) {
        const rows = toSave.map((p) => ({
          user_id: user.id,
          establishment_id: estId,
          dish_name: p.nom,
          ingredients: p.ingredients,
          allergens: p.allergens,
        }));
        await supabase.from("recipes").insert(rows);
      }
      setSaved(action === "save" ? [...saved, plats[current]] : saved);
      setStep(STEPS.done);
    }
  }

  // ── Page de blocage plan insuffisant ─────────────────────────────────────
  if (checkDone && !hasAccess) {
    return (
      <div style={s.page}>
        <nav style={s.nav}><div style={s.navInner}>
          <div style={s.logo} onClick={() => router.push("/dashboard")}><Logo /><p style={s.logoName}>MenuSafe</p></div>
        </div></nav>
        <div style={s.center}>
          <div style={s.lockCard}>
            <p style={{ fontSize: 48, margin: "0 0 16px" }}>🔒</p>
            <p style={s.lockTitle}>Fonctionnalité Pro & Réseau</p>
            <p style={s.lockSub}>L'import par photo est disponible à partir du plan <strong>Pro (59€/mois)</strong>. Importez toute votre carte en une seule photo.</p>
            <div style={s.lockFeatures}>
              {["Photo, image ou PDF de carte", "Ingrédients lus depuis la carte", "Ingrédients suggérés par l'IA si absents", "Détection allergènes automatique", "Validation plat par plat"].map((f, i) => (
                <p key={i} style={s.lockFeature}><span style={{ color: "#4ADE80" }}>✓</span> {f}</p>
              ))}
            </div>
            <button style={s.btnUpgrade} onClick={() => router.push("/#pricing")}>Passer au plan Pro →</button>
            <button style={{ ...s.btnSecondary, marginTop: 8, width: "100%" }} onClick={() => router.push("/dashboard")}>← Retour</button>
          </div>
        </div>
      </div>
    );
  }

  const platActuel = plats[current];
  const isAISuggestion = platActuel?.source === "suggestion_ia";

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={s.logo} onClick={() => router.push("/dashboard")} role="button"><Logo /><p style={s.logoName}>MenuSafe</p></div>
          <p style={s.navTitle}>Import par photo de carte</p>
          <button style={s.btnSecondary} onClick={() => router.push("/dashboard")}>← Dashboard</button>
        </div>
      </nav>

      <main style={s.main}>

        {/* ── UPLOAD ── */}
        {step === STEPS.upload && (
          <div style={s.uploadWrap}>
            <div style={s.uploadHeader}>
              <span style={s.stepBadge}>Étape 1 / 3</span>
              <h1 style={s.uploadTitle}>Photographiez votre carte</h1>
              <p style={s.uploadSub}>Notre IA analyse la carte et extrait tous vos plats. Même sans liste d'ingrédients, elle propose les recettes traditionnelles correspondantes.</p>
            </div>

            <div style={{ ...s.dropzone, ...(file ? s.dropzoneHasFile : {}) }}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])} capture="environment" />
              {preview ? (
                <img src={preview} alt="Aperçu" style={s.preview} />
              ) : file ? (
                <div style={s.pdfPreview}><p style={{ fontSize: 40 }}>📄</p><p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{file.name}</p></div>
              ) : (
                <div style={s.dropContent}>
                  <p style={{ fontSize: 44, marginBottom: 12 }}>📸</p>
                  <p style={s.dropTitle}>Glissez une image ou cliquez pour choisir</p>
                  <p style={s.dropSub}>JPG, PNG, WEBP, HEIC ou PDF · Max 20MB</p>
                  <div style={s.dropTags}>
                    {["Carte imprimée", "Recette manuscrite", "Document PDF"].map((t, i) => (
                      <span key={i} style={s.dropTag}>✓ {t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {file && (
              <div style={s.fileActions}>
                <button style={s.btnSecondary} onClick={() => { setFile(null); setPreview(null); }}>Changer de fichier</button>
                <button style={s.btnPrimary} onClick={handleScan}>Analyser avec l'IA →</button>
              </div>
            )}

            {error && <div style={s.errorBox}>{error}</div>}

            {/* Explication IA */}
            <div style={s.aiExplain}>
              <div style={s.aiExplainRow}>
                <div style={s.aiExplainItem}>
                  <p style={s.aiExplainIcon}>📋</p>
                  <div>
                    <p style={s.aiExplainTitle}>Ingrédients détaillés sur la carte</p>
                    <p style={s.aiExplainSub}>L'IA les lit directement. Précision maximale.</p>
                  </div>
                </div>
                <div style={s.aiExplainDivider} />
                <div style={s.aiExplainItem}>
                  <p style={s.aiExplainIcon}>🧠</p>
                  <div>
                    <p style={s.aiExplainTitle}>Plat sans ingrédients listés</p>
                    <p style={s.aiExplainSub}>L'IA propose la recette traditionnelle. Vous validez avant d'importer.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SCANNING ── */}
        {step === STEPS.scanning && (
          <div style={s.center}>
            <div style={s.scanCard}>
              <div style={s.spinner} />
              <p style={s.scanTitle}>Analyse en cours...</p>
              <p style={s.scanSub}>L'IA lit votre carte, identifie les plats et recherche les ingrédients manquants.</p>
              <p style={s.scanSub2}>Généralement 5 à 20 secondes selon la complexité.</p>
            </div>
          </div>
        )}

        {/* ── REVIEW ── */}
        {step === STEPS.review && platActuel && (
          <div style={s.reviewWrap}>

            {/* Stats du scan */}
            {scanStats && (
              <div style={s.scanSummary}>
                <p style={s.scanSummaryText}>
                  <strong>{scanStats.total} plats détectés</strong>
                  {scanStats.depuis_carte > 0 && <span style={s.tagCarte}>{scanStats.depuis_carte} lus depuis la carte</span>}
                  {scanStats.suggestions_ia > 0 && <span style={s.tagIA}>{scanStats.suggestions_ia} complétés par l'IA</span>}
                </p>
              </div>
            )}

            {/* Progress */}
            <div style={s.progressWrap}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={s.stepBadge}>Étape 2 / 3 · Validation</span>
                <span style={s.progressCount}>{current + 1} / {plats.length}</span>
              </div>
              <div style={s.progressBg}>
                <div style={{ ...s.progressBar, width: `${(current / plats.length) * 100}%` }} />
              </div>
            </div>

            {/* Carte du plat */}
            <div style={{ ...s.platCard, ...(isAISuggestion ? s.platCardAI : {}) }}>

              {/* Badge source */}
              <div style={s.platTop}>
                <div>
                  <p style={s.platName}>{platActuel.nom}</p>
                  <p style={s.platMeta}>{platActuel.ingredients.length} ingrédient{platActuel.ingredients.length > 1 ? "s" : ""}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  {isAISuggestion ? (
                    <div style={s.badgeAI}>
                      <span style={{ fontSize: 12 }}>🧠</span>
                      <span>Recette proposée par l'IA</span>
                    </div>
                  ) : (
                    <div style={s.badgeCarte}>
                      <span style={{ fontSize: 12 }}>📋</span>
                      <span>Lu depuis votre carte</span>
                    </div>
                  )}
                  {platActuel.allergens.length > 0
                    ? <span style={s.allergenCount}>{platActuel.allergens.length} allergène{platActuel.allergens.length > 1 ? "s" : ""}</span>
                    : <span style={s.noAllergen}>Aucun allergène</span>
                  }
                </div>
              </div>

              {/* Message IA si suggestion */}
              {isAISuggestion && (
                <div style={s.aiNotice}>
                  <p style={s.aiNoticeTitle}>🧠 Ingrédients non détaillés sur la carte</p>
                  <p style={s.aiNoticeText}>L'IA a reconstitué la recette traditionnelle de ce plat. Vérifiez et modifiez si votre préparation diffère avant de valider.</p>
                </div>
              )}

              {/* Ingrédients éditables */}
              <div style={s.ingSection}>
                <p style={s.ingLabel}>
                  Ingrédients
                  <span style={s.ingEditHint}> — cliquez pour modifier</span>
                </p>
                <div style={s.ingList}>
                  {platActuel.ingredients.map((ing, i) => (
                    <div key={i} style={s.ingRow}>
                      <input style={s.ingInput} value={ing} onChange={(e) => handleEditIngredient(i, e.target.value)} />
                      <button style={s.ingRemove} onClick={() => handleRemoveIngredient(i)}>×</button>
                    </div>
                  ))}
                  <button style={s.ingAdd} onClick={handleAddIngredient}>+ Ajouter un ingrédient</button>
                </div>
              </div>

              {/* Allergènes */}
              {platActuel.allergens.length > 0 && (
                <div style={s.allergSection}>
                  <p style={s.ingLabel}>Allergènes détectés automatiquement</p>
                  <div style={s.allergGrid}>
                    {platActuel.allergens.map((id) => {
                      const a = ALLERGENS.find((x) => x.id === id);
                      if (!a) return null;
                      return <span key={id} style={{ ...s.allergBadge, background: a.color, color: a.text }}>{a.icon} {a.label}</span>;
                    })}
                  </div>
                </div>
              )}

              {/* Boutons validation */}
              <div style={s.platActions}>
                <button style={s.btnSkip} onClick={() => goNext("skip")}>Ignorer ce plat</button>
                <button style={s.btnValidate} onClick={() => goNext("save")}>
                  {isAISuggestion ? "✓ Confirmer et importer" : "✓ Valider et importer"}
                </button>
              </div>
            </div>

            {/* Mini récap */}
            <div style={s.recap}>
              <p style={s.recapItem}><span style={{ color: "#38A169", fontWeight: 700 }}>{saved.length}</span> validé{saved.length > 1 ? "s" : ""}</p>
              <p style={s.recapItem}><span style={{ color: "#888", fontWeight: 700 }}>{skipped.length}</span> ignoré{skipped.length > 1 ? "s" : ""}</p>
              <p style={s.recapItem}><span style={{ color: "#1A1A1A", fontWeight: 700 }}>{plats.length - current - 1}</span> restant{plats.length - current - 1 !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}

        {/* ── SAVING ── */}
        {step === STEPS.saving && (
          <div style={s.center}>
            <div style={s.scanCard}>
              <div style={s.spinner} />
              <p style={s.scanTitle}>Sauvegarde en cours...</p>
              <p style={s.scanSub}>Import de {saved.length} recette{saved.length > 1 ? "s" : ""} dans votre établissement.</p>
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {step === STEPS.done && (
          <div style={s.center}>
            <div style={s.doneCard}>
              <p style={{ fontSize: 56, marginBottom: 16 }}>🎉</p>
              <p style={s.doneTitle}>Import terminé !</p>
              <div style={s.doneStats}>
                {[
                  { val: saved.length, label: `Recette${saved.length > 1 ? "s" : ""} importée${saved.length > 1 ? "s" : ""}` },
                  { val: skipped.length, label: `Ignorée${skipped.length > 1 ? "s" : ""}` },
                  { val: new Set(saved.flatMap((p) => p.allergens)).size, label: "Allergènes uniques" },
                ].map((st, i, arr) => (
                  <div key={i} style={{ display: "flex", flex: 1, alignItems: "center" }}>
                    <div style={s.doneStat}>
                      <span style={s.doneStatVal}>{st.val}</span>
                      <span style={s.doneStatLabel}>{st.label}</span>
                    </div>
                    {i < arr.length - 1 && <div style={s.doneStatDiv} />}
                  </div>
                ))}
              </div>
              <p style={s.doneSub}>Vos recettes sont dans le dashboard avec leurs fiches allergènes et QR codes.</p>
              <button style={s.btnPrimary} onClick={() => router.push("/dashboard")}>Voir mes recettes →</button>
              <button style={{ ...s.btnSecondary, marginTop: 8, width: "100%" }}
                onClick={() => { setStep(STEPS.upload); setFile(null); setPreview(null); setPlats([]); setSaved([]); setSkipped([]); }}>
                Faire un autre import
              </button>
            </div>
          </div>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif" },
  nav: { background: "white", borderBottom: "1px solid #EBEBEB", position: "sticky", top: 0, zIndex: 100 },
  navInner: { maxWidth: 800, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  logo: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 },
  logoName: { fontSize: 15, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: "-0.02em" },
  navTitle: { fontSize: 13, color: "#888", margin: 0, flex: 1, textAlign: "center" },
  main: { maxWidth: 700, margin: "0 auto", padding: "32px 20px" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" },

  // Upload
  uploadWrap: { maxWidth: 600, margin: "0 auto" },
  uploadHeader: { textAlign: "center", marginBottom: 24 },
  stepBadge: { display: "inline-block", fontSize: 11, fontWeight: 700, background: "#F0F0F0", color: "#666", padding: "4px 10px", borderRadius: 20, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" },
  uploadTitle: { fontSize: 26, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.02em" },
  uploadSub: { fontSize: 14, color: "#666", lineHeight: 1.65, margin: 0 },
  dropzone: { border: "2px dashed #E0E0E0", borderRadius: 16, padding: "2rem", cursor: "pointer", background: "white", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, transition: "border-color 0.2s" },
  dropzoneHasFile: { border: "2px dashed #1A1A1A" },
  dropContent: { textAlign: "center" },
  dropTitle: { fontSize: 15, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 },
  dropSub: { fontSize: 13, color: "#999", marginBottom: 14 },
  dropTags: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  dropTag: { fontSize: 12, background: "#F0F0F0", color: "#555", padding: "4px 10px", borderRadius: 20 },
  preview: { maxWidth: "100%", maxHeight: 280, borderRadius: 10, objectFit: "contain" },
  pdfPreview: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  fileActions: { display: "flex", gap: 10, marginBottom: 16 },
  errorBox: { background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#CC0000", marginBottom: 16 },

  // Explication IA
  aiExplain: { background: "white", border: "1px solid #EBEBEB", borderRadius: 14, padding: "16px 20px" },
  aiExplainRow: { display: "flex", gap: 16, alignItems: "flex-start" },
  aiExplainItem: { flex: 1, display: "flex", gap: 10, alignItems: "flex-start" },
  aiExplainIcon: { fontSize: 22, margin: 0, flexShrink: 0 },
  aiExplainTitle: { fontSize: 13, fontWeight: 600, color: "#1A1A1A", margin: "0 0 3px" },
  aiExplainSub: { fontSize: 12, color: "#888", margin: 0, lineHeight: 1.5 },
  aiExplainDivider: { width: 1, background: "#F0F0F0", alignSelf: "stretch", flexShrink: 0 },

  // Scan
  scanCard: { background: "white", border: "1px solid #EBEBEB", borderRadius: 20, padding: "48px 40px", textAlign: "center", maxWidth: 420 },
  spinner: { width: 40, height: 40, border: "3px solid #F0F0F0", borderTop: "3px solid #1A1A1A", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.8s linear infinite" },
  scanTitle: { fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 },
  scanSub: { fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 4 },
  scanSub2: { fontSize: 12, color: "#BBB" },

  // Review
  reviewWrap: { maxWidth: 620, margin: "0 auto" },
  scanSummary: { background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center" },
  scanSummaryText: { fontSize: 13, color: "#555", margin: 0, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  tagCarte: { fontSize: 11, fontWeight: 600, background: "#E6F1FB", color: "#084298", padding: "3px 8px", borderRadius: 20 },
  tagIA: { fontSize: 11, fontWeight: 600, background: "#F0E6FF", color: "#5A2D8E", padding: "3px 8px", borderRadius: 20 },
  progressWrap: { marginBottom: 16 },
  progressCount: { fontSize: 13, fontWeight: 600, color: "#1A1A1A" },
  progressBg: { background: "#F0F0F0", borderRadius: 6, height: 6, overflow: "hidden" },
  progressBar: { height: 6, borderRadius: 6, background: "#1A1A1A", transition: "width 0.3s ease" },

  // Carte plat
  platCard: { background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "1.5rem", marginBottom: 14 },
  platCardAI: { border: "1.5px solid #E8D5FF", background: "#FDFAFF" },
  platTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  platName: { fontSize: 20, fontWeight: 800, color: "#1A1A1A", margin: "0 0 4px", letterSpacing: "-0.02em" },
  platMeta: { fontSize: 12, color: "#999", margin: 0 },
  badgeAI: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, background: "#F0E6FF", color: "#5A2D8E", padding: "4px 10px", borderRadius: 20 },
  badgeCarte: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, background: "#E6F1FB", color: "#084298", padding: "4px 10px", borderRadius: 20 },
  allergenCount: { fontSize: 11, fontWeight: 600, background: "#FFF3CD", color: "#856404", padding: "3px 9px", borderRadius: 20 },
  noAllergen: { fontSize: 11, fontWeight: 600, background: "#D4EDDA", color: "#155724", padding: "3px 9px", borderRadius: 20 },

  // Notice IA
  aiNotice: { background: "#F5EEFF", border: "1px solid #DEC5FF", borderRadius: 10, padding: "12px 14px", marginBottom: 16 },
  aiNoticeTitle: { fontSize: 13, fontWeight: 700, color: "#5A2D8E", margin: "0 0 4px" },
  aiNoticeText: { fontSize: 12, color: "#7A4F9E", lineHeight: 1.6, margin: 0 },

  // Ingrédients
  ingSection: { marginBottom: 14 },
  ingLabel: { fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 },
  ingEditHint: { fontSize: 10, fontWeight: 400, color: "#CCC", textTransform: "none" },
  ingList: { display: "flex", flexDirection: "column", gap: 5 },
  ingRow: { display: "flex", gap: 6, alignItems: "center" },
  ingInput: { flex: 1, padding: "7px 10px", fontSize: 13, border: "1px solid #E8E8E8", borderRadius: 8, outline: "none", color: "#1A1A1A", background: "#FAFAFA" },
  ingRemove: { background: "#FFF0F0", border: "none", color: "#CC0000", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 14, flexShrink: 0 },
  ingAdd: { fontSize: 12, fontWeight: 600, color: "#555", background: "none", border: "1px dashed #CCC", borderRadius: 8, padding: "6px 12px", cursor: "pointer", textAlign: "left" },
  allergSection: { marginBottom: 16, paddingTop: 14, borderTop: "1px solid #F0F0F0" },
  allergGrid: { display: "flex", flexWrap: "wrap", gap: 6 },
  allergBadge: { fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20 },
  platActions: { display: "flex", gap: 10, paddingTop: 14, borderTop: "1px solid #F0F0F0" },
  btnSkip: { flex: 1, padding: "11px", fontSize: 13, fontWeight: 600, background: "white", color: "#888", border: "1px solid #E0E0E0", borderRadius: 10, cursor: "pointer" },
  btnValidate: { flex: 2, padding: "11px", fontSize: 14, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" },
  recap: { display: "flex", gap: 20, justifyContent: "center" },
  recapItem: { fontSize: 13, color: "#888" },

  // Lock
  lockCard: { background: "white", border: "1px solid #EBEBEB", borderRadius: 20, padding: "40px", maxWidth: 480, textAlign: "center" },
  lockTitle: { fontSize: 22, fontWeight: 800, color: "#1A1A1A", marginBottom: 12, letterSpacing: "-0.02em" },
  lockSub: { fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 20 },
  lockFeatures: { background: "#F7F7F5", borderRadius: 12, padding: "16px 20px", marginBottom: 24, textAlign: "left" },
  lockFeature: { fontSize: 13, color: "#444", marginBottom: 6, display: "flex", gap: 8, alignItems: "center" },
  btnUpgrade: { width: "100%", padding: "13px", fontSize: 15, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, cursor: "pointer" },

  // Done
  doneCard: { background: "white", border: "1px solid #EBEBEB", borderRadius: 20, padding: "48px 40px", maxWidth: 480, textAlign: "center" },
  doneTitle: { fontSize: 24, fontWeight: 800, color: "#1A1A1A", marginBottom: 20, letterSpacing: "-0.02em" },
  doneStats: { display: "flex", alignItems: "center", background: "#F7F7F5", borderRadius: 14, padding: "16px", marginBottom: 20 },
  doneStat: { flex: 1, textAlign: "center" },
  doneStatVal: { display: "block", fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" },
  doneStatLabel: { display: "block", fontSize: 11, color: "#999", marginTop: 2 },
  doneStatDiv: { width: 1, height: 32, background: "#E0E0E0" },
  doneSub: { fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 24 },

  // Buttons
  btnPrimary: { width: "100%", padding: "13px", fontSize: 14, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, cursor: "pointer" },
  btnSecondary: { fontSize: 13, fontWeight: 600, padding: "8px 14px", background: "white", color: "#555", border: "1px solid #E0E0E0", borderRadius: 9, cursor: "pointer" },
};