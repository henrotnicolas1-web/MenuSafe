"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { ALLERGENS, AllergenIcon } from "@/lib/allergens-db";
import { useParams } from "next/navigation";

const LANGUAGES = {
  fr: { label: "Français",   code: "FR", flag: "🇫🇷" },
  en: { label: "English",    code: "EN", flag: "🇬🇧" },
  es: { label: "Español",    code: "ES", flag: "🇪🇸" },
  de: { label: "Deutsch",    code: "DE", flag: "🇩🇪" },
  it: { label: "Italiano",   code: "IT", flag: "🇮🇹" },
  nl: { label: "Nederlands", code: "NL", flag: "🇳🇱" },
  ja: { label: "日本語",      code: "JP", flag: "🇯🇵" },
  zh: { label: "中文",        code: "ZH", flag: "🇨🇳" },
};

const ALLERGEN_NAMES = {
  fr: { gluten:"Gluten", crustaces:"Crustacés", oeufs:"Œufs", poissons:"Poissons", arachides:"Arachides", soja:"Soja", lait:"Lait", fruits_coq:"Fruits à coque", celeri:"Céleri", moutarde:"Moutarde", sesame:"Sésame", so2:"Sulfites", lupin:"Lupin", mollusques:"Mollusques" },
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
  fr: { allergTitle:"Mes allergies", allergSub:"Touchez vos allergènes pour filtrer", incompatible:"Contient vos allergènes", clearFilters:"Effacer", poweredBy:"Carte allergènes propulsée par", loading:"Chargement...", notFound:"Menu introuvable.", search:"Rechercher un plat...", all:"Tous", veg:"Végétarien", vegan:"Vegan", noResult:"Aucun plat ne correspond." },
  en: { allergTitle:"My allergies", allergSub:"Tap allergens to filter", incompatible:"Contains your allergens", clearFilters:"Clear", poweredBy:"Allergen menu powered by", loading:"Loading...", notFound:"Menu not found.", search:"Search a dish...", all:"All", veg:"Vegetarian", vegan:"Vegan", noResult:"No dish matches." },
  es: { allergTitle:"Mis alergias", allergSub:"Toque sus alérgenos para filtrar", incompatible:"Contiene sus alérgenos", clearFilters:"Borrar", poweredBy:"Carta impulsada por", loading:"Cargando...", notFound:"Menú no encontrado.", search:"Buscar un plato...", all:"Todos", veg:"Vegetariano", vegan:"Vegano", noResult:"Ningún plato coincide." },
  de: { allergTitle:"Meine Allergien", allergSub:"Allergene antippen zum Filtern", incompatible:"Enthält Ihre Allergene", clearFilters:"Löschen", poweredBy:"Bereitgestellt von", loading:"Laden...", notFound:"Menü nicht gefunden.", search:"Gericht suchen...", all:"Alle", veg:"Vegetarisch", vegan:"Vegan", noResult:"Kein Gericht gefunden." },
  it: { allergTitle:"Le mie allergie", allergSub:"Tocca gli allergeni per filtrare", incompatible:"Contiene i tuoi allergeni", clearFilters:"Cancella", poweredBy:"Offerto da", loading:"Caricamento...", notFound:"Menu non trovato.", search:"Cerca un piatto...", all:"Tutti", veg:"Vegetariano", vegan:"Vegano", noResult:"Nessun piatto trovato." },
  nl: { allergTitle:"Mijn allergieën", allergSub:"Tik allergenen aan om te filteren", incompatible:"Bevat uw allergenen", clearFilters:"Wissen", poweredBy:"Aangedreven door", loading:"Laden...", notFound:"Menu niet gevonden.", search:"Zoek een gerecht...", all:"Alles", veg:"Vegetarisch", vegan:"Veganistisch", noResult:"Geen gerecht gevonden." },
  ja: { allergTitle:"アレルギー選択", allergSub:"アレルゲンをタップしてフィルター", incompatible:"アレルゲンを含む", clearFilters:"クリア", poweredBy:"提供：", loading:"読み込み中...", notFound:"メニューが見つかりません。", search:"料理を検索...", all:"すべて", veg:"ベジタリアン", vegan:"ビーガン", noResult:"該当する料理がありません。" },
  zh: { allergTitle:"我的过敏原", allergSub:"点击过敏原进行筛选", incompatible:"含有您的过敏原", clearFilters:"清除", poweredBy:"由以下提供：", loading:"加载中...", notFound:"菜单未找到。", search:"搜索菜肴...", all:"全部", veg:"素食", vegan:"纯素", noResult:"未找到匹配的菜肴。" },
};

