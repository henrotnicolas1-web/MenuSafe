"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { getPlan, canAddRecipe, canAddEstablishment, getLimitMessage } from "@/lib/plans";
import { generateAllergenPDF } from "@/lib/pdf-generator";
import { generateMenuPDF } from "@/lib/pdf-menu";
import RecipeForm from "@/components/RecipeForm";
import RecipeList from "@/components/RecipeList";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/lib/useWindowSize";

function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="#1A1A1A"/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#2D2D2D"/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Dashboard() {
  const [user, setUser]                   = useState(null);
  const [subscription, setSub]            = useState(null);
  const [establishments, setEsts]         = useState([]);
  const [recipes, setRecipes]             = useState([]);
  const [activeEst, setActiveEst]         = useState(null);
  const [menuSlug, setMenuSlug]           = useState(null);
  const [view, setView]                   = useState("list");
  const [loading, setLoading]             = useState(true);
  const [limitError, setLimitError]       = useState("");
  const [showMenuQR, setShowMenuQR]       = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { isMobile } = useWindowSize();
  const plan = subscription?.plan ?? "free";
  const planInfo = getPlan(plan);
  const canImport = plan === "pro" || plan === "reseau";

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }
    setUser(user);

    const [{ data: sub }, { data: ests }] = await Promise.all([
      supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
      supabase.from("establishments").select("*").eq("user_id", user.id).order("created_at"),
    ]);

    setSub(sub);
    setEsts(ests ?? []);
    const firstEst = ests?.[0];
    if (firstEst) {
      setActiveEst(firstEst.id);
      await loadEstData(firstEst.id, user.id);
    }
    setLoading(false);
  }, []);

  async function loadEstData(estId, userId) {
    const [{ data: recs }, { data: menu }] = await Promise.all([
      supabase.from("recipes").select("*")
        .eq("user_id", userId ?? user?.id)
        .eq("establishment_id", estId)
        .order("category").order("dish_name"),
      supabase.from("menus").select("slug").eq("establishment_id", estId).single(),
    ]);
    setRecipes(recs ?? []);
    setMenuSlug(menu?.slug ?? null);
  }

  useEffect(() => { loadData(); }, [loadData]);

  async function switchEst(estId) {
    setActiveEst(estId);
    setShowMenuQR(false);
    await loadEstData(estId);
    setView("list");
  }

  async function handleSave(recipe) {
    setLimitError("");
    if (!canAddRecipe(plan, recipes.length)) {
      setLimitError(getLimitMessage("recipes", plan));
      return;
    }
    const { data, error } = await supabase.from("recipes").insert({
      user_id: user.id, establishment_id: activeEst,
      dish_name: recipe.dishName, category: recipe.category,
      ingredients: recipe.ingredients, allergens: recipe.allergens,
      is_vegan: recipe.isVegan ?? false,
      is_vegetarian: recipe.isVegetarian ?? false,
      meat_certification: recipe.meatCertification ?? null,
    }).select().single();
    if (!error && data) {
      setRecipes((p) => [...p, data].sort((a,b) => a.category.localeCompare(b.category)));
      setView("list");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette recette ?")) return;
    await supabase.from("recipes").delete().eq("id", id);
    setRecipes((p) => p.filter((r) => r.id !== id));
  }

  async function handleAddEst() {
    if (!canAddEstablishment(plan, establishments.length)) {
      setLimitError(getLimitMessage("establishments", plan));
      return;
    }
    const name = prompt("Nom du nouvel établissement :");
    if (!name) return;
    const { data } = await supabase.from("establishments")
      .insert({ user_id: user.id, name }).select().single();
    if (data) { setEsts((p) => [...p, data]); switchEst(data.id); }
  }

  async function handleGenerateMenuPDF() {
    if (!recipes.length) { alert("Aucune recette à exporter."); return; }
    setGeneratingPDF(true);
    const estName = establishments.find((e) => e.id === activeEst)?.name ?? "MenuSafe";
    const menuUrl = menuSlug ? `${window.location.origin}/menu/${menuSlug}` : null;
    await generateMenuPDF(estName, recipes, menuUrl);
    setGeneratingPDF(false);
  }

  function formatRecipes(rawRecipes) {
    return rawRecipes.map((r) => ({
      id: r.id, dishName: r.dish_name, category: r.category,
      ingredients: r.ingredients ?? [], allergens: r.allergens ?? [],
      createdAt: r.created_at,
    }));
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F7F5" }}>
      <p style={{ color: "#999", fontSize: 14, fontFamily: "Inter, sans-serif" }}>Chargement...</p>
    </div>
  );

  const activeEstName = establishments.find((e) => e.id === activeEst)?.name ?? "Mon établissement";
  const menuUrl = menuSlug ? `${typeof window !== "undefined" ? window.location.origin : ""}/menu/${menuSlug}` : null;
  const formattedRecipes = formatRecipes(recipes);

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.nav}>
        <div style={{ ...s.navInner, flexWrap: isMobile ? "wrap" : "nowrap", gap: isMobile ? 8 : 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: isMobile ? "100%" : "auto" }}>
            <div style={s.logo} onClick={() => router.push("/")} role="button">
              <Logo size={26} /><p style={s.logoName}>MenuSafe</p>
            </div>
            {isMobile && (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={s.planBadge}>{planInfo.name}</div>
                <button style={s.btnLogout} onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}>
                  Déco
                </button>
              </div>
            )}
          </div>
          <div style={{ ...s.estTabs, width: isMobile ? "100%" : "auto", overflowX: "auto" }}>
            {establishments.map((est) => (
              <button key={est.id}
                style={{ ...s.estTab, ...(activeEst === est.id ? s.estTabActive : {}), fontSize: isMobile ? 11 : 12 }}
                onClick={() => switchEst(est.id)}>
                {est.name}
              </button>
            ))}
            {canAddEstablishment(plan, establishments.length)
              ? <button style={s.estTabAdd} onClick={handleAddEst}>+ Ajouter</button>
              : <button style={s.estTabLocked} onClick={() => setLimitError(getLimitMessage("establishments", plan))}>
                  {planInfo.maxEstablishments === 1 ? "1 max" : `${planInfo.maxEstablishments} max`}
                </button>
            }
          </div>
          {!isMobile && (
            <div style={s.navRight}>
              <div style={s.planBadge}>{planInfo.name}</div>
              <button style={s.btnSettings} onClick={() => router.push("/parametres")} title="Paramètres">⚙️</button>
              <button style={s.btnLogout} onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </nav>

      <main style={s.main}>

        {/* Bandeau trial */}
        {subscription && subscription.status === "trialing" && subscription.trial_ends_at && (() => {
          const daysLeft = Math.max(0, Math.ceil((new Date(subscription.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)));
          return daysLeft <= 3 ? (
            <div style={{ background: "#FFF8E6", border: "1px solid #FDDEA0", borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#7A4F00", margin: 0 }}>
                ⏱ {daysLeft === 0 ? "Votre essai se termine aujourd'hui" : `${daysLeft} jour${daysLeft > 1 ? "s" : ""} restant${daysLeft > 1 ? "s" : ""} dans votre essai gratuit`}
              </p>
              <button style={{ fontSize: 12, fontWeight: 700, padding: "6px 14px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" }}
                onClick={() => router.push("/upgrade")}>
                Choisir un plan →
              </button>
            </div>
          ) : null;
        })()}

        {limitError && (
          <div style={s.limitBanner}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#7A4F00" }}>⚠️ {limitError}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={s.upgradeBtn} onClick={() => router.push("/#pricing")}>Changer de formule →</button>
              <button style={s.closeBanner} onClick={() => setLimitError("")}>✕</button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ ...s.statsBar, display: isMobile ? "grid" : "flex", gridTemplateColumns: "1fr 1fr" }}>
          {[
            { val: recipes.length, label: planInfo.maxRecipes === Infinity ? "Recettes" : `Recettes (max ${planInfo.maxRecipes})` },
            { val: new Set(recipes.flatMap((r) => r.allergens ?? [])).size, label: "Allergènes uniques" },
            { val: establishments.length, label: `Établissement${establishments.length > 1 ? "s" : ""}` },
            { val: planInfo.name, label: "Formule" },
          ].map((st, i, arr) => (
            <div key={i} style={{ display: "flex", flex: 1, alignItems: "center" }}>
              <div style={s.stat}>
                <span style={{ ...s.statVal, fontSize: typeof st.val === "string" ? 13 : 20 }}>{st.val}</span>
                <span style={s.statLabel}>{st.label}</span>
              </div>
              {i < arr.length - 1 && <div style={s.statDiv} />}
            </div>
          ))}
        </div>

        {/* Barre progression */}
        {planInfo.maxRecipes !== Infinity && (
          <div style={s.progressWrap}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={s.progressLabel}>Recettes utilisées</span>
              <span style={s.progressLabel}>{recipes.length} / {planInfo.maxRecipes}</span>
            </div>
            <div style={s.progressBg}>
              <div style={{ ...s.progressBar, width: `${Math.min(100, (recipes.length / planInfo.maxRecipes) * 100)}%`, background: recipes.length >= planInfo.maxRecipes ? "#E53E3E" : "#1A1A1A" }} />
            </div>
          </div>
        )}

        {/* Panneau QR Code Carte + PDF carte */}
        {view === "list" && recipes.length > 0 && (
          <div style={s.toolsPanel}>
            {/* QR Code établissement */}
            <div style={s.toolCard}>
              <div style={s.toolCardLeft}>
                <p style={s.toolIcon}>📱</p>
                <div>
                  <p style={s.toolTitle}>QR Code de la carte interactive</p>
                  <p style={s.toolSub}>À imprimer sur chaque table. Les clients scannent, choisissent leur langue et cochent leurs allergies. La carte se filtre automatiquement.</p>
                </div>
              </div>
              <div style={s.toolActions}>
                <button style={{ ...s.btnTool, fontSize: isMobile ? 12 : 13, padding: isMobile ? "7px 12px" : "8px 16px" }} onClick={() => setShowMenuQR((v) => !v)}>
                  {showMenuQR ? "Masquer" : "Voir le QR"}
                </button>
              </div>
            </div>

            {showMenuQR && menuUrl && (
              <div style={{ ...s.qrExpanded, flexDirection: isMobile ? "column" : "row" }}>
                <div style={s.qrExpandedBox}>
                  <QRCodeSVG value={menuUrl} size={140} level="M" includeMargin={false} />
                  <p style={s.qrUrlText}>{menuUrl}</p>
                </div>
                <div style={s.qrExpandedInfo}>
                  <p style={s.qrExpandedTitle}>Ce QR code est unique pour {activeEstName}</p>
                  <p style={s.qrExpandedSub}>Il ne change jamais — imprimez-le une seule fois et plastifiez-le sur vos tables. La carte se met à jour automatiquement quand vous modifiez vos recettes.</p>
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                    {["🌍 Disponible en 8 langues", "⚠️ Filtrage allergènes en temps réel", "🔄 Mise à jour automatique", "📱 Optimisé mobile"].map((f, i) => (
                      <p key={i} style={{ fontSize: 12, color: "#555", margin: 0 }}>{f}</p>
                    ))}
                  </div>
                  <a href={menuUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: 12, fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                    Voir la carte client →
                  </a>
                </div>
              </div>
            )}

            {/* PDF Carte complète */}
            <div style={{ ...s.toolCard, borderTop: "1px solid #F0F0F0" }}>
              <div style={s.toolCardLeft}>
                <p style={s.toolIcon}>📄</p>
                <div>
                  <p style={s.toolTitle}>PDF carte allergènes complète</p>
                  <p style={s.toolSub}>Un seul document A4 paysage avec tous vos plats, organisés par catégorie, avec les allergènes de chaque plat. À afficher dans votre établissement.</p>
                </div>
              </div>
              <div style={s.toolActions}>
                <button style={s.btnTool} onClick={handleGenerateMenuPDF} disabled={generatingPDF}>
                  {generatingPDF ? "Génération..." : "Télécharger le PDF"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bannière import IA */}
        {canImport && view === "list" && (
          <div style={s.importBanner}>
            <div style={s.importBannerLeft}>
              <p style={s.importBannerIcon}>📸</p>
              <div>
                <p style={s.importBannerTitle}>Import par photo de carte</p>
                <p style={s.importBannerSub}>Photographiez votre carte — l'IA extrait tous vos plats et allergènes automatiquement.</p>
              </div>
            </div>
            <button style={s.btnImport} onClick={() => router.push(`/dashboard/import?est=${activeEst}`)}>Importer →</button>
          </div>
        )}

        {/* Contenu */}
        {view === "create" ? (
          <div>
            <div style={s.viewHeader}>
              <p style={s.viewTitle}>Nouvelle recette · {activeEstName}</p>
              <button style={s.btnBack} onClick={() => setView("list")}>← Retour</button>
            </div>
            <RecipeForm onSave={handleSave} />
          </div>
        ) : (
          <div>
            <div style={s.listHeader}>
              <p style={s.viewTitle}>
                Mes recettes · {activeEstName}
                {recipes.length > 0 && <span style={s.pill}>{recipes.length}</span>}
              </p>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {canImport && (
                  <button style={s.btnImportSmall} onClick={() => router.push(`/dashboard/import?est=${activeEst}`)}>📸</button>
                )}
                <button
                  style={canAddRecipe(plan, recipes.length) ? s.btnPrimary : s.btnLocked}
                  onClick={() => { if (!canAddRecipe(plan, recipes.length)) { setLimitError(getLimitMessage("recipes", plan)); return; } setView("create"); }}>
                  {canAddRecipe(plan, recipes.length) ? "+ Nouvelle recette" : "Limite"}
                </button>
              </div>
            </div>
            <RecipeList
              recipes={formattedRecipes}
              onDelete={handleDelete}
              onGeneratePDF={generateAllergenPDF}
              menuUrl={menuUrl}
            />

            {/* ── Analytics QR Code ── */}
            <div style={{ marginTop: 24, background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "20px" }}>
              <AnalyticsPanel estId={activeEst} isPro={isPro} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif" },
  nav: { background: "white", borderBottom: "1px solid #EBEBEB", position: "sticky", top: 0, zIndex: 100 },
  navInner: { maxWidth: 900, margin: "0 auto", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  logo: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 },
  logoName: { fontSize: 15, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: "-0.02em" },
  estTabs: { display: "flex", gap: 6, flex: 1, overflowX: "auto", padding: "2px 0" },
  estTab: { fontSize: 12, fontWeight: 500, padding: "6px 12px", background: "transparent", color: "#888", border: "1px solid #E8E8E8", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" },
  estTabActive: { background: "#1A1A1A", color: "white", border: "1px solid #1A1A1A" },
  estTabAdd: { fontSize: 12, fontWeight: 600, padding: "6px 12px", background: "#F5F5F3", color: "#555", border: "1px dashed #CCC", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" },
  estTabLocked: { fontSize: 12, fontWeight: 500, padding: "6px 12px", background: "#FFF8E6", color: "#9A6700", border: "1px solid #FDDEA0", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" },
  navRight: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  planBadge: { background: "#F5F5F3", border: "1px solid #E8E8E8", borderRadius: 8, padding: "4px 10px", color: "#555", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" },
  btnLogout: { fontSize: 12, padding: "6px 12px", background: "white", color: "#888", border: "1px solid #E8E8E8", borderRadius: 8, cursor: "pointer" },
  btnSettings: { fontSize: 14, padding: "5px 8px", background: "white", border: "1px solid #E8E8E8", borderRadius: 8, cursor: "pointer" },
  main: { maxWidth: 900, margin: "0 auto", padding: "16px 16px" },
  limitBanner: { background: "#FFF8E6", border: "1px solid #FDDEA0", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  upgradeBtn: { fontSize: 12, fontWeight: 700, padding: "6px 14px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" },
  closeBanner: { background: "none", border: "none", color: "#AAA", cursor: "pointer", fontSize: 14 },
  statsBar: { display: "flex", alignItems: "center", background: "white", border: "1px solid #EBEBEB", borderRadius: 14, padding: "14px 20px", marginBottom: 16 },
  stat: { flex: 1, textAlign: "center" },
  statVal: { display: "block", fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.02em" },
  statLabel: { display: "block", fontSize: 11, color: "#999", marginTop: 2 },
  statDiv: { width: 1, height: 28, background: "#EBEBEB" },
  progressWrap: { background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "12px 16px", marginBottom: 16 },
  progressLabel: { fontSize: 12, color: "#888" },
  progressBg: { background: "#F0F0F0", borderRadius: 6, height: 6, overflow: "hidden" },
  progressBar: { height: 6, borderRadius: 6, transition: "width 0.3s ease" },

  // Outils (QR + PDF)
  toolsPanel: { background: "white", border: "1.5px solid #1A1A1A", borderRadius: 14, marginBottom: 16, overflow: "hidden" },
  toolCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", gap: 16 },
  toolCardLeft: { display: "flex", alignItems: "flex-start", gap: 12, flex: 1 },
  toolIcon: { fontSize: 24, margin: 0, flexShrink: 0 },
  toolTitle: { fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 3px" },
  toolSub: { fontSize: 12, color: "#666", margin: 0, lineHeight: 1.5 },
  toolActions: { flexShrink: 0 },
  btnTool: { fontSize: 13, fontWeight: 600, padding: "8px 16px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap" },

  // QR expanded
  qrExpanded: { display: "flex", gap: 20, padding: "16px", background: "#F7F7F5", borderTop: "1px solid #EBEBEB", alignItems: "flex-start" },
  qrExpandedBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0, background: "white", borderRadius: 12, padding: 12, border: "1px solid #EBEBEB" },
  qrUrlText: { fontSize: 10, color: "#888", textAlign: "center", margin: 0, wordBreak: "break-all", maxWidth: 140 },
  qrExpandedInfo: { flex: 1 },
  qrExpandedTitle: { fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px" },
  qrExpandedSub: { fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 },

  // Import
  importBanner: { background: "white", border: "1px solid #E8E8E8", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  importBannerLeft: { display: "flex", alignItems: "center", gap: 12 },
  importBannerIcon: { fontSize: 22, margin: 0, flexShrink: 0 },
  importBannerTitle: { fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" },
  importBannerSub: { fontSize: 12, color: "#888", margin: 0 },
  btnImport: { fontSize: 13, fontWeight: 700, padding: "8px 16px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap" },
  btnImportSmall: { fontSize: 13, padding: "8px 10px", background: "#F0FFF4", color: "#155724", border: "1px solid #C6F6D5", borderRadius: 9, cursor: "pointer" },

  viewHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  viewTitle: { fontSize: 16, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8, margin: 0 },
  pill: { fontSize: 11, fontWeight: 700, background: "#1A1A1A", color: "white", padding: "2px 7px", borderRadius: 20 },
  listHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  btnPrimary: { fontSize: 13, fontWeight: 600, padding: "8px 16px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" },
  btnLocked: { fontSize: 13, fontWeight: 600, padding: "8px 16px", background: "#FFF8E6", color: "#9A6700", border: "1px solid #FDDEA0", borderRadius: 10, cursor: "pointer" },
  btnBack: { fontSize: 13, padding: "7px 14px", background: "white", color: "#555", border: "1px solid #E8E8E8", borderRadius: 9, cursor: "pointer" },
};