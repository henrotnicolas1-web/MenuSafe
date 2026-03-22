"use client";
import { useState, useRef, useEffect } from "react";
import { ALLERGENS, AllergenIcon, detectAllergens, getSuggestions } from "@/lib/allergens-db";


const CATEGORIES = [
  { value: "entree",  label: "Entrée" },
  { value: "plat",    label: "Plat" },
  { value: "dessert", label: "Dessert" },
  { value: "boisson", label: "Boisson" },
  { value: "autre",   label: "Autre" },
];

export default function RecipeForm({ onSave, initialData }) {
  const [dishName, setDishName]       = useState(initialData?.dishName ?? "");
  const [category, setCategory]       = useState(initialData?.category ?? "plat");
  const [ingInput, setIngInput]       = useState("");
  const [ingredients, setIngredients] = useState(initialData?.ingredients ?? []);
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug]         = useState(false);
  const [toast, setToast]             = useState({ visible: false, message: "" });
  const [isVegan, setIsVegan]         = useState(initialData?.isVegan ?? false);
  const [isVegetarian, setIsVegetarian] = useState(initialData?.isVegetarian ?? false);
  const [meatCert, setMeatCert]       = useState(initialData?.meatCertification ?? "");
  const inputRef = useRef(null);
  const detectedAllergens = new Set(detectAllergens(ingredients));

  // Auto-détection régimes et viandes
  const MEAT_KW = ["bœuf","veau","agneau","porc","poulet","canard","dinde","jambon","lardons","bacon","saucisse","chorizo","merguez","foie","lapin","caille","pintade","gibier"];
  const ANIMAL_KW = [...MEAT_KW,"saumon","thon","cabillaud","sole","daurade","truite","sardine","anchois","crevette","homard","crabe","moule","huître","calmar"];
  const hasMeat = ingredients.some(i => MEAT_KW.some(k => i.toLowerCase().includes(k)));
  const hasAnimal = ingredients.some(i => ANIMAL_KW.some(k => i.toLowerCase().includes(k)));
  const canBeVegetarian = !hasAnimal;
  const canBeVegan = !hasAnimal && !detectedAllergens.has("lait") && !detectedAllergens.has("oeufs");

  useEffect(() => {
    const results = getSuggestions(ingInput).map(name => ({ name }));
    setSuggestions(results);
    setShowSug(results.length > 0 && ingInput.length >= 2);
  }, [ingInput]);

  function addIngredient(name) {
    const val = (name ?? ingInput).trim();
    if (!val) return;
    if (!ingredients.includes(val)) setIngredients((p) => [...p, val]);
    setIngInput("");
    setShowSug(false);
    inputRef.current?.focus();
  }

  function removeIngredient(i) {
    setIngredients((p) => p.filter((_, idx) => idx !== i));
  }

  function handleSave() {
    if (!dishName.trim()) return alert("Donnez un nom au plat.");
    if (!ingredients.length) return alert("Ajoutez au moins un ingrédient.");
    const recipe = {
      id: initialData?.id ?? crypto.randomUUID(),
      dishName: dishName.trim(),
      category,
      ingredients,
      allergens: [...detectedAllergens],
      isVegan,
      isVegetarian,
      meatCertification: meatCert || null,
      createdAt: initialData?.createdAt ?? new Date().toISOString(),
    };
    if (typeof onSave === "function") onSave(recipe);
    if (!initialData) {
      setDishName(""); setCategory("plat"); setIngredients([]);
    }
    setToast({ visible: true, message: `✓ "${recipe.dishName}" sauvegardé` });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  }

  return (
    <div style={styles.card}>
      {/* Nom */}
      <div style={styles.field}>
        <label style={styles.label}>Nom du plat</label>
        <input style={styles.input} value={dishName} onChange={(e) => setDishName(e.target.value)}
          placeholder="Ex : Quiche lorraine, Salade niçoise..." />
      </div>

      {/* Catégorie */}
      <div style={styles.field}>
        <label style={styles.label}>Catégorie</label>
        <div style={styles.catGrid}>
          {CATEGORIES.map((cat) => (
            <button key={cat.value}
              style={{ ...styles.catBtn, ...(category === cat.value ? styles.catBtnActive : {}) }}
              onClick={() => setCategory(cat.value)}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ingrédients */}
      <div style={styles.field}>
        <label style={styles.label}>Ajouter un ingrédient</label>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input ref={inputRef} style={styles.input} value={ingInput}
              onChange={(e) => setIngInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
              onBlur={() => setTimeout(() => setShowSug(false), 150)}
              placeholder="Ex : lardons, beurre, saumon..." autoComplete="off" />
            {showSug && (
              <div style={styles.dropdown}>
                {suggestions.map((s, idx) => (
                  <div key={`${s.name}-${idx}`} onMouseDown={() => addIngredient(s.name)}
                    style={styles.suggItem}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F3")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "white")}>
                    <span style={{ fontSize: 13 }}>{s.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button style={styles.btnAdd} onClick={() => addIngredient()}>+ Ajouter</button>
        </div>
      </div>

      {/* Tags */}
      <div style={styles.tagList}>
        {ingredients.length === 0
          ? <span style={styles.hint}>Aucun ingrédient ajouté</span>
          : ingredients.map((ing, i) => (
            <span key={`ing-${i}`} style={styles.tag}>
              {ing}
              <button style={styles.tagRemove} onClick={() => removeIngredient(i)}>×</button>
            </span>
          ))}
      </div>

      <hr style={styles.divider} />

      {/* Allergènes */}
      <p style={styles.sectionLabel}>
        Allergènes détectés
        {detectedAllergens.size > 0 && <span style={styles.countBadge}>{detectedAllergens.size}</span>}
      </p>
      <div style={styles.allergenGrid}>
        {ALLERGENS.map((a) => {
          const active = detectedAllergens.has(a.id);
          return (
            <div key={a.id} style={{ ...styles.allergenPill, background: active ? a.color : "transparent", border: active ? `1px solid ${a.color}` : "1px solid #E5E5E5", opacity: active ? 1 : 0.35 }}>
              <span style={{ fontSize: 18 }}><AllergenIcon id={a.id} size={14} color={a.text} /> </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: active ? a.text : "#999" }}>{a.label}</span>
            </div>
          );
        })}
      </div>

      {/* ── Pastilles régime et certification ── */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #F0F0F0" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#666", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
          Labels & certifications
        </p>

        {/* Vegan / Végétarien */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <button onClick={() => setIsVegetarian(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 20, border: "1.5px solid", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
              borderColor: isVegetarian ? "#155724" : "#E0E0E0",
              background: isVegetarian ? "#F0FFF4" : "white",
              color: isVegetarian ? "#155724" : "#888" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: isVegetarian ? "#38A169" : "#CCC" }} />
            Végétarien
            {!canBeVegetarian && !isVegetarian && <span style={{ fontSize: 10, color: "#CC0000" }}>⚠</span>}
          </button>
          <button onClick={() => { setIsVegan(v => !v); if (!isVegan) setIsVegetarian(true); }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 20, border: "1.5px solid", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
              borderColor: isVegan ? "#155724" : "#E0E0E0",
              background: isVegan ? "#F0FFF4" : "white",
              color: isVegan ? "#155724" : "#888" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: isVegan ? "#38A169" : "#CCC" }} />
            Vegan
            {!canBeVegan && !isVegan && <span style={{ fontSize: 10, color: "#CC0000" }}>⚠</span>}
          </button>
          {(isVegetarian && !canBeVegetarian) && (
            <span style={{ fontSize: 11, color: "#856404", background: "#FFF3CD", padding: "3px 8px", borderRadius: 8 }}>
              Attention : des ingrédients animaux ont été détectés
            </span>
          )}
        </div>

        {/* Certification viande — affichée seulement si viande détectée */}
        {hasMeat && (
          <div>
            <p style={{ fontSize: 11, color: "#888", marginBottom: 8 }}>Certification viande (optionnel)</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["", "halal", "casher", "label_rouge", "bio"].map(cert => (
                <button key={cert} onClick={() => setMeatCert(meatCert === cert && cert !== "" ? "" : cert)}
                  style={{ padding: "6px 12px", borderRadius: 20, border: "1.5px solid", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                    borderColor: meatCert === cert && cert !== "" ? "#1A1A1A" : "#E0E0E0",
                    background: meatCert === cert && cert !== "" ? "#1A1A1A" : "white",
                    color: meatCert === cert && cert !== "" ? "white" : "#888" }}>
                  {cert === "" ? "Aucune" : cert === "halal" ? "Halal" : cert === "casher" ? "Casher" : cert === "label_rouge" ? "Label Rouge" : "Bio"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button style={styles.btnSave} onClick={handleSave}>Sauvegarder la recette</button>
      {toast.visible && <div style={styles.toast}>{toast.message}</div>}
    </div>
  );
}

const styles = {
  card: { background: "white", borderRadius: 16, border: "1px solid #EBEBEB", padding: "1.5rem", maxWidth: 640, width: "100%", fontFamily: "'Inter', -apple-system, sans-serif" },
  field: { marginBottom: "1rem" },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#666", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" },
  input: { width: "100%", padding: "10px 14px", fontSize: 14, border: "1px solid #E0E0E0", borderRadius: 10, outline: "none", background: "#FAFAFA", color: "#1A1A1A", boxSizing: "border-box" },
  catGrid: { display: "flex", gap: 6, flexWrap: "wrap" },
  catBtn: { fontSize: 13, fontWeight: 500, padding: "7px 14px", background: "white", color: "#666", border: "1px solid #E0E0E0", borderRadius: 10, cursor: "pointer" },
  catBtnActive: { background: "#1A1A1A", color: "white", border: "1px solid #1A1A1A" },
  dropdown: { position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "white", border: "1px solid #E0E0E0", borderRadius: 10, zIndex: 50, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
  suggItem: { padding: "9px 14px", fontSize: 13, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#1A1A1A", background: "white" },
  tagList: { display: "flex", flexWrap: "wrap", gap: 6, minHeight: 36, alignItems: "center", marginBottom: "1rem" },
  hint: { fontSize: 12, color: "#BBB" },
  tag: { display: "inline-flex", alignItems: "center", gap: 6, background: "#F5F5F3", border: "1px solid #E5E5E5", borderRadius: 8, padding: "4px 10px", fontSize: 13, color: "#1A1A1A" },
  tagRemove: { background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 16, lineHeight: 1, padding: 0 },
  divider: { border: "none", borderTop: "1px solid #F0F0F0", margin: "1.25rem 0" },
  sectionLabel: { fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 },
  countBadge: { background: "#1A1A1A", color: "white", fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 20 },
  allergenGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginBottom: "1.5rem" },
  allergenPill: { display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, transition: "all 0.15s ease" },
  btnAdd: { padding: "10px 16px", fontSize: 13, fontWeight: 600, background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap" },
  btnSave: { width: "100%", padding: "12px", fontSize: 14, fontWeight: 600, background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" },
  toast: { marginTop: 10, padding: "10px 14px", background: "#F0FFF4", color: "#276749", border: "1px solid #C6F6D5", borderRadius: 10, fontSize: 13, textAlign: "center" },
};