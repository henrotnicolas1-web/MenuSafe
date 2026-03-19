"use client";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { ALLERGENS } from "@/lib/allergens-db";

const LANGUAGES = {
  fr: { label: "Français", flag: "🇫🇷" },
  en: { label: "English", flag: "🇬🇧" },
  es: { label: "Español", flag: "🇪🇸" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  it: { label: "Italiano", flag: "🇮🇹" },
  nl: { label: "Nederlands", flag: "🇳🇱" },
  ja: { label: "日本語", flag: "🇯🇵" },
  zh: { label: "中文", flag: "🇨🇳" },
};

const CATEGORY_LABELS = {
  fr: { entree: "Entrées", plat: "Plats", dessert: "Desserts", boisson: "Boissons", autre: "Autres" },
  en: { entree: "Starters", plat: "Main courses", dessert: "Desserts", boisson: "Drinks", autre: "Other" },
  es: { entree: "Entrantes", plat: "Platos principales", dessert: "Postres", boisson: "Bebidas", autre: "Otros" },
  de: { entree: "Vorspeisen", plat: "Hauptgerichte", dessert: "Desserts", boisson: "Getränke", autre: "Sonstiges" },
  it: { entree: "Antipasti", plat: "Piatti principali", dessert: "Dolci", boisson: "Bevande", autre: "Altro" },
  nl: { entree: "Voorgerechten", plat: "Hoofdgerechten", dessert: "Desserts", boisson: "Dranken", autre: "Overige" },
  ja: { entree: "前菜", plat: "メインコース", dessert: "デザート", boisson: "ドリンク", autre: "その他" },
  zh: { entree: "前菜", plat: "主菜", dessert: "甜点", boisson: "饮品", autre: "其他" },
};

const ALLERGEN_UI = {
  fr: { title: "Mes allergies", subtitle: "Sélectionnez vos allergènes pour filtrer la carte", compatible: "Compatible", incompatible: "Contient vos allergènes", poweredBy: "Carte allergènes propulsée par" },
  en: { title: "My allergies", subtitle: "Select your allergens to filter the menu", compatible: "Compatible", incompatible: "Contains your allergens", poweredBy: "Allergen menu powered by" },
  es: { title: "Mis alergias", subtitle: "Seleccione sus alérgenos para filtrar la carta", compatible: "Compatible", incompatible: "Contiene sus alérgenos", poweredBy: "Carta alérgenos impulsada por" },
  de: { title: "Meine Allergien", subtitle: "Wählen Sie Ihre Allergene, um die Karte zu filtern", compatible: "Verträglich", incompatible: "Enthält Ihre Allergene", poweredBy: "Allergenkarte bereitgestellt von" },
  it: { title: "Le mie allergie", subtitle: "Seleziona i tuoi allergeni per filtrare il menu", compatible: "Compatibile", incompatible: "Contiene i tuoi allergeni", poweredBy: "Menu allergeni offerto da" },
  nl: { title: "Mijn allergieën", subtitle: "Selecteer uw allergenen om de kaart te filteren", compatible: "Geschikt", incompatible: "Bevat uw allergenen", poweredBy: "Allergenenkaart aangedreven door" },
  ja: { title: "アレルギー選択", subtitle: "アレルゲンを選択してメニューをフィルタリング", compatible: "対応可能", incompatible: "アレルゲンを含む", poweredBy: "アレルゲンメニュー提供：" },
  zh: { title: "我的过敏原", subtitle: "选择您的过敏原以筛选菜单", compatible: "适合", incompatible: "含有您的过敏原", poweredBy: "过敏原菜单由以下提供：" },
};

const CATEGORY_ORDER = ["entree", "plat", "dessert", "boisson", "autre"];

export default function MenuPage({ params }) {
  const [menu, setMenu]               = useState(null);
  const [establishment, setEst]       = useState(null);
  const [recipes, setRecipes]         = useState([]);
  const [translations, setTrans]      = useState({});
  const [lang, setLang]               = useState("fr");
  const [selectedAllergens, setSel]   = useState(new Set());
  const [loading, setLoading]         = useState(true);
  const [translating, setTranslating] = useState(false);
  const [notFound, setNotFound]       = useState(false);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      // Récupère le menu par slug
      const { data: menu } = await supabase
        .from("menus")
        .select("*, establishments(*)")
        .eq("slug", params.slug)
        .eq("published", true)
        .single();

      if (!menu) { setNotFound(true); setLoading(false); return; }
      setMenu(menu);
      setEst(menu.establishments);

      // Récupère les recettes de l'établissement
      const { data: recipes } = await supabase
        .from("recipes")
        .select("*")
        .eq("establishment_id", menu.establishment_id)
        .order("category")
        .order("dish_name");

      setRecipes(recipes ?? []);
      setLoading(false);
    })();
  }, [params.slug]);

  // Chargement/génération des traductions
  useEffect(() => {
    if (lang === "fr" || !recipes.length) return;

    // Vérifie si on a déjà la traduction en cache local
    if (translations[lang]) return;

    (async () => {
      setTranslating(true);
      try {
        // Essaie d'abord depuis Supabase
        const { data: stored } = await supabase
          .from("translations")
          .select("*")
          .in("recipe_id", recipes.map((r) => r.id))
          .eq("language", lang);

        if (stored && stored.length === recipes.length) {
          const map = {};
          stored.forEach((t) => { map[t.recipe_id] = { dishName: t.dish_name, ingredients: t.ingredients }; });
          setTrans((p) => ({ ...p, [lang]: map }));
          setTranslating(false);
          return;
        }

        // Sinon appel API Claude
        const res = await fetch("/api/translate-menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipes, targetLanguage: lang }),
        });
        const data = await res.json();
        if (data.translations) {
          const map = {};
          data.translations.forEach((t) => { map[t.id] = { dishName: t.dishName, ingredients: t.ingredients }; });
          setTrans((p) => ({ ...p, [lang]: map }));

          // Sauvegarde en Supabase pour la prochaine fois
          const rows = data.translations.map((t) => ({
            recipe_id: t.id, language: lang,
            dish_name: t.dishName, ingredients: t.ingredients,
          }));
          await supabase.from("translations").upsert(rows, { onConflict: "recipe_id,language" });
        }
      } catch (err) {
        console.error("Translation error:", err);
      }
      setTranslating(false);
    })();
  }, [lang, recipes]);

  function toggleAllergen(id) {
    setSel((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function getDisplayName(recipe) {
    if (lang === "fr" || !translations[lang]?.[recipe.id]) return recipe.dish_name;
    return translations[lang][recipe.id].dishName;
  }

  function getDisplayIngredients(recipe) {
    if (lang === "fr" || !translations[lang]?.[recipe.id]) return recipe.ingredients ?? [];
    return translations[lang][recipe.id].ingredients ?? [];
  }

  function isIncompatible(recipe) {
    if (!selectedAllergens.size) return false;
    return recipe.allergens?.some((a) => selectedAllergens.has(a));
  }

  // Groupement par catégorie
  const grouped = useMemo(() => {
    const groups = {};
    CATEGORY_ORDER.forEach((cat) => { groups[cat] = []; });
    recipes.forEach((r) => {
      const cat = r.category || "plat";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(r);
    });
    return groups;
  }, [recipes]);

  const ui = ALLERGEN_UI[lang] || ALLERGEN_UI.fr;
  const catLabels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.fr;

  if (loading) return (
    <div style={s.loadPage}>
      <div style={s.spinner} />
    </div>
  );

  if (notFound) return (
    <div style={s.loadPage}>
      <p style={{ fontSize: 32, marginBottom: 12 }}>404</p>
      <p style={{ fontSize: 14, color: "#999" }}>Menu introuvable ou désactivé.</p>
    </div>
  );

  return (
    <div style={s.page}>
      {/* Header établissement */}
      <div style={s.header}>
        <p style={s.estName}>{establishment?.name}</p>

        {/* Sélecteur de langue */}
        <div style={s.langRow}>
          {Object.entries(LANGUAGES).map(([code, info]) => (
            <button
              key={code}
              style={{ ...s.langBtn, ...(lang === code ? s.langBtnActive : {}) }}
              onClick={() => setLang(code)}
              title={info.label}
            >
              <span style={{ fontSize: 16 }}>{info.flag}</span>
            </button>
          ))}
        </div>

        {translating && (
          <div style={s.translatingBanner}>
            <div style={{ ...s.spinner, width: 14, height: 14, borderWidth: 2, margin: 0 }} />
            <span>Traduction en cours...</span>
          </div>
        )}
      </div>

      {/* Sélecteur allergènes */}
      <div style={s.allergenSection}>
        <p style={s.allergenTitle}>{ui.title}</p>
        <p style={s.allergenSub}>{ui.subtitle}</p>
        <div style={s.allergenGrid}>
          {ALLERGENS.map((a) => {
            const active = selectedAllergens.has(a.id);
            return (
              <button
                key={a.id}
                style={{ ...s.allergenBtn, ...(active ? { ...s.allergenBtnActive, background: a.color, borderColor: a.text, color: a.text } : {}) }}
                onClick={() => toggleAllergen(a.id)}
              >
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>
        {selectedAllergens.size > 0 && (
          <button style={s.clearBtn} onClick={() => setSel(new Set())}>
            × Effacer les filtres
          </button>
        )}
      </div>

      {/* Carte par catégorie */}
      <div style={s.menuBody}>
        {CATEGORY_ORDER.map((cat) => {
          const items = grouped[cat];
          if (!items?.length) return null;
          return (
            <div key={cat} style={s.category}>
              <p style={s.categoryTitle}>{catLabels[cat]}</p>
              {items.map((recipe) => {
                const incompatible = isIncompatible(recipe);
                const ingredients = getDisplayIngredients(recipe);
                const name = getDisplayName(recipe);
                return (
                  <div
                    key={recipe.id}
                    style={{
                      ...s.recipeCard,
                      ...(incompatible ? s.recipeCardIncompat : {}),
                    }}
                  >
                    <div style={s.recipeTop}>
                      <p style={{ ...s.recipeName, ...(incompatible ? { color: "#999" } : {}) }}>
                        {name}
                      </p>
                      {incompatible && (
                        <div style={s.warningBadge}>
                          <span style={{ fontSize: 12 }}>⚠️</span>
                          <span style={{ fontSize: 11, fontWeight: 600 }}>{ui.incompatible}</span>
                        </div>
                      )}
                    </div>

                    {/* Ingrédients */}
                    {ingredients.length > 0 && (
                      <p style={{ ...s.recipeIngredients, ...(incompatible ? { color: "#CCC" } : {}) }}>
                        {ingredients.join(", ")}
                      </p>
                    )}

                    {/* Allergènes du plat */}
                    {recipe.allergens?.length > 0 && (
                      <div style={s.recipePills}>
                        {recipe.allergens.map((id) => {
                          const a = ALLERGENS.find((x) => x.id === id);
                          if (!a) return null;
                          const isMyAllergen = selectedAllergens.has(id);
                          return (
                            <span
                              key={id}
                              style={{
                                ...s.pill,
                                background: isMyAllergen ? "#FFE0E0" : a.color,
                                color: isMyAllergen ? "#842029" : a.text,
                                border: isMyAllergen ? "1px solid #FF9999" : "none",
                                fontWeight: isMyAllergen ? 700 : 500,
                              }}
                            >
                              {a.icon} {a.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <p style={s.footerText}>{ui.poweredBy}</p>
        <p style={s.footerBrand}>🛡️ MenuSafe</p>
        <p style={s.footerLegal}>Conforme règlement UE n°1169/2011 (INCO)</p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 600, margin: "0 auto" },
  loadPage: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" },
  spinner: { width: 32, height: 32, border: "3px solid #F0F0F0", borderTop: "3px solid #1A1A1A", borderRadius: "50%", animation: "spin 0.8s linear infinite" },

  // Header
  header: { background: "#1A1A1A", padding: "20px 16px 16px" },
  estName: { fontSize: 20, fontWeight: 800, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" },
  langRow: { display: "flex", gap: 6, flexWrap: "wrap" },
  langBtn: { width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  langBtnActive: { background: "white", border: "1px solid white" },
  translatingBanner: { display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.6)" },

  // Allergènes
  allergenSection: { background: "white", padding: "16px", borderBottom: "1px solid #EBEBEB" },
  allergenTitle: { fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" },
  allergenSub: { fontSize: 12, color: "#888", margin: "0 0 12px", lineHeight: 1.4 },
  allergenGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 },
  allergenBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 4px", borderRadius: 10, border: "1px solid #E8E8E8", background: "white", cursor: "pointer", transition: "all 0.15s" },
  allergenBtnActive: { border: "1.5px solid" },
  clearBtn: { marginTop: 10, fontSize: 12, fontWeight: 600, color: "#888", background: "none", border: "none", cursor: "pointer", padding: 0 },

  // Menu
  menuBody: { padding: "12px 16px 32px" },
  category: { marginBottom: 24 },
  categoryTitle: { fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #E8E8E8" },
  recipeCard: { background: "white", borderRadius: 14, padding: "14px", marginBottom: 8, border: "1px solid #EBEBEB" },
  recipeCardIncompat: { background: "#F9F9F9", border: "1px solid #F0F0F0", opacity: 0.7 },
  recipeTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 },
  recipeName: { fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: 0, flex: 1 },
  warningBadge: { display: "inline-flex", alignItems: "center", gap: 4, background: "#FFF3CD", color: "#856404", border: "1px solid #FDDEA0", borderRadius: 20, padding: "3px 8px", flexShrink: 0 },
  recipeIngredients: { fontSize: 12, color: "#888", margin: "0 0 8px", lineHeight: 1.5 },
  recipePills: { display: "flex", flexWrap: "wrap", gap: 4 },
  pill: { fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 20 },

  // Footer
  footer: { padding: "20px 16px", textAlign: "center", borderTop: "1px solid #EBEBEB" },
  footerText: { fontSize: 11, color: "#CCC", margin: "0 0 2px" },
  footerBrand: { fontSize: 13, fontWeight: 700, color: "#888", margin: "0 0 4px" },
  footerLegal: { fontSize: 10, color: "#CCC", margin: 0 },
};