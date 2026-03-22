"use client";
import { useState, useEffect, useCallback } from "react";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import { createClient } from "@/lib/supabase";
import { getPlan, canAddRecipe, canAddEstablishment, getLimitMessage } from "@/lib/plans";
import { generateAllergenPDF } from "@/lib/pdf-generator";
import { generateMenuPDF } from "@/lib/pdf-menu";
import RecipeForm from "@/components/RecipeForm";
import RecipeList from "@/components/RecipeList";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/lib/useWindowSize";
import { FileText, Camera, Smartphone, Settings, X, Check, AlertTriangle } from "lucide-react";

function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="#1A1A1A"/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#2D2D2D"/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Mini Modal confirmation suppression ──────────────────────────────────────
function DeleteModal({ recipeName, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }} onClick={onCancel} />
      <div style={{ position: "relative", background: "white", borderRadius: 16, padding: "28px 28px 24px", maxWidth: 400, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FFF0F0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <AlertTriangle size={20} color="#CC0000" />
        </div>
        <p style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px" }}>Supprimer cette recette ?</p>
        <p style={{ fontSize: 13, color: "#666", margin: "0 0 20px", lineHeight: 1.5 }}>
          <strong style={{ color: "#1A1A1A" }}>{recipeName}</strong> sera définitivement supprimée. Cette action est irréversible.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onConfirm}
            style={{ flex: 1, padding: "10px", fontSize: 13, fontWeight: 700, background: "#CC0000", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>
            Supprimer
          </button>
          <button onClick={onCancel}
            style={{ flex: 1, padding: "10px", fontSize: 13, fontWeight: 600, background: "#F0F0F0", color: "#555", border: "none", borderRadius: 10, cursor: "pointer" }}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal ajout établissement ────────────────────────────────────────────────
function AddEstModal({ onConfirm, onCancel }) {
  const [name, setName] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }} onClick={onCancel} />
      <div style={{ position: "relative", background: "white", borderRadius: 16, padding: "28px", maxWidth: 400, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}>
        <p style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", margin: "0 0 6px" }}>Nouvel établissement</p>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px" }}>Chaque établissement a son propre QR code et sa propre carte.</p>
        <input
          type="text"
          autoFocus
          placeholder="Ex: Le Bistrot du Coin"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onConfirm(name.trim())}
          style={{ width: "100%", padding: "10px 14px", fontSize: 14, border: "1.5px solid #E0E0E0", borderRadius: 10, outline: "none", marginBottom: 14, boxSizing: "border-box", fontFamily: "inherit" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => name.trim() && onConfirm(name.trim())} disabled={!name.trim()}
            style={{ flex: 1, padding: "10px", fontSize: 13, fontWeight: 700, background: name.trim() ? "#1A1A1A" : "#E0E0E0", color: name.trim() ? "white" : "#AAA", border: "none", borderRadius: 10, cursor: name.trim() ? "pointer" : "not-allowed" }}>
            Créer
          </button>
          <button onClick={onCancel}
            style={{ flex: 1, padding: "10px", fontSize: 13, fontWeight: 600, background: "#F0F0F0", color: "#555", border: "none", borderRadius: 10, cursor: "pointer" }}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast notification ───────────────────────────────────────────────────────
function Toast({ message, type = "error", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);
  const colors = {
    error:   { bg: "#FFF0F0", border: "#FFD0D0", text: "#CC0000" },
    success: { bg: "#F0FFF4", border: "#C6F6D5", text: "#276749" },
    warning: { bg: "#FFF8E6", border: "#FDE68A", text: "#7A4F00" },
  };
  const c = colors[type] || colors.error;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 600,
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12,
      padding: "12px 16px", display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)", maxWidth: 340, fontFamily: "Inter, sans-serif" }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: c.text, flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: c.text, padding: 0 }}>
        <X size={14} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

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

  // Modals & toasts
  const [deleteTarget, setDeleteTarget]   = useState(null); // { id, name }
  const [showAddEst, setShowAddEst]       = useState(false);
  const [toast, setToast]                 = useState(null); // { message, type }

  const router = useRouter();
  const supabase = createClient();
  const { isMobile } = useWindowSize();

  const plan = subscription?.plan ?? "free";
  const planInfo = getPlan(plan);
  const canImport = plan === "pro" || plan === "reseau";
  const isPro = plan === "pro" || plan === "reseau";

  function showToast(message, type = "error") {
    setToast({ message, type });
  }

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
      showToast("Recette ajoutée avec succès", "success");
    }
  }

  // Suppression via modal — plus de confirm() natif
  function requestDelete(id, name) {
    setDeleteTarget({ id, name });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await supabase.from("recipes").delete().eq("id", deleteTarget.id);
    setRecipes((p) => p.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast("Recette supprimée", "success");
  }

  // Ajout établissement via modal — plus de prompt() natif
  function handleAddEst() {
    if (!canAddEstablishment(plan, establishments.length)) {
      setLimitError(getLimitMessage("establishments", plan));
      return;
    }
    setShowAddEst(true);
  }

  async function confirmAddEst(name) {
    setShowAddEst(false);
    const { data } = await supabase.from("establishments")
      .insert({ user_id: user.id, name }).select().single();
    if (data) {
      setEsts((p) => [...p, data]);
      switchEst(data.id);
      showToast(`"${name}" créé avec succès`, "success");
    }
  }

  async function handleGenerateMenuPDF() {
    if (!recipes.length) {
      showToast("Ajoutez au moins une recette avant de générer le PDF", "warning");
      return;
    }
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

      {/* ── Modals ── */}
      {deleteTarget && (
        <DeleteModal
          recipeName={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showAddEst && (
        <AddEstModal
          onConfirm={confirmAddEst}
          onCancel={() => setShowAddEst(false)}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Navbar ── */}
      <nav style={s.nav}>
        <div style={{ ...s.navInner, flexWrap: isMobile ? "wrap" : "nowrap", gap: isMobile ? 8 : 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: isMobile ? "100%" : "auto" }}>
            <div style={s.logo} onClick={() => router.push("/")} role="button">
              <Logo size={26} />
              <p style={s.logoName}>MenuSafe</p>
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

          {/* Tabs établissements */}
          <div style={{ ...s.estTabs, width: isMobile ? "100%" : "auto" }}>
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
              <button style={s.btnSettings} onClick={() => router.push("/parametres")} title="Paramètres">
                <Settings size={15} color="#555" />
              </button>
              <button style={s.btnLogout} onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </nav>

      <main style={s.main}>

        {/* Bandeau trial */}
        {subscription?.status === "trialing" && subscription.trial_ends_at && (() => {
          const daysLeft = Math.max(0, Math.ceil((new Date(subscription.trial_ends_at) - new Date()) / 86400000));
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

        {/* Bannière limite */}
        {limitError && (
          <div style={s.limitBanner}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#7A4F00" }}>⚠️ {limitError}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={s.upgradeBtn} onClick={() => router.push("/#pricing")}>Changer de formule →</button>
              <button style={s.closeBanner} onClick={() => setLimitError("")}><X size={14} /></button>
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

        {/* Barre progression recettes */}
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

        {/* ── Outils QR + PDF ── */}
        {view === "list" && recipes.length > 0 && (
          <div style={s.toolsPanel}>
            {/* QR Code */}
            <div style={s.toolCard}>
              <div style={s.toolCardLeft}>
                <div style={s.toolIconWrap}>
                  <Smartphone size={18} color="#1A1A1A" strokeWidth={1.75} />
                </div>
                <div>
                  <p style={s.toolTitle}>QR Code de la carte interactive</p>
                  <p style={s.toolSub}>À imprimer sur chaque table. Les clients scannent, choisissent leur langue et cochent leurs allergies. La carte se filtre automatiquement.</p>
                </div>
              </div>
              <div style={s.toolActions}>
                <button style={{ ...s.btnTool, fontSize: isMobile ? 12 : 13 }} onClick={() => setShowMenuQR((v) => !v)}>
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
                    {[
                      "Disponible en 8 langues",
                      "Filtrage allergènes en temps réel",
                      "Mise à jour automatique",
                      "Optimisé mobile",
                    ].map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Check size={12} color="#4ADE80" strokeWidth={2.5} />
                        <p style={{ fontSize: 12, color: "#555", margin: 0 }}>{f}</p>
                      </div>
                    ))}
                  </div>
                  <a href={menuUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: 12, fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                    Voir la carte client →
                  </a>
                </div>
              </div>
            )}

            {/* PDF */}
            <div style={{ ...s.toolCard, borderTop: "1px solid #F0F0F0" }}>
              <div style={s.toolCardLeft}>
                <div style={s.toolIconWrap}>
                  <FileText size={18} color="#1A1A1A" strokeWidth={1.75} />
                </div>
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
              <div style={{ ...s.toolIconWrap, background: "#F0FFF4", flexShrink: 0 }}>
                <Camera size={18} color="#155724" strokeWidth={1.75} />
              </div>
              <div>
                <p style={s.importBannerTitle}>Import par photo de carte</p>
                <p style={s.importBannerSub}>Photographiez votre carte — l'IA extrait tous vos plats et allergènes automatiquement.</p>
              </div>
            </div>
            <button style={s.btnImport} onClick={() => router.push(`/dashboard/import?est=${activeEst}`)}>Importer →</button>
          </div>
        )}

        {/* ── Contenu principal ── */}
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
                  <button style={s.btnImportSmall} onClick={() => router.push(`/dashboard/import?est=${activeEst}`)}>
                    <Camera size={14} color="#155724" />
                  </button>
                )}
                <button
                  style={canAddRecipe(plan, recipes.length) ? s.btnPrimary : s.btnLocked}
                  onClick={() => {
                    if (!canAddRecipe(plan, recipes.length)) { setLimitError(getLimitMessage("recipes", plan)); return; }
                    setView("create");
                  }}>
                  {canAddRecipe(plan, recipes.length) ? "+ Nouvelle recette" : "Limite"}
                </button>
              </div>
            </div>

            <RecipeList
              recipes={formattedRecipes}
              onDelete={(id) => {
                const recipe = recipes.find(r => r.id === id);
                requestDelete(id, recipe?.dish_name || "cette recette");
              }}
              onGeneratePDF={generateAllergenPDF}
              menuUrl={menuUrl}
            />

            {/* ── Analytics ── */}
            <div style={{ marginTop: 24, background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "20px" }}>
              <AnalyticsPanel estId={activeEst} estName={activeEstName} isPro={isPro} />
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
  btnSettings: { padding: "6px 8px", background: "white", border: "1px solid #E8E8E8", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  main: { maxWidth: 900, margin: "0 auto", padding: "16px 16px" },
  limitBanner: { background: "#FFF8E6", border: "1px solid #FDDEA0", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  upgradeBtn: { fontSize: 12, fontWeight: 700, padding: "6px 14px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" },
  closeBanner: { background: "none", border: "none", color: "#AAA", cursor: "pointer", display: "flex", alignItems: "center" },
  statsBar: { display: "flex", alignItems: "center", background: "white", border: "1px solid #EBEBEB", borderRadius: 14, padding: "14px 20px", marginBottom: 16 },
  stat: { flex: 1, textAlign: "center" },
  statVal: { display: "block", fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.02em" },
  statLabel: { display: "block", fontSize: 11, color: "#999", marginTop: 2 },
  statDiv: { width: 1, height: 28, background: "#EBEBEB" },
  progressWrap: { background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "12px 16px", marginBottom: 16 },
  progressLabel: { fontSize: 12, color: "#888" },
  progressBg: { background: "#F0F0F0", borderRadius: 6, height: 6, overflow: "hidden" },
  progressBar: { height: 6, borderRadius: 6, transition: "width 0.3s ease" },
  toolsPanel: { background: "white", border: "1.5px solid #1A1A1A", borderRadius: 14, marginBottom: 16, overflow: "hidden" },
  toolCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", gap: 16 },
  toolCardLeft: { display: "flex", alignItems: "flex-start", gap: 12, flex: 1 },
  toolIconWrap: { width: 36, height: 36, borderRadius: 10, background: "#F5F5F3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
  toolTitle: { fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 3px" },
  toolSub: { fontSize: 12, color: "#666", margin: 0, lineHeight: 1.5 },
  toolActions: { flexShrink: 0 },
  btnTool: { fontSize: 13, fontWeight: 600, padding: "8px 16px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap" },
  qrExpanded: { display: "flex", gap: 20, padding: "16px", background: "#F7F7F5", borderTop: "1px solid #EBEBEB", alignItems: "flex-start" },
  qrExpandedBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0, background: "white", borderRadius: 12, padding: 12, border: "1px solid #EBEBEB" },
  qrUrlText: { fontSize: 10, color: "#888", textAlign: "center", margin: 0, wordBreak: "break-all", maxWidth: 140 },
  qrExpandedInfo: { flex: 1 },
  qrExpandedTitle: { fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px" },
  qrExpandedSub: { fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 },
  importBanner: { background: "white", border: "1px solid #E8E8E8", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 },
  importBannerLeft: { display: "flex", alignItems: "center", gap: 12 },
  importBannerTitle: { fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 2px" },
  importBannerSub: { fontSize: 12, color: "#888", margin: 0 },
  btnImport: { fontSize: 13, fontWeight: 700, padding: "8px 16px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap" },
  btnImportSmall: { padding: "8px 10px", background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 9, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  viewHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  viewTitle: { fontSize: 16, fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8, margin: 0 },
  pill: { fontSize: 11, fontWeight: 700, background: "#1A1A1A", color: "white", padding: "2px 7px", borderRadius: 20 },
  listHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  btnPrimary: { fontSize: 13, fontWeight: 600, padding: "8px 16px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" },
  btnLocked: { fontSize: 13, fontWeight: 600, padding: "8px 16px", background: "#FFF8E6", color: "#9A6700", border: "1px solid #FDDEA0", borderRadius: 10, cursor: "pointer" },
  btnBack: { fontSize: 13, padding: "7px 14px", background: "white", color: "#555", border: "1px solid #E8E8E8", borderRadius: 9, cursor: "pointer" },
};