const CATEGORY_ORDER = ["entree", "plat", "dessert", "boisson", "autre"];

// ── Utilitaires ───────────────────────────────────────────────────────────────

function getDeviceType() {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return "mobile";
  return "desktop";
}

function generateSessionId() {
  // Réutilise la session si déjà générée dans la page (navigation SPA)
  if (typeof window !== "undefined") {
    let sid = sessionStorage.getItem("ms_session_id");
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem("ms_session_id", sid);
    }
    return sid;
  }
  return crypto.randomUUID();
}

// ─────────────────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const params = useParams();
  const slug = params?.slug;

  const [establishment, setEst]     = useState(null);
  const [recipes, setRecipes]       = useState([]);
  const [lang, setLang]             = useState("fr");
  const [selectedAllergens, setSel] = useState(new Set());
  const [dietFilter, setDietFilter] = useState("all");
  const [search, setSearch]         = useState("");
  const [activeTab, setActiveTab]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(null);
  const [langOpen, setLangOpen]     = useState(false);
  const categoryRefs = useRef({});

  // Tracking state
  const scanIdRef      = useRef(null);
  const sessionIdRef   = useRef(null);
  const estIdRef       = useRef(null);

  const supabase = createClient();

  // ── Tracking helpers ────────────────────────────────────────────────────────

  const trackEvent = useCallback(async (event_type, payload) => {
    if (!estIdRef.current || !sessionIdRef.current) return;
    try {
      await supabase.from("qr_events").insert({
        establishment_id: estIdRef.current,
        session_id: sessionIdRef.current,
        event_type,
        payload,
      });
    } catch (_) { /* silencieux — ne jamais bloquer l'UX */ }
  }, []);

  // ── Chargement carte ────────────────────────────────────────────────────────

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
      setEst(menuData.establishments);
      estIdRef.current = menuData.establishments.id;

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
        setNotFound("unavailable"); setLoading(false); return;
      }

      const { data: recipesData } = await supabase
        .from("recipes")
        .select("id, dish_name, category, ingredients, allergens, translations_cache, is_vegan, is_vegetarian, meat_certification")
        .eq("establishment_id", menuData.establishment_id)
        .order("category").order("dish_name");

      setRecipes(recipesData ?? []);
      setLoading(false);

      // ── Enregistre le scan initial ─────────────────────────────────────────
      const sessionId = generateSessionId();
      sessionIdRef.current = sessionId;
      try {
        const { data: scanRow } = await supabase.from("qr_scans").insert({
          establishment_id: menuData.establishments.id,
          session_id: sessionId,
          device_type: getDeviceType(),
        }).select("id").single();
        if (scanRow) scanIdRef.current = scanRow.id;
      } catch (_) {}
    })();
  }, [slug]);

  // ── Changement de langue avec tracking direct ───────────────────────────────
  function handleLangChange(code) {
    setLang(code);
    setLangOpen(false);
    // trackEvent appelé directement — les refs sont garanties prêtes
    // car l'utilisateur ne peut pas changer de langue avant que la carte soit chargée
    trackEvent("lang_change", { lang: code });
  }

  // ── Interactions ─────────────────────────────────────────────────────────────

  function toggleAllergen(id) {
    setSel((prev) => {
      const next = new Set(prev);
      const active = !prev.has(id);
      next.has(id) ? next.delete(id) : next.add(id);
      // Track après le setState
      trackEvent("allergen_toggle", { allergen: id, active });
      return next;
    });
  }

  function handleDietFilter(key) {
    setDietFilter(key);
    trackEvent("diet_filter", { filter: key });
  }

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
    const q = search.toLowerCase().trim();
    recipes.forEach((r) => {
      if (dietFilter === "vegetarian" && !r.is_vegetarian && !r.is_vegan) return;
      if (dietFilter === "vegan" && !r.is_vegan) return;
      if (q && !getDisplayName(r).toLowerCase().includes(q) && !r.dish_name.toLowerCase().includes(q)) return;
      const cat = r.category || "plat";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(r);
    });
    return groups;
  }, [recipes, dietFilter, search, lang]);

  const activeCats = CATEGORY_ORDER.filter(cat => grouped[cat]?.length > 0);

  function scrollToCategory(cat) {
    setActiveTab(cat);
    const el = categoryRefs.current[cat];
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  const ui = UI_TEXT[lang] || UI_TEXT.fr;
  const catLabels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.fr;
  const allergenNames = ALLERGEN_NAMES[lang] || ALLERGEN_NAMES.fr;
  const brandColor = establishment?.brand_color || "#1A1A1A";
  const brandLogo  = establishment?.brand_logo_url || null;

  function hexToLuma(hex) {
    const c = (hex || "#1A1A1A").replace("#", "");
    const r = parseInt(c.substr(0,2),16);
    const g = parseInt(c.substr(2,2),16);
    const b = parseInt(c.substr(4,2),16);
    return 0.299*r + 0.587*g + 0.114*b;
  }
  const brandTextColor = hexToLuma(brandColor) > 128 ? "#1A1A1A" : "#FFFFFF";

  // ── États de chargement / erreur ─────────────────────────────────────────────

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#F7F7F5", fontFamily:"Inter,sans-serif" }}>
      <div style={{ width:32, height:32, border:"3px solid #E8E8E8", borderTop:`3px solid #1A1A1A`, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <p style={{ color:"#999", fontSize:13, marginTop:14 }}>Chargement...</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (notFound === "unavailable") return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#F7F7F5", fontFamily:"Inter,sans-serif", padding:"0 24px", textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
      <p style={{ fontSize:18, fontWeight:800, color:"#1A1A1A", margin:"0 0 8px" }}>Carte temporairement indisponible</p>
      <p style={{ fontSize:14, color:"#888", lineHeight:1.6 }}>Veuillez contacter directement le restaurant<br />pour toute information sur les allergènes.</p>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#F7F7F5", fontFamily:"Inter,sans-serif" }}>
      <p style={{ fontSize:56, fontWeight:800, color:"#E0E0E0", margin:0 }}>404</p>
      <p style={{ fontSize:14, color:"#999", marginTop:8 }}>{ui.notFound}</p>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight:"100vh", background:"#F7F7F5", fontFamily:"'Inter',-apple-system,sans-serif", maxWidth:640, margin:"0 auto" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── HEADER STICKY ── */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:brandColor, boxShadow:"0 2px 12px rgba(0,0,0,0.15)" }}>
        <div style={{ padding:"14px 16px 10px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
            {brandLogo && (
              <img src={brandLogo} alt="Logo"
                style={{ width:34, height:34, borderRadius:8, objectFit:"contain",
                  background:"rgba(255,255,255,0.95)", padding:3, flexShrink:0 }} />
            )}
            <p style={{ fontSize:17, fontWeight:800, color:brandTextColor, margin:0, letterSpacing:"-0.02em",
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {establishment?.name}
            </p>
          </div>

          {/* Sélecteur langue */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <button onClick={() => setLangOpen(o => !o)}
              style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.15)",
                border:"1px solid rgba(255,255,255,0.3)", borderRadius:10, padding:"6px 10px",
                cursor:"pointer", color:brandTextColor, fontSize:13, fontWeight:700 }}>
              <span style={{ fontSize:18, lineHeight:1 }}>{LANGUAGES[lang]?.flag}</span>
              <span>{LANGUAGES[lang]?.code}</span>
              <span style={{ fontSize:10, opacity:0.7 }}>▾</span>
            </button>
            {langOpen && (
              <div style={{ position:"absolute", top:"calc(100% + 6px)", right:0,
                background:"white", borderRadius:14, border:"1px solid #EBEBEB",
                boxShadow:"0 8px 32px rgba(0,0,0,0.12)", padding:6, zIndex:200,
                animation:"slideDown 0.15s ease",
                display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, minWidth:180 }}>
                {Object.entries(LANGUAGES).map(([code, l]) => (
                  <button key={code}
                    onClick={() => handleLangChange(code)}
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px",
                      borderRadius:9, border:"none", cursor:"pointer", textAlign:"left",
                      background: lang === code ? "#F7F7F5" : "transparent",
                      fontWeight: lang === code ? 700 : 500,
                      fontSize:13, color:"#1A1A1A" }}>
                    <span style={{ fontSize:20 }}>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ALLERGÈNES ── */}
      <div style={{ background:"white", borderBottom:"1px solid #EBEBEB", padding:"16px 16px 12px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
          <p style={{ fontSize:14, fontWeight:700, color:"#1A1A1A", margin:0 }}>{ui.allergTitle}</p>
          {selectedAllergens.size > 0 && (
            <button onClick={() => { setSel(new Set()); }}
              style={{ fontSize:12, fontWeight:700, color:"#888", background:"#F0F0F0",
                border:"none", borderRadius:20, padding:"4px 12px", cursor:"pointer" }}>
              × {ui.clearFilters} ({selectedAllergens.size})
            </button>
          )}
        </div>
        <p style={{ fontSize:12, color:"#AAA", margin:"0 0 12px" }}>{ui.allergSub}</p>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:6 }}>
          {ALLERGENS.map((a) => {
            const active = selectedAllergens.has(a.id);
            return (
              <button key={a.id} onClick={() => toggleAllergen(a.id)}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                  padding:"8px 2px 6px", borderRadius:10,
                  border: active ? `2px solid ${a.text}` : "1.5px solid #EBEBEB",
                  background: active ? a.color : "white",
                  cursor:"pointer", transition:"all 0.12s",
                  transform: active ? "scale(1.05)" : "scale(1)" }}>
                <AllergenIcon id={a.id} size={20} color={active ? a.text : "#BBBBBB"} />
                <span style={{ fontSize:8.5, fontWeight:active ? 700 : 500,
                  textAlign:"center", lineHeight:1.2, color: active ? a.text : "#999" }}>
                  {allergenNames[a.id] || a.label}
                </span>
              </button>
            );
          })}
        </div>

        {recipes.some(r => r.is_vegetarian || r.is_vegan) && (
          <div style={{ display:"flex", gap:6, marginTop:12 }}>
            {[
              { key:"all", label: ui.all },
              { key:"vegetarian", label: ui.veg },
              { key:"vegan", label: ui.vegan },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => handleDietFilter(key)}
                style={{ fontSize:12, fontWeight:700, padding:"5px 14px", borderRadius:20, cursor:"pointer",
                  background: dietFilter === key ? brandColor : "white",
                  color: dietFilter === key ? brandTextColor : "#666",
                  border: dietFilter === key ? `1.5px solid ${brandColor}` : "1.5px solid #E0E0E0",
                  transition:"all 0.12s" }}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── SEARCH ── */}
      <div style={{ background:"white", borderBottom:"1px solid #EBEBEB", padding:"10px 16px" }}>
        <div style={{ position:"relative" }}>
          <svg style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BBBBBB" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={ui.search}
            style={{ width:"100%", padding:"10px 12px 10px 36px", fontSize:14,
              border:"1.5px solid #EBEBEB", borderRadius:10, outline:"none",
              background:"#FAFAFA", color:"#1A1A1A", fontFamily:"inherit" }}
            onFocus={e => e.target.style.borderColor = brandColor}
            onBlur={e => e.target.style.borderColor = "#EBEBEB"}
          />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", color:"#BBB", fontSize:18, padding:0 }}>×</button>
          )}
        </div>
      </div>

      {/* ── TABS CATÉGORIES ── */}
      {activeCats.length > 1 && (
        <div style={{ position:"sticky", top:62, zIndex:90, background:"white",
          borderBottom:"1px solid #EBEBEB", overflowX:"auto", display:"flex", padding:"0 8px" }}>
          {activeCats.map((cat) => (
            <button key={cat} onClick={() => scrollToCategory(cat)}
              style={{ padding:"11px 14px", fontSize:13, fontWeight:600, whiteSpace:"nowrap",
                border:"none", background:"transparent", cursor:"pointer",
                borderBottom: activeTab === cat ? `2.5px solid ${brandColor}` : "2.5px solid transparent",
                color: activeTab === cat ? brandColor : "#888",
                transition:"all 0.15s", flexShrink:0 }}>
              {catLabels[cat]}
            </button>
          ))}
        </div>
      )}

      {/* ── MENU ── */}
      <div style={{ padding:"12px 16px 48px" }}>
        {selectedAllergens.size > 0 && (
          <div style={{ background:"#FFF8E6", border:"1px solid #FDE68A", borderRadius:10,
            padding:"10px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:16 }}>⚠️</span>
            <p style={{ fontSize:13, color:"#856404", margin:0, fontWeight:600 }}>
              {selectedAllergens.size} allergène{selectedAllergens.size > 1 ? "s" : ""} filtré{selectedAllergens.size > 1 ? "s" : ""} — les plats incompatibles sont grisés
            </p>
          </div>
        )}

        {activeCats.length === 0 && (
          <div style={{ textAlign:"center", padding:"48px 20px" }}>
            <p style={{ fontSize:32, marginBottom:8 }}>🔍</p>
            <p style={{ fontSize:14, color:"#AAA" }}>{ui.noResult}</p>
          </div>
        )}

        {CATEGORY_ORDER.map((cat) => {
          const items = grouped[cat];
          if (!items?.length) return null;
          const compatible = items.filter(r => !isIncompatible(r));
          const incompatible = items.filter(r => isIncompatible(r));
          return (
            <div key={cat} ref={el => categoryRefs.current[cat] = el} style={{ marginBottom:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                <p style={{ fontSize:12, fontWeight:800, color:"#AAA", textTransform:"uppercase",
                  letterSpacing:"0.1em", margin:0 }}>{catLabels[cat]}</p>
                <div style={{ flex:1, height:1, background:"#EBEBEB" }} />
                <span style={{ fontSize:11, color:"#CCC", fontWeight:600 }}>{items.length}</span>
              </div>
              {compatible.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe}
                  getDisplayName={getDisplayName} getDisplayIngredients={getDisplayIngredients}
                  allergenNames={allergenNames} selectedAllergens={selectedAllergens}
                  incompatible={false} brandColor={brandColor} />
              ))}
              {incompatible.length > 0 && selectedAllergens.size > 0 && (
                <div style={{ display:"flex", alignItems:"center", gap:8, margin:"10px 0 8px" }}>
                  <div style={{ flex:1, height:1, background:"#FFE4E4" }} />
                  <span style={{ fontSize:11, color:"#E57373", fontWeight:700, whiteSpace:"nowrap" }}>⚠️ Contient vos allergènes</span>
                  <div style={{ flex:1, height:1, background:"#FFE4E4" }} />
                </div>
              )}
              {incompatible.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe}
                  getDisplayName={getDisplayName} getDisplayIngredients={getDisplayIngredients}
                  allergenNames={allergenNames} selectedAllergens={selectedAllergens}
                  incompatible={true} brandColor={brandColor} />
              ))}
            </div>
          );
        })}
      </div>

      {/* ── FOOTER ── */}
      <div style={{ padding:"20px 16px 32px", textAlign:"center", borderTop:"1px solid #EBEBEB", background:"white" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
          <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="#1A1A1A"/>
            <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#2D2D2D"/>
            <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize:12, fontWeight:700, color:"#888" }}>MenuSafe</span>
        </div>
        <p style={{ fontSize:10, color:"#CCC", margin:"4px 0 0" }}>Conforme règlement UE n°1169/2011 (INCO)</p>
      </div>

      {langOpen && <div style={{ position:"fixed", inset:0, zIndex:99 }} onClick={() => setLangOpen(false)} />}
    </div>
  );
}

