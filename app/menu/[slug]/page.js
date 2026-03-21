"use client";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { ALLERGENS, AllergenIcon } from "@/lib/allergens-db";
import { useParams } from "next/navigation";

const LANGUAGES = {
  fr: { label: "Français",    code: "FR", bg: "#003189", color: "white" },
  en: { label: "English",     code: "EN", bg: "#C8102E", color: "white" },
  es: { label: "Español",     code: "ES", bg: "#AA151B", color: "white" },
  de: { label: "Deutsch",     code: "DE", bg: "#000000", color: "#FFD700" },
  it: { label: "Italiano",    code: "IT", bg: "#009246", color: "white" },
  nl: { label: "Nederlands",  code: "NL", bg: "#AE1C28", color: "white" },
  ja: { label: "日本語",       code: "JP", bg: "#BC002D", color: "white" },
  zh: { label: "中文",         code: "ZH", bg: "#DE2910", color: "#FFDE00" },
};

// ── Noms d'allergènes traduits en dur — zéro appel API ────────────────────────
const ALLERGEN_NAMES = {
  fr: { gluten:"Gluten", crustaces:"Crustacés", oeufs:"Œufs", poissons:"Poissons", arachides:"Arachides", soja:"Soja", lait:"Lait", fruits_coq:"Fruits à coque", celeri:"Céleri", moutarde:"Moutarde", sesame:"Sésame", so2:"SO₂/Sulfites", lupin:"Lupin", mollusques:"Mollusques" },
  en: { gluten:"Gluten", crustaces:"Crustaceans", oeufs:"Eggs", poissons:"Fish", arachides:"Peanuts", soja:"Soy", lait:"Milk", fruits_coq:"Tree nuts", celeri:"Celery", moutarde:"Mustard", sesame:"Sesame", so2:"Sulphites", lupin:"Lupin", mollusques:"Molluscs" },
  es: { gluten:"Gluten", crustaces:"Crustáceos", oeufs:"Huevos", poissons:"Pescado", arachides:"Cacahuetes", soja:"Soja", lait:"Leche", fruits_coq:"Frutos secos", celeri:"Apio", moutarde:"Mostaza", sesame:"Sésamo", so2:"Sulfitos", lupin:"Altramuz", mollusques:"Moluscos" },
  de: { gluten:"Gluten", crustaces:"Krebstiere", oeufs:"Eier", poissons:"Fisch", arachides:"Erdnüsse", soja:"Soja", lait:"Milch", fruits_coq:"Schalenfrüchte", celeri:"Sellerie", moutarde:"Senf", sesame:"Sesam", so2:"Sulfite", lupin:"Lupinen", mollusques:"Weichtiere" },
  it: { gluten:"Glutine", crustaces:"Crostacei", oeufs:"Uova", poissons:"Pesce", arachides:"Arachidi", soja:"Soia", lait:"Latte", fruits_coq:"Frutta a guscio", celeri:"Sedano", moutarde:"Senape", sesame:"Sesamo", so2:"Solfiti", lupin:"Lupini", mollusques:"Molluschi" },
  nl: { gluten:"Gluten", crustaces:"Schaaldieren", oeufs:"Eieren", poissons:"Vis", arachides:"Pinda's", soja:"Soja", lait:"Melk", fruits_coq:"Noten", celeri:"Selderij", moutarde:"Mosterd", sesame:"Sesam", so2:"Sulfieten", lupin:"Lupine", mollusques:"Weekdieren" },
  ja: { gluten:"グルテン", crustaces:"甲殻類", oeufs:"卵", poissons:"魚", arachides:"落花生", soja:"大豆", lait:"乳", fruits_coq:"木の実", celeri:"セロリ", moutarde:"からし", sesame:"ごま", so2:"亜硫酸塩", lupin:"ルーピン", mollusques:"軟体動物" },
  zh: { gluten:"麸质", crustaces:"甲壳类", oeufs:"鸡蛋", poissons:"鱼类", arachides:"花生", soja:"大豆", lait:"乳制品", fruits_coq:"坚果", celeri:"芹菜", moutarde:"芥末", sesame:"芝麻", so2:"亚硫酸盐", lupin:"羽扇豆", mollusques:"软体动物" },
};

