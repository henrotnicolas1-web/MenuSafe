"use client";
import { useState, useRef, Suspense } from "react";
import { createClient } from "@/lib/supabase";
import { getPlan } from "@/lib/plans";
import { detectAllergens, ALLERGENS, AllergenIcon } from "@/lib/allergens-db";
import { useRouter, useSearchParams } from "next/navigation";

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

// Composant interne qui utilise useSearchParams — doit être wrappé dans Suspense
function ImportPageInner() {
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
  const [estName, setEstName]     = useState("");
  const [checkDone, setCheckDone] = useState(false);
  const fileRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navigation vers le dashboard
  function goToDashboard() {
    router.push("/dashboard");
  }
  const supabase = createClient();

  useState(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }
      setUser(user);

      const [{ data: sub }, { data: ests }] = await Promise.all([
        supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
        supabase.from("establishments").select("id, name").eq("user_id", user.id),
      ]);
      setSub(sub);

      // Lit l'établissement depuis l'URL (?est=xxx)
      const estFromUrl = searchParams?.get("est");
      const matched = ests?.find((e) => e.id === estFromUrl);
      const target = matched ?? ests?.[0];
      setEstId(target?.id ?? null);
      setEstName(target?.name ?? "");
      setCheckDone(true);
    })();
  }, []);

  const plan = subscription?.plan ?? "free";
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
        category: plat.categorie || "plat",
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
      setStep(STEPS.saving);
      const toSave = action === "save" ? [...saved, plats[current]] : saved;
      if (user && estId && toSave.length > 0) {
        const rows = toSave.map((p) => ({
          user_id: user.id,
          establishment_id: estId,
          dish_name: p.nom,
          category: p.category || "plat",
          ingredients: p.ingredients,
          allergens: p.allergens,
          translations_cache: p.translations ?? {},
        }));
        await supabase.from("recipes").insert(rows);
      }
      setSaved(action === "save" ? [...saved, plats[current]] : saved);
      setStep(STEPS.done);
    }
  }

  // Page de blocage plan insuffisant
  if (checkDone && !hasAccess) {
    return (
      <div style={s.page}>
        <nav style={s.nav}><div style={s.navInner}>
          <div style={s.logo} onClick={() => goToDashboard()}><Logo /><p style={s.logoName}>MenuSafe</p></div>
        </div></nav>
        <div style={s.center}>
          <div style={s.lockCard}>
            <p style={{ fontSize: 48, margin: "0 0 16px" }}>🔒</p>
            <p style={s.lockTitle}>Fonctionnalité Pro & Réseau</p>
            <p style={s.lockSub}>L'import par photo est disponible à partir du plan <strong>Pro (59€/mois)</strong>.</p>
            <div style={s.lockFeatures}>
              {["Photo, image ou PDF de carte","Traductions 8 langues en une analyse","Ingrédients lus ou suggérés par l'IA","Détection allergènes automatique","Validation plat par plat"].map((f, i) => (
                <p key={i} style={s.lockFeature}><span style={{ color: "#4ADE80" }}>✓</span> {f}</p>
              ))}
            </div>
            <button style={s.btnPrimary} onClick={() => router.push("/#pricing")}>Passer au plan Pro →</button>
            <button style={{ ...s.btnSecondary, marginTop: 8, width: "100%" }} onClick={() => goToDashboard()}>← Retour</button>
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
          <div style={s.logo} onClick={() => goToDashboard()} role="button"><Logo /><p style={s.logoName}>MenuSafe</p></div>
          <p style={s.navTitle}>Import · {estName || "..."}</p>
          <button style={s.btnSecondary} onClick={() => goToDashboard()}>← Dashboard</button>
        </div>
      </nav>

      <main style={s.main}>

        {/* UPLOAD */}
        {step === STEPS.upload && (
          <div style={s.uploadWrap}>
            <div style={s.uploadHeader}>
              <span style={s.stepBadge}>Étape 1 / 3</span>
              <h1 style={s.uploadTitle}>Photographiez votre carte</h1>
              <p style={s.uploadSub}>L'IA analyse la carte, extrait tous les plats et génère les traductions en 8 langues en une seule passe. Zéro coût supplémentaire par la suite.</p>
              {estName && <p style={{ fontSize: 13, color: "#4ADE80", fontWeight: 600, marginTop: 8 }}>→ Import vers : {estName}</p>}
            </div>

            <div style={{ ...s.dropzone, ...(file ? s.dropzoneHasFile : {}) }}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])} />
              {preview ? (
                <img src={preview} alt="Aperçu" style={s.preview} />
              ) : file ? (
                <div style={{ textAlign: "center" }}><p style={{ fontSize: 40 }}>📄</p><p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{file.name}</p></div>
              ) : (
                <div style={s.dropContent}>
                  <p style={{ fontSize: 32, marginBottom: 12, color: "#555" }}>↑</p>
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

            <div style={s.aiExplain}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {[
                  ["📋", "Ingrédients sur la carte", "Lus directement. Précision maximale."],
                  ["🧠", "Aucun ingrédient listé", "Recette traditionnelle proposée. Vous validez."],
                  ["🌍", "8 langues générées", "FR, EN, ES, DE, IT, NL, JA, ZH — en une seule analyse."],
                ].map(([icon, title, desc], i, arr) => (
                  <div key={i} style={{ flex: 1, display: "flex", gap: 8 }}>
                    {i > 0 && <div style={{ width: 1, background: "#F0F0F0", alignSelf: "stretch", flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 3px" }}>{icon} {title}</p>
                      <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCANNING */}
        {step === STEPS.scanning && (
          <div style={s.center}>
            <div style={s.scanCard}>
              <div style={s.spinner} />
              <p style={s.scanTitle}>Analyse en cours...</p>
              <p style={s.scanSub}>L'IA lit votre carte, extrait les plats, génère les traductions en 8 langues et détecte les allergènes.</p>
              <p style={s.scanSub2}>Comptez environ 45 à 90 secondes — c'est la seule fois que l'IA est appelée.</p>
            </div>
          </div>
        )}

        {/* REVIEW */}
        {step === STEPS.review && platActuel && (
          <div style={s.reviewWrap}>
            {scanStats && (
              <div style={s.scanSummary}>
                <p style={{ fontSize: 13, color: "#555", margin: 0, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <strong>{scanStats.total} plats détectés</strong>
                  {scanStats.depuis_carte > 0 && <span style={s.tagCarte}>{scanStats.depuis_carte} lus depuis la carte</span>}
                  {scanStats.suggestions_ia > 0 && <span style={s.tagIA}>{scanStats.suggestions_ia} complétés par l'IA</span>}
                  <span style={{ fontSize: 11, background: "#D4EDDA", color: "#155724", padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>🌍 8 langues stockées</span>
                </p>
              </div>
            )}

            <div style={s.progressWrap}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={s.stepBadge}>Étape 2 / 3 · Validation</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{current + 1} / {plats.length}</span>
              </div>
              <div style={{ background: "#F0F0F0", borderRadius: 6, height: 6, overflow: "hidden" }}>
                <div style={{ height: 6, borderRadius: 6, background: "#1A1A1A", width: `${(current / plats.length) * 100}%`, transition: "width 0.3s ease" }} />
              </div>
            </div>

            <div style={{ ...s.platCard, ...(isAISuggestion ? s.platCardAI : {}) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", margin: "0 0 4px", letterSpacing: "-0.02em" }}>{platActuel.nom}</p>
                  <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{platActuel.ingredients.length} ingrédient{platActuel.ingredients.length > 1 ? "s" : ""}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  {isAISuggestion
                    ? <div style={s.badgeAI}><span>🧠</span><span>Recette proposée par l'IA</span></div>
                    : <div style={s.badgeCarte}><span>📋</span><span>Lu depuis votre carte</span></div>
                  }
                  {platActuel.translations && Object.keys(platActuel.translations).length > 0 && (
                    <div style={{ fontSize: 10, fontWeight: 600, background: "#D4EDDA", color: "#155724", padding: "2px 8px", borderRadius: 20 }}>🌍 8 langues prêtes</div>
                  )}
                  {platActuel.allergens.length > 0
                    ? <span style={s.allergenCount}>{platActuel.allergens.length} allergène{platActuel.allergens.length > 1 ? "s" : ""}</span>
                    : <span style={s.noAllergen}>Aucun allergène</span>
                  }
                </div>
              </div>

              {isAISuggestion && (
                <div style={s.aiNotice}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#5A2D8E", margin: "0 0 4px" }}>🧠 Ingrédients non détaillés sur la carte</p>
                  <p style={{ fontSize: 12, color: "#7A4F9E", lineHeight: 1.6, margin: 0 }}>L'IA a reconstitué la recette traditionnelle. Vérifiez et modifiez si votre préparation diffère.</p>
                </div>
              )}

              {/* Catégorie corrigeable */}
              <div style={{ marginBottom: 14 }}>
                <p style={s.ingLabel}>Catégorie</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { value: "entree",  label: "🥗 Entrée" },
                    { value: "plat",    label: "🍽️ Plat" },
                    { value: "dessert", label: "🍰 Dessert" },
                    { value: "boisson", label: "🥤 Boisson" },
                    { value: "autre",   label: "📋 Autre" },
                  ].map((cat) => (
                    <button key={cat.value}
                      onClick={() => setPlats((prev) => {
                        const updated = [...prev];
                        updated[current] = { ...updated[current], category: cat.value };
                        return updated;
                      })}
                      style={{ fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 20, border: "1px solid", cursor: "pointer",
                        background: platActuel.category === cat.value ? "#1A1A1A" : "white",
                        color: platActuel.category === cat.value ? "white" : "#555",
                        borderColor: platActuel.category === cat.value ? "#1A1A1A" : "#E0E0E0",
                      }}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingrédients éditables */}
              <div style={{ marginBottom: 14 }}>
                <p style={s.ingLabel}>Ingrédients <span style={{ fontSize: 10, fontWeight: 400, color: "#CCC" }}>— cliquez pour modifier</span></p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {platActuel.ingredients.map((ing, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input style={s.ingInput} value={ing} onChange={(e) => handleEditIngredient(i, e.target.value)} />
                      <button style={s.ingRemove} onClick={() => handleRemoveIngredient(i)}>×</button>
                    </div>
                  ))}
                  <button style={s.ingAdd} onClick={handleAddIngredient}>+ Ajouter un ingrédient</button>
                </div>
              </div>

              {/* Allergènes supprimables */}
              <div style={{ marginBottom: 16, paddingTop: 14, borderTop: "1px solid #F0F0F0" }}>
                <p style={s.ingLabel}>Allergènes détectés <span style={{ fontSize: 10, fontWeight: 400, color: "#CCC" }}>— cliquez × pour retirer</span></p>
                {platActuel.allergens.length === 0 ? (
                  <p style={{ fontSize: 12, color: "#BBB", fontStyle: "italic", margin: "0 0 8px" }}>Aucun allergène détecté</p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {platActuel.allergens.map((id) => {
                      const a = ALLERGENS.find((x) => x.id === id);
                      if (!a) return null;
                      return (
                        <div key={id} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, padding: "4px 6px 4px 10px", borderRadius: 20, background: a.color, color: a.text }}>
                          <span>{a.icon} {a.label}</span>
                          <button onClick={() => setPlats((prev) => {
                            const updated = [...prev];
                            updated[current] = { ...updated[current], allergens: updated[current].allergens.filter((x) => x !== id) };
                            return updated;
                          })} style={{ background: "rgba(0,0,0,0.15)", border: "none", borderRadius: "50%", width: 16, height: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: a.text, fontWeight: 700, padding: 0 }}>×</button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <select onChange={(e) => {
                  const id = e.target.value;
                  if (!id) return;
                  setPlats((prev) => {
                    const updated = [...prev];
                    const curr = updated[current];
                    if (!curr.allergens.includes(id)) updated[current] = { ...curr, allergens: [...curr.allergens, id] };
                    return updated;
                  });
                  e.target.value = "";
                }} style={{ fontSize: 12, color: "#555", background: "white", border: "1px dashed #CCC", borderRadius: 8, padding: "5px 10px", cursor: "pointer" }} defaultValue="">
                  <option value="" disabled>+ Ajouter un allergène manquant</option>
                  {ALLERGENS.filter((a) => !platActuel.allergens.includes(a.id)).map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: 10, paddingTop: 14, borderTop: "1px solid #F0F0F0" }}>
                <button style={s.btnSkip} onClick={() => goNext("skip")}>Ignorer ce plat</button>
                <button style={s.btnValidate} onClick={() => goNext("save")}>
                  {isAISuggestion ? "✓ Confirmer et importer" : "✓ Valider et importer"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
              <p style={{ fontSize: 13, color: "#888" }}><span style={{ color: "#38A169", fontWeight: 700 }}>{saved.length}</span> validé{saved.length > 1 ? "s" : ""}</p>
              <p style={{ fontSize: 13, color: "#888" }}><span style={{ color: "#888", fontWeight: 700 }}>{skipped.length}</span> ignoré{skipped.length > 1 ? "s" : ""}</p>
              <p style={{ fontSize: 13, color: "#888" }}><span style={{ color: "#1A1A1A", fontWeight: 700 }}>{plats.length - current - 1}</span> restant{plats.length - current - 1 !== 1 ? "s" : ""}</p>
            </div>
          </div>
        )}

        {step === STEPS.saving && (
          <div style={s.center}>
            <div style={s.scanCard}>
              <div style={s.spinner} />
              <p style={s.scanTitle}>Sauvegarde en cours...</p>
              <p style={s.scanSub}>Import de {saved.length} recette{saved.length > 1 ? "s" : ""} avec traductions en 8 langues.</p>
            </div>
          </div>
        )}

        {step === STEPS.done && (
          <div style={s.center}>
            <div style={s.doneCard}>
              <p style={{ fontSize: 56, marginBottom: 16 }}>🎉</p>
              <p style={{ fontSize: 24, fontWeight: 800, color: "#1A1A1A", marginBottom: 8, letterSpacing: "-0.02em" }}>Import terminé !</p>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Recettes importées dans : <strong>{estName}</strong></p>
              <div style={{ display: "flex", alignItems: "center", background: "#F7F7F5", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                {[
                  { val: saved.length, label: `Recette${saved.length > 1 ? "s" : ""}` },
                  { val: "8", label: "Langues" },
                  { val: new Set(saved.flatMap((p) => p.allergens)).size, label: "Allergènes" },
                ].map((st, i, arr) => (
                  <div key={i} style={{ display: "flex", flex: 1, alignItems: "center" }}>
                    <div style={{ flex: 1, textAlign: "center" }}>
                      <span style={{ display: "block", fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>{st.val}</span>
                      <span style={{ display: "block", fontSize: 11, color: "#999", marginTop: 2 }}>{st.label}</span>
                    </div>
                    {i < arr.length - 1 && <div style={{ width: 1, height: 32, background: "#E0E0E0" }} />}
                  </div>
                ))}
              </div>
              <div style={{ background: "#D4EDDA", borderRadius: 10, padding: "10px 14px", marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: "#155724", fontWeight: 600, margin: "0 0 2px" }}>🌍 Traductions stockées en base</p>
                <p style={{ fontSize: 11, color: "#276749", margin: 0 }}>Changement de langue instantané, aucun appel API futur.</p>
              </div>
              <button style={s.btnPrimary} onClick={() => goToDashboard()}>Voir mes recettes →</button>
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

// Export principal wrappé dans Suspense — obligatoire pour useSearchParams avec Next.js
export default function ImportPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F7F5" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #F0F0F0", borderTop: "3px solid #1A1A1A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ImportPageInner />
    </Suspense>
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
  uploadWrap: { maxWidth: 600, margin: "0 auto" },
  uploadHeader: { textAlign: "center", marginBottom: 24 },
  stepBadge: { display: "inline-block", fontSize: 11, fontWeight: 700, background: "#F0F0F0", color: "#666", padding: "4px 10px", borderRadius: 20, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" },
  uploadTitle: { fontSize: 26, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.02em" },
  uploadSub: { fontSize: 14, color: "#666", lineHeight: 1.65, margin: 0 },
  dropzone: { border: "2px dashed #E0E0E0", borderRadius: 16, padding: "2rem", cursor: "pointer", background: "white", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  dropzoneHasFile: { border: "2px dashed #1A1A1A" },
  dropContent: { textAlign: "center" },
  dropTitle: { fontSize: 15, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 },
  dropSub: { fontSize: 13, color: "#999", marginBottom: 14 },
  dropTags: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  dropTag: { fontSize: 12, background: "#F0F0F0", color: "#555", padding: "4px 10px", borderRadius: 20 },
  preview: { maxWidth: "100%", maxHeight: 280, borderRadius: 10, objectFit: "contain" },
  fileActions: { display: "flex", gap: 10, marginBottom: 16 },
  errorBox: { background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#CC0000", marginBottom: 16 },
  aiExplain: { background: "white", border: "1px solid #EBEBEB", borderRadius: 14, padding: "16px 20px" },
  scanCard: { background: "white", border: "1px solid #EBEBEB", borderRadius: 20, padding: "48px 40px", textAlign: "center", maxWidth: 420 },
  spinner: { width: 40, height: 40, border: "3px solid #F0F0F0", borderTop: "3px solid #1A1A1A", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.8s linear infinite" },
  scanTitle: { fontSize: 18, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 },
  scanSub: { fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 4 },
  scanSub2: { fontSize: 12, color: "#4ADE80", fontWeight: 600 },
  reviewWrap: { maxWidth: 620, margin: "0 auto" },
  scanSummary: { background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "12px 16px", marginBottom: 14 },
  tagCarte: { fontSize: 11, fontWeight: 600, background: "#E6F1FB", color: "#084298", padding: "3px 8px", borderRadius: 20 },
  tagIA: { fontSize: 11, fontWeight: 600, background: "#F0E6FF", color: "#5A2D8E", padding: "3px 8px", borderRadius: 20 },
  progressWrap: { marginBottom: 16 },
  platCard: { background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "1.5rem", marginBottom: 14 },
  platCardAI: { border: "1.5px solid #E8D5FF", background: "#FDFAFF" },
  badgeAI: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, background: "#F0E6FF", color: "#5A2D8E", padding: "4px 10px", borderRadius: 20 },
  badgeCarte: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, background: "#E6F1FB", color: "#084298", padding: "4px 10px", borderRadius: 20 },
  allergenCount: { fontSize: 11, fontWeight: 600, background: "#FFF3CD", color: "#856404", padding: "3px 9px", borderRadius: 20 },
  noAllergen: { fontSize: 11, fontWeight: 600, background: "#D4EDDA", color: "#155724", padding: "3px 9px", borderRadius: 20 },
  aiNotice: { background: "#F5EEFF", border: "1px solid #DEC5FF", borderRadius: 10, padding: "12px 14px", marginBottom: 16 },
  ingLabel: { fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 },
  ingInput: { flex: 1, padding: "7px 10px", fontSize: 13, border: "1px solid #E8E8E8", borderRadius: 8, outline: "none", color: "#1A1A1A", background: "#FAFAFA" },
  ingRemove: { background: "#FFF0F0", border: "none", color: "#CC0000", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 14, flexShrink: 0 },
  ingAdd: { fontSize: 12, fontWeight: 600, color: "#555", background: "none", border: "1px dashed #CCC", borderRadius: 8, padding: "6px 12px", cursor: "pointer", textAlign: "left" },
  btnSkip: { flex: 1, padding: "11px", fontSize: 13, fontWeight: 600, background: "white", color: "#888", border: "1px solid #E0E0E0", borderRadius: 10, cursor: "pointer" },
  btnValidate: { flex: 2, padding: "11px", fontSize: 14, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" },
  lockCard: { background: "white", border: "1px solid #EBEBEB", borderRadius: 20, padding: "40px", maxWidth: 480, textAlign: "center" },
  lockTitle: { fontSize: 22, fontWeight: 800, color: "#1A1A1A", marginBottom: 12, letterSpacing: "-0.02em" },
  lockSub: { fontSize: 14, color: "#666", lineHeight: 1.7, marginBottom: 20 },
  lockFeatures: { background: "#F7F7F5", borderRadius: 12, padding: "16px 20px", marginBottom: 24, textAlign: "left" },
  lockFeature: { fontSize: 13, color: "#444", marginBottom: 6, display: "flex", gap: 8 },
  doneCard: { background: "white", border: "1px solid #EBEBEB", borderRadius: 20, padding: "48px 40px", maxWidth: 480, textAlign: "center" },
  btnPrimary: { width: "100%", padding: "13px", fontSize: 14, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, cursor: "pointer" },
  btnSecondary: { fontSize: 13, fontWeight: 600, padding: "8px 14px", background: "white", color: "#555", border: "1px solid #E0E0E0", borderRadius: 9, cursor: "pointer" },
};