function RecipeCard({ recipe, getDisplayName, getDisplayIngredients, allergenNames, selectedAllergens, incompatible, brandColor }) {
  const [expanded, setExpanded] = useState(false);
  const ingredients = getDisplayIngredients(recipe);
  const SHOW_LIMIT = 4;

  return (
    <div onClick={() => ingredients.length > SHOW_LIMIT && setExpanded(e => !e)}
      style={{ background: incompatible ? "#FDF5F5" : "white",
        border: incompatible ? "1px solid #F5C6C6" : "1px solid #EBEBEB",
        borderRadius:14, padding:"14px", marginBottom:8,
        opacity: incompatible ? 0.8 : 1,
        cursor: ingredients.length > SHOW_LIMIT ? "pointer" : "default" }}>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom: ingredients.length > 0 ? 5 : 0 }}>
        <p style={{ fontSize:15, fontWeight:700, color: incompatible ? "#C0A0A0" : "#1A1A1A", margin:0, flex:1, lineHeight:1.3 }}>
          {getDisplayName(recipe)}
        </p>
        {incompatible && (
          <div style={{ display:"flex", alignItems:"center", gap:4,
            background:"#FFEBEB", border:"1px solid #FFBBBB",
            borderRadius:20, padding:"3px 9px", flexShrink:0 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#CC3333" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span style={{ fontSize:11, fontWeight:700, color:"#CC3333" }}>Allergène</span>
          </div>
        )}
      </div>

      {ingredients.length > 0 && (
        <p style={{ fontSize:12, color: incompatible ? "#C8AEAD" : "#999", margin:"0 0 8px", lineHeight:1.5 }}>
          {expanded || ingredients.length <= SHOW_LIMIT
            ? ingredients.join(", ")
            : ingredients.slice(0, SHOW_LIMIT).join(", ") + "..."}
          {ingredients.length > SHOW_LIMIT && (
            <span style={{ color: brandColor, fontWeight:700, marginLeft:4, fontSize:11 }}>
              {expanded ? " − voir moins" : ` +${ingredients.length - SHOW_LIMIT}`}
            </span>
          )}
        </p>
      )}

      {(recipe.is_vegan || recipe.is_vegetarian || recipe.meat_certification) && (
        <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:8 }}>
          {recipe.is_vegan && (
            <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#F0FFF4", color:"#155724", border:"1px solid #C6F6D5" }}>Vegan</span>
          )}
          {recipe.is_vegetarian && !recipe.is_vegan && (
            <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#F0FFF4", color:"#155724", border:"1px solid #C6F6D5" }}>Végétarien</span>
          )}
          {recipe.meat_certification && (
            <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:"#F7F7F5", color:"#555", border:"1px solid #E0E0E0" }}>
              {recipe.meat_certification === "halal" ? "Halal" : recipe.meat_certification === "casher" ? "Casher" : recipe.meat_certification === "label_rouge" ? "Label Rouge" : "Bio"}
            </span>
          )}
        </div>
      )}

      {recipe.allergens?.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
          {recipe.allergens.map((id) => {
            const a = ALLERGENS.find((x) => x.id === id);
            if (!a) return null;
            const mine = selectedAllergens.has(id);
            return (
              <span key={id} style={{ fontSize:11, padding:"3px 8px", borderRadius:20,
                display:"inline-flex", alignItems:"center", gap:4,
                background: mine ? "#FFDDDD" : a.color,
                color: mine ? "#991111" : a.text,
                border: mine ? "1px solid #FF9999" : "none",
                fontWeight: mine ? 700 : 500 }}>
                <AllergenIcon id={id} size={11} color={mine ? "#991111" : a.text} />
                {allergenNames[id] || a.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}