const CATEGORY_LABELS = {
  fr: { entree:"Entrées", plat:"Plats", dessert:"Desserts", boisson:"Boissons", autre:"Autres" },
  en: { entree:"Starters", plat:"Main courses", dessert:"Desserts", boisson:"Drinks", autre:"Other" },
  es: { entree:"Entrantes", plat:"Platos principales", dessert:"Postres", boisson:"Bebidas", autre:"Otros" },
  de: { entree:"Vorspeisen", plat:"Hauptgerichte", dessert:"Desserts", boisson:"Getränke", autre:"Sonstiges" },
  it: { entree:"Antipasti", plat:"Piatti principali", dessert:"Dolci", boisson:"Bevande", autre:"Altro" },
  nl: { entree:"Voorgerechten", plat:"Hoofdgerechten", dessert:"Desserts", boisson:"Dranken", autre:"Overige" },
  ja: { entree:"前菜", plat:"メインコース", dessert:"デザート", boisson:"ドリンク", autre:"その他" },
  zh: { entree:"前菜", plat:"主菜", dessert:"甜点", boisson:"饮品", autre:"其他" },
};

const UI_TEXT = {
  fr: { allergTitle:"Mes allergies", allergSub:"Sélectionnez vos allergènes pour filtrer la carte", incompatible:"Contient vos allergènes", clearFilters:"Effacer les filtres", poweredBy:"Carte allergènes propulsée par", loading:"Chargement de la carte...", notFound:"Menu introuvable ou désactivé." },
  en: { allergTitle:"My allergies", allergSub:"Select your allergens to filter the menu", incompatible:"Contains your allergens", clearFilters:"Clear filters", poweredBy:"Allergen menu powered by", loading:"Loading menu...", notFound:"Menu not found or disabled." },
  es: { allergTitle:"Mis alergias", allergSub:"Seleccione sus alérgenos para filtrar la carta", incompatible:"Contiene sus alérgenos", clearFilters:"Borrar filtros", poweredBy:"Carta alérgenos impulsada por", loading:"Cargando carta...", notFound:"Menú no encontrado." },
  de: { allergTitle:"Meine Allergien", allergSub:"Wählen Sie Ihre Allergene, um die Karte zu filtern", incompatible:"Enthält Ihre Allergene", clearFilters:"Filter löschen", poweredBy:"Allergenkarte bereitgestellt von", loading:"Karte wird geladen...", notFound:"Menü nicht gefunden." },
  it: { allergTitle:"Le mie allergie", allergSub:"Seleziona i tuoi allergeni per filtrare il menu", incompatible:"Contiene i tuoi allergeni", clearFilters:"Cancella filtri", poweredBy:"Menu allergeni offerto da", loading:"Caricamento menu...", notFound:"Menu non trovato." },
  nl: { allergTitle:"Mijn allergieën", allergSub:"Selecteer uw allergenen om de kaart te filteren", incompatible:"Bevat uw allergenen", clearFilters:"Filters wissen", poweredBy:"Allergenenkaart aangedreven door", loading:"Menu laden...", notFound:"Menu niet gevonden." },
  ja: { allergTitle:"アレルギー選択", allergSub:"アレルゲンを選択してメニューをフィルタリング", incompatible:"アレルゲンを含む", clearFilters:"フィルターをクリア", poweredBy:"アレルゲンメニュー提供：", loading:"メニューを読み込み中...", notFound:"メニューが見つかりません。" },
  zh: { allergTitle:"我的过敏原", allergSub:"选择您的过敏原以筛选菜单", incompatible:"含有您的过敏原", clearFilters:"清除筛选", poweredBy:"过敏原菜单由以下提供：", loading:"正在加载菜单...", notFound:"菜单未找到。" },
};

const CATEGORY_ORDER = ["entree", "plat", "dessert", "boisson", "autre"];

export default function MenuPage() {
  const params = useParams();
  const slug = params?.slug;

  const [establishment, setEst]     = useState(null);
  const [recipes, setRecipes]       = useState([]);
  const [lang, setLang]             = useState("fr");
  const [selectedAllergens, setSel] = useState(new Set());
  const [dietFilter, setDietFilter] = useState("all"); // "all" | "vegetarian" | "vegan"
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(null); // null | true | "unavailable"
  const supabase = createClient();

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data: menuData } = await supabase
        .from("menus")
        .select("*, establishments(*)")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (!menuData) { setNotFound(true); setLoading(false); return; }
      setEst({ ...menuData.establishments });
      setEst(menuData.establishments);

      // Récupère aussi le statut de l'abonnement
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("status, trial_ends_at")
        .eq("user_id", menuData.establishments.user_id)
        .single();

      const now = new Date();
      const trialEndsAt = subData?.trial_ends_at ? new Date(subData.trial_ends_at) : null;
      const isTrialing = subData?.status === "trialing" && trialEndsAt && trialEndsAt > now;
      const isActive = subData?.status === "active";
      const isFree = !subData?.status || subData?.status === "free";

      if (!isTrialing && !isActive && !isFree) {
        setNotFound("unavailable");
        setLoading(false);
        return;
      }

      const { data: recipesData } = await supabase
        .from("recipes")
        .select("id, dish_name, category, ingredients, allergens, translations_cache, is_vegan, is_vegetarian, meat_certification")
        .eq("establishment_id", menuData.establishment_id)
        .order("category")
        .order("dish_name");

      setRecipes(recipesData ?? []);
      setLoading(false);
    })();
  }, [slug]);

  function toggleAllergen(id) {
    setSel((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Lit depuis le cache JSON — zéro appel API
  function getDisplayName(recipe) {
    if (lang === "fr") return recipe.dish_name;
    return recipe.translations_cache?.[lang]?.dish_name || recipe.dish_name;
  }

  function getDisplayIngredients(recipe) {
    if (lang === "fr") return recipe.ingredients ?? [];
    return recipe.translations_cache?.[lang]?.ingredients || recipe.ingredients || [];
  }

  function isIncompatible(recipe) {
    if (!selectedAllergens.size) return false;
    return recipe.allergens?.some((a) => selectedAllergens.has(a));
  }

  const grouped = useMemo(() => {
    const groups = {};
    CATEGORY_ORDER.forEach((cat) => { groups[cat] = []; });
    recipes.forEach((r) => {
      if (dietFilter === "vegetarian" && !r.is_vegetarian && !r.is_vegan) return;
      if (dietFilter === "vegan" && !r.is_vegan) return;
      const cat = r.category || "plat";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(r);
    });
    return groups;
  }, [recipes, dietFilter]);

  const ui = UI_TEXT[lang] || UI_TEXT.fr;
  const catLabels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.fr;
  const allergenNames = ALLERGEN_NAMES[lang] || ALLERGEN_NAMES.fr;

  if (loading) return (
    <div style={s.loadPage}>
      <div style={s.spinner} />
      <p style={{ color: "#999", fontSize: 13, marginTop: 16, fontFamily: "Inter, sans-serif" }}>
        {UI_TEXT[lang]?.loading || "Chargement..."}
      </p>
    </div>
  );

  if (notFound === "unavailable") return (
    <div style={s.loadPage}>
      <div style={{ textAlign: "center", padding: "0 20px" }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>🔒</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px", fontFamily: "Inter, sans-serif" }}>Carte temporairement indisponible</p>
        <p style={{ fontSize: 14, color: "#888", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}>
          Cette carte allergènes n'est pas disponible pour le moment.<br />
          Veuillez contacter directement le restaurant pour toute information sur les allergènes.
        </p>
      </div>
    </div>
  );

  if (notFound) return (
    <div style={s.loadPage}>
      <p style={{ fontSize: 48, marginBottom: 12 }}>404</p>
      <p style={{ fontSize: 14, color: "#999", fontFamily: "Inter, sans-serif" }}>{ui.notFound}</p>
    </div>
  );

  // Vérifie si l'abonnement du restaurateur est actif
  const subStatus = establishment?.sub_status;
  const isUnavailable = subStatus === "canceled" || subStatus === "expired";

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <p style={s.estName}>{establishment?.name}</p>
        <div style={s.langRow}>
          {Object.entries(LANGUAGES).map(([code, info]) => (
            <button key={code}
              onClick={() => setLang(code)}
              title={info.label}
              style={{
                width: 38, height: 38, borderRadius: 9,
                background: lang === code ? info.bg : "rgba(255,255,255,0.12)",
                color: lang === code ? info.color : "rgba(255,255,255,0.6)",
                border: lang === code ? `2px solid ${info.bg}` : "1.5px solid rgba(255,255,255,0.15)",
                cursor: "pointer", fontSize: 11, fontWeight: 800,
                fontFamily: "'Inter', sans-serif", letterSpacing: "0.03em",
                transition: "all 0.15s",
              }}>
              {info.code}
            </button>
          ))}
        </div>
      </div>

      {/* Sélecteur allergènes — noms traduits en dur */}
      <div style={s.allergenSection}>
        <p style={s.allergenTitle}>{ui.allergTitle}</p>
        <p style={s.allergenSub}>{ui.allergSub}</p>
        <div style={s.allergenGrid}>
          {ALLERGENS.map((a) => {
            const active = selectedAllergens.has(a.id);
            return (
              <button key={a.id}
                style={{ ...s.allergenBtn, ...(active ? { background: a.color, borderColor: a.text, borderWidth: "1.5px" } : {}) }}
                onClick={() => toggleAllergen(a.id)}>
                <AllergenIcon id={a.id} size={22} color={active ? a.text : "#999"} />
                <span style={{ fontSize: 9, fontWeight: 700, textAlign: "center", lineHeight: 1.3, color: active ? a.text : "#777" }}>
                  {allergenNames[a.id] || a.label}
                </span>
              </button>
            );
          })}
        </div>
        {selectedAllergens.size > 0 && (
          <button style={s.clearBtn} onClick={() => setSel(new Set())}>
            × {ui.clearFilters}
          </button>
        )}

        {/* Filtre régime alimentaire */}
        {recipes.some(r => r.is_vegetarian || r.is_vegan) && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {[
              { key: "all", label: "Tous les plats" },
              { key: "vegetarian", label: "Végétarien" },
              { key: "vegan", label: "Vegan" },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setDietFilter(key)}
                style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20, cursor: "pointer", transition: "all 0.15s",
                  background: dietFilter === key ? "#1A1A1A" : "white",
                  color: dietFilter === key ? "white" : "#666",
                  border: dietFilter === key ? "1.5px solid #1A1A1A" : "1.5px solid #E0E0E0",
                }}>
                {label}
              </button>
            ))}
          </div>
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
                return (
                  <div key={recipe.id} style={{ ...s.recipeCard, ...(incompatible ? s.recipeCardIncompat : {}) }}>
                    <div style={s.recipeTop}>
                      <p style={{ ...s.recipeName, ...(incompatible ? { color: "#999" } : {}) }}>
                        {getDisplayName(recipe)}
                      </p>
                      {incompatible && (
                        <div style={s.warningBadge}>
                          <span>⚠️</span>
                          <span style={{ fontSize: 11, fontWeight: 600 }}>{ui.incompatible}</span>
                        </div>
                      )}
                    </div>

                    {getDisplayIngredients(recipe).length > 0 && (
                      <p style={{ ...s.recipeIngredients, ...(incompatible ? { color: "#CCC" } : {}) }}>
                        {getDisplayIngredients(recipe).join(", ")}
                      </p>
                    )}

                    {/* Pastilles régime */}
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: recipe.allergens?.length > 0 ? 6 : 0 }}>
                      {recipe.is_vegan && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#F0FFF4", color: "#155724", border: "1px solid #C6F6D5" }}>Vegan</span>
                      )}
                      {recipe.is_vegetarian && !recipe.is_vegan && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#F0FFF4", color: "#155724", border: "1px solid #C6F6D5" }}>Végétarien</span>
                      )}
                      {recipe.meat_certification && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#F7F7F5", color: "#555", border: "1px solid #E0E0E0" }}>
                          {recipe.meat_certification === "halal" ? "Halal" : recipe.meat_certification === "casher" ? "Casher" : recipe.meat_certification === "label_rouge" ? "Label Rouge" : "Bio"}
                        </span>
                      )}
                    </div>

                    {recipe.allergens?.length > 0 && (
                      <div style={s.recipePills}>
                        {recipe.allergens.map((id) => {
                          const a = ALLERGENS.find((x) => x.id === id);
                          if (!a) return null;
                          const mine = selectedAllergens.has(id);
                          return (
                            <span key={id} style={{
                              ...s.pill,
                              background: mine ? "#FFE0E0" : a.color,
                              color: mine ? "#842029" : a.text,
                              border: mine ? "1px solid #FF9999" : "none",
                              fontWeight: mine ? 700 : 500,
                              display: "inline-flex", alignItems: "center", gap: 4,
                            }}>
                              <AllergenIcon id={id} size={11} color={mine ? "#842029" : a.text} />
                              {allergenNames[id] || a.label}
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

      <div style={s.footer}>
        <p style={s.footerText}>{ui.poweredBy}</p>
        <p style={s.footerBrand}>🛡️ MenuSafe</p>
        <p style={s.footerLegal}>Conforme règlement UE n°1169/2011 (INCO)</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 600, margin: "0 auto" },
  loadPage: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  spinner: { width: 32, height: 32, border: "3px solid #F0F0F0", borderTop: "3px solid #1A1A1A", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header: { background: "#1A1A1A", padding: "20px 16px 16px" },
  estName: { fontSize: 20, fontWeight: 800, color: "white", margin: "0 0 12px", letterSpacing: "-0.02em" },
  langRow: { display: "flex", gap: 6, flexWrap: "wrap" },
  langBtn: { width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  langBtnActive: { background: "white", border: "1px solid white" },
  allergenSection: { background: "white", padding: "16px", borderBottom: "1px solid #EBEBEB" },
  allergenTitle: { fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" },
  allergenSub: { fontSize: 12, color: "#888", margin: "0 0 12px", lineHeight: 1.4 },
  allergenGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 },
  allergenBtn: { display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 4px", borderRadius: 12, border: "1px solid #E8E8E8", background: "white", cursor: "pointer", transition: "all 0.15s" },
  clearBtn: { marginTop: 10, fontSize: 12, fontWeight: 600, color: "#888", background: "none", border: "none", cursor: "pointer", padding: 0 },
  menuBody: { padding: "12px 16px 32px" },
  category: { marginBottom: 24 },
  categoryTitle: { fontSize: 13, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #E8E8E8" },
  recipeCard: { background: "white", borderRadius: 14, padding: "14px", marginBottom: 8, border: "1px solid #EBEBEB" },
  recipeCardIncompat: { background: "#F9F9F9", border: "1px solid #F0F0F0", opacity: 0.65 },
  recipeTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 },
  recipeName: { fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: 0, flex: 1 },
  warningBadge: { display: "inline-flex", alignItems: "center", gap: 4, background: "#FFF3CD", color: "#856404", border: "1px solid #FDDEA0", borderRadius: 20, padding: "3px 8px", flexShrink: 0 },
  recipeIngredients: { fontSize: 12, color: "#888", margin: "0 0 8px", lineHeight: 1.5 },
  recipePills: { display: "flex", flexWrap: "wrap", gap: 4 },
  pill: { fontSize: 11, padding: "3px 8px", borderRadius: 20 },
  footer: { padding: "20px 16px", textAlign: "center", borderTop: "1px solid #EBEBEB" },
  footerText: { fontSize: 11, color: "#CCC", margin: "0 0 2px" },
  footerBrand: { fontSize: 13, fontWeight: 700, color: "#888", margin: "0 0 4px" },
  footerLegal: { fontSize: 10, color: "#CCC", margin: 0 },
};