"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
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

export default function ParamatresPage() {
  const [user, setUser]               = useState(null);
  const [sub, setSub]                 = useState(null);
  const [establishments, setEsts]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState("compte");

  // Apparence / Branding
  const [brandColor, setBrandColor]   = useState("#1A1A1A");
  const [brandLogo, setBrandLogo]     = useState(null);
  const [logoFile, setLogoFile]       = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [brandSaving, setBrandSaving] = useState(false);
  const [brandSaved, setBrandSaved]   = useState(false);
  const [brandEstId, setBrandEstId]   = useState(null);

  // Compte
  const [newEmail, setNewEmail]       = useState("");
  const [emailSent, setEmailSent]     = useState(false);

  // Mot de passe
  const [currentPwd, setCurrentPwd]   = useState("");
  const [newPwd, setNewPwd]           = useState("");
  const [confirmPwd, setConfirmPwd]   = useState("");
  const [pwdSuccess, setPwdSuccess]   = useState(false);

  // Établissements
  const [editingEst, setEditingEst]   = useState(null);
  const [estName, setEstName]         = useState("");
  const [estSuccess, setEstSuccess]   = useState("");

  const [error, setError]             = useState("");
  const [saving, setSaving]           = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }
      setUser(user);
      const [{ data: sub }, { data: ests }] = await Promise.all([
        supabase.from("subscriptions").select("*").eq("user_id", user.id).single(),
        supabase.from("establishments").select("*").eq("user_id", user.id).order("created_at"),
      ]);
      setSub(sub);
      setEsts(ests ?? []);
      setLoading(false);
    })();
  }, []);

  async function handleUpdateEmail(e) {
    e.preventDefault();
    setSaving(true); setError("");
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) setError(error.message);
    else setEmailSent(true);
    setSaving(false);
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setSaving(true); setError(""); setPwdSuccess(false);
    if (newPwd.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); setSaving(false); return; }
    if (newPwd !== confirmPwd) { setError("Les mots de passe ne correspondent pas."); setSaving(false); return; }
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    if (error) setError(error.message);
    else { setPwdSuccess(true); setCurrentPwd(""); setNewPwd(""); setConfirmPwd(""); }
    setSaving(false);
  }

  async function handleUpdateEst(e) {
    e.preventDefault();
    if (!editingEst || !estName.trim()) return;
    setSaving(true); setError(""); setEstSuccess("");
    const { error } = await supabase
      .from("establishments").update({ name: estName.trim() }).eq("id", editingEst);
    if (error) setError(error.message);
    else {
      setEsts((p) => p.map((e) => e.id === editingEst ? { ...e, name: estName.trim() } : e));
      setEstSuccess("Nom mis à jour !");
      setTimeout(() => setEstSuccess(""), 3000);
    }
    setSaving(false);
  }

  async function handleDeleteAccount() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et supprimera toutes vos données.")) return;
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleSaveBrand() {
    if (!brandEstId) return;
    const isPro = ["pro", "reseau"].includes(sub?.plan);
    if (!isPro) { setError("La personnalisation est disponible à partir du plan Pro."); return; }
    setBrandSaving(true); setBrandSaved(false);
    try {
      let logoUrl = brandLogo;
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `${brandEstId}/logo.${ext}`;
        const { data: upData, error: upErr } = await supabase.storage
          .from("establishment-logos")
          .upload(path, logoFile, { upsert: true });
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage
          .from("establishment-logos")
          .getPublicUrl(path);
        logoUrl = urlData.publicUrl;
      }
      const { error: updateErr } = await supabase
        .from("establishments")
        .update({ brand_color: brandColor, brand_logo_url: logoUrl })
        .eq("id", brandEstId);
      if (updateErr) throw updateErr;
      setBrandLogo(logoUrl);
      setLogoFile(null);
      setBrandSaved(true);
      setEsts(prev => prev.map(e => e.id === brandEstId
        ? { ...e, brand_color: brandColor, brand_logo_url: logoUrl }
        : e
      ));
      setTimeout(() => setBrandSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    }
    setBrandSaving(false);
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <p style={{ color: "#999" }}>Chargement...</p>
    </div>
  );

  const TABS = [
    { id: "compte", label: "Mon compte" },
    { id: "securite", label: "Sécurité" },
    { id: "etablissements", label: "Établissements" },
    { id: "apparence", label: "Apparence" },
    { id: "abonnement", label: "Abonnement" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/dashboard")}>
            <Logo size={22} />
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>MenuSafe</span>
          </div>
          <button onClick={() => router.push("/dashboard")} style={{ fontSize: 13, color: "#888", background: "none", border: "none", cursor: "pointer" }}>
            ← Dashboard
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 80px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A1A", margin: "0 0 24px", letterSpacing: "-0.02em" }}>Paramètres</h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: 4, marginBottom: 24, overflowX: "auto" }}>
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setError(""); }}
              style={{ flex: 1, padding: "8px 14px", fontSize: 13, fontWeight: 600, borderRadius: 9, border: "none", cursor: "pointer", whiteSpace: "nowrap",
                background: activeTab === tab.id ? "#1A1A1A" : "transparent",
                color: activeTab === tab.id ? "white" : "#666",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {error && <div style={s.error}>{error}</div>}

        {/* ── Mon compte ── */}
        {activeTab === "compte" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Informations du compte</h2>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Email actuel</span>
              <span style={s.infoValue}>{user?.email}</span>
            </div>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Membre depuis</span>
              <span style={s.infoValue}>{user?.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "—"}</span>
            </div>

            <div style={s.divider} />
            <h3 style={s.subTitle}>Changer d'email</h3>
            {emailSent ? (
              <div style={s.success}>Un email de confirmation a été envoyé à <strong>{newEmail}</strong>. Cliquez sur le lien pour valider le changement.</div>
            ) : (
              <form onSubmit={handleUpdateEmail} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <label style={s.label}>Nouvel email</label>
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nouveau@email.fr" required style={s.input} />
                </div>
                <button type="submit" disabled={saving} style={s.btnSm}>
                  {saving ? "..." : "Mettre à jour"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ── Sécurité ── */}
        {activeTab === "securite" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Mot de passe</h2>
            {pwdSuccess && <div style={s.success}>Mot de passe mis à jour avec succès !</div>}
            <form onSubmit={handleUpdatePassword} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={s.label}>Nouveau mot de passe</label>
                <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="8 caractères minimum" required minLength={8} style={s.input} />
              </div>
              <div>
                <label style={s.label}>Confirmer le nouveau mot de passe</label>
                <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Répétez votre mot de passe" required style={s.input} />
              </div>
              <button type="submit" disabled={saving} style={s.btnPrimary}>
                {saving ? "Mise à jour..." : "Changer le mot de passe →"}
              </button>
            </form>

            <div style={s.divider} />
            <h2 style={s.sectionTitle}>Zone de danger</h2>
            <div style={{ background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#CC0000", margin: "0 0 3px" }}>Supprimer mon compte</p>
                <p style={{ fontSize: 12, color: "#888", margin: 0 }}>Cette action est irréversible. Toutes vos données seront supprimées.</p>
              </div>
              <button onClick={handleDeleteAccount}
                style={{ fontSize: 12, fontWeight: 600, padding: "7px 14px", background: "white", color: "#CC0000", border: "1px solid #FFD0D0", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" }}>
                Supprimer
              </button>
            </div>
          </div>
        )}

        {/* ── Établissements ── */}
        {activeTab === "etablissements" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Mes établissements</h2>
            {estSuccess && <div style={s.success}>{estSuccess}</div>}
            {establishments.map((est) => (
              <div key={est.id} style={{ background: "#F7F7F5", border: "1px solid #EBEBEB", borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
                {editingEst === est.id ? (
                  <form onSubmit={handleUpdateEst} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input value={estName} onChange={(e) => setEstName(e.target.value)}
                      style={{ ...s.input, flex: 1 }} required />
                    <button type="submit" disabled={saving} style={s.btnSm}>{saving ? "..." : "Sauver"}</button>
                    <button type="button" onClick={() => setEditingEst(null)}
                      style={{ ...s.btnSm, background: "white", color: "#555", border: "1px solid #E0E0E0" }}>Annuler</button>
                  </form>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", margin: "0 0 2px" }}>{est.name}</p>
                      <p style={{ fontSize: 11, color: "#BBB", margin: 0 }}>Créé le {new Date(est.created_at).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <button onClick={() => { setEditingEst(est.id); setEstName(est.name); }}
                      style={{ fontSize: 12, fontWeight: 600, padding: "6px 12px", background: "white", color: "#555", border: "1px solid #E0E0E0", borderRadius: 8, cursor: "pointer" }}>
                      Renommer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Apparence ── */}
        {activeTab === "apparence" && (
          <ApparenceTab
            ests={establishments}
            brandEstId={brandEstId}
            setBrandEstId={(id) => {
              setBrandEstId(id);
              const est = establishments.find(e => e.id === id);
              if (est) {
                setBrandColor(est.brand_color || "#1A1A1A");
                setBrandLogo(est.brand_logo_url || null);
                setLogoPreview(est.brand_logo_url || null);
              }
            }}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            logoPreview={logoPreview}
            setLogoPreview={setLogoPreview}
            setLogoFile={setLogoFile}
            brandSaving={brandSaving}
            brandSaved={brandSaved}
            sub={sub}
            onSave={handleSaveBrand}
          />
        )}

        {/* ── Abonnement ── */}
        {activeTab === "abonnement" && (
          <AbonnementTab user={user} sub={sub} router={router} />
        )}
      </main>
    </div>
  );
}


function ApparenceTab({ ests, brandEstId, setBrandEstId, brandColor, setBrandColor,
  logoPreview, setLogoPreview, setLogoFile, brandSaving, brandSaved, sub, onSave }) {

  const isPro = ["pro", "reseau"].includes(sub?.plan);
  const PRESETS = [
    "#1A1A1A", "#2D6A4F", "#1B4332", "#0077B6", "#023E8A",
    "#7B2D8B", "#C62A2F", "#E07A00", "#5C4033", "#264653",
  ];

  return (
    <div>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>Apparence de votre carte</p>
      <p style={{ fontSize: 13, color: "#888", margin: "0 0 24px", lineHeight: 1.6 }}>
        Personnalisez l'apparence de votre carte interactive client avec votre logo et vos couleurs.
      </p>

      {!isPro && (
        <div style={{ background: "#FFF8E6", border: "1px solid #FDE68A", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#856404", margin: "0 0 4px" }}>Fonctionnalité Pro</p>
          <p style={{ fontSize: 12, color: "#856404", margin: 0 }}>
            La personnalisation de l'apparence est disponible à partir du plan Pro.{" "}
            <a href="/upgrade" style={{ color: "#856404", fontWeight: 700 }}>Passer au Pro →</a>
          </p>
        </div>
      )}

      {/* Sélecteur d'établissement */}
      {ests.length > 1 && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
            Établissement
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ests.map(est => (
              <button key={est.id} onClick={() => setBrandEstId(est.id)}
                style={{ fontSize: 13, fontWeight: 600, padding: "7px 14px", borderRadius: 9, cursor: "pointer",
                  background: brandEstId === est.id ? "#1A1A1A" : "white",
                  color: brandEstId === est.id ? "white" : "#555",
                  border: brandEstId === est.id ? "1px solid #1A1A1A" : "1px solid #E0E0E0",
                }}>
                {est.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Logo */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          Logo du restaurant
        </label>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 80, height: 80, borderRadius: 12, border: "1px solid #EBEBEB", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
            {logoPreview
              ? <img src={logoPreview} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
              : <span style={{ fontSize: 24, color: "#DDD" }}>✦</span>
            }
          </div>
          <div>
            <label htmlFor="logo-upload" style={{
              display: "inline-block", fontSize: 13, fontWeight: 600, padding: "8px 16px",
              background: isPro ? "#1A1A1A" : "#F0F0F0", color: isPro ? "white" : "#AAA",
              borderRadius: 9, cursor: isPro ? "pointer" : "not-allowed",
            }}>
              {logoPreview ? "Changer le logo" : "Uploader un logo"}
            </label>
            <input id="logo-upload" type="file" accept="image/*" disabled={!isPro}
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setLogoFile(file);
                const reader = new FileReader();
                reader.onload = (ev) => setLogoPreview(ev.target.result);
                reader.readAsDataURL(file);
              }}
            />
            <p style={{ fontSize: 11, color: "#BBB", marginTop: 6 }}>PNG, JPG, SVG · Max 2MB · Fond transparent recommandé</p>
            {logoPreview && (
              <button onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                style={{ fontSize: 12, color: "#CC0000", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 4 }}>
                Supprimer le logo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Couleur */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          Couleur principale
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {PRESETS.map(c => (
            <button key={c} onClick={() => isPro && setBrandColor(c)}
              style={{ width: 32, height: 32, borderRadius: 8, background: c, cursor: isPro ? "pointer" : "not-allowed",
                border: brandColor === c ? "3px solid #1A1A1A" : "2px solid transparent",
                boxShadow: brandColor === c ? "0 0 0 1px #1A1A1A" : "none",
                transition: "all 0.15s",
              }} title={c} />
          ))}
          <div style={{ position: "relative" }}>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: PRESETS.includes(brandColor) ? "#F0F0F0" : brandColor, border: "1px dashed #CCC", cursor: isPro ? "pointer" : "not-allowed", fontSize: 16 }}
              onClick={() => isPro && document.getElementById("brand-color-picker").click()}>
              +
            </button>
            <input id="brand-color-picker" type="color" value={brandColor}
              disabled={!isPro}
              onChange={e => setBrandColor(e.target.value)}
              style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
            />
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
          Couleur sélectionnée : <strong style={{ color: brandColor }}>{brandColor}</strong>
        </p>
      </div>

      {/* Preview carte */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          Aperçu de votre carte
        </label>
        <div style={{ background: "#F7F7F5", borderRadius: 16, padding: 16, border: "1px solid #EBEBEB", maxWidth: 320 }}>
          <div style={{ background: brandColor, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            {logoPreview
              ? <img src={logoPreview} alt="Logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "contain", background: "white", padding: 2 }} />
              : <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16, color: "white" }}>✦</span>
                </div>
            }
            <div>
              <p style={{ fontSize: 13, fontWeight: 800, color: "white", margin: 0 }}>Mon Restaurant</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", margin: 0 }}>Carte interactive</p>
            </div>
          </div>
          <div style={{ background: "white", borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>Exemple de plat</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: brandColor + "20", color: brandColor, fontWeight: 700 }}>✓</span>
          </div>
        </div>
      </div>

      {/* Save */}
      <button onClick={onSave} disabled={brandSaving || !isPro}
        style={{ fontSize: 14, fontWeight: 700, padding: "12px 24px", background: isPro ? "#1A1A1A" : "#E0E0E0", color: isPro ? "white" : "#AAA", border: "none", borderRadius: 10, cursor: isPro ? "pointer" : "not-allowed" }}>
        {brandSaving ? "Sauvegarde..." : "Sauvegarder l'apparence"}
      </button>
      {brandSaved && (
        <p style={{ fontSize: 13, color: "#155724", marginTop: 10 }}>✓ Apparence sauvegardée — visible immédiatement sur votre carte</p>
      )}
    </div>
  );
}

function AbonnementTab({ user, sub, router }) {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelDone, setCancelDone] = useState(false);
  const [error, setError] = useState("");

  const isTrialing = sub?.status === "trialing";
  const isActive = sub?.status === "active";
  const hasStripe = !!sub?.stripe_subscription_id || !!sub?.stripe_customer_id;

  async function openPortal() {
    setLoadingPortal(true);
    setError("");
    try {
      const res = await fetch("/api/customer-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Erreur lors de l'ouverture du portail");
    } catch (err) {
      setError(err.message);
    }
    setLoadingPortal(false);
  }

  return (
    <div style={s.section}>
      <h2 style={s.sectionTitle}>Mon abonnement</h2>
      {error && <div style={s.error}>{error}</div>}
      {cancelDone && (
        <div style={s.success}>
          Votre abonnement a bien été annulé. Vous conservez l'accès jusqu'à la fin de la période en cours.
        </div>
      )}

      <div style={s.infoRow}>
        <span style={s.infoLabel}>Plan actuel</span>
        <span style={{ ...s.infoValue, fontWeight: 700, textTransform: "capitalize" }}>
          {sub?.plan === "free" ? "Gratuit" : sub?.plan === "solo" ? "Solo" : sub?.plan === "pro" ? "Pro" : sub?.plan === "reseau" ? "Réseau" : "Gratuit"}
        </span>
      </div>
      <div style={s.infoRow}>
        <span style={s.infoLabel}>Statut</span>
        <span style={{ ...s.infoValue, fontWeight: 600,
          color: isActive ? "#38A169" : isTrialing ? "#D69E2E" : sub?.status === "past_due" ? "#E53E3E" : "#888" }}>
          {isActive ? "Actif" : isTrialing ? "Période d'essai" : sub?.status === "past_due" ? "Paiement en retard" : "Inactif"}
        </span>
      </div>
      {sub?.trial_ends_at && isTrialing && (
        <div style={s.infoRow}>
          <span style={s.infoLabel}>Fin de l'essai gratuit</span>
          <span style={s.infoValue}>{new Date(sub.trial_ends_at).toLocaleDateString("fr-FR")}</span>
        </div>
      )}
      {sub?.current_period_ends_at && isActive && (
        <div style={s.infoRow}>
          <span style={s.infoLabel}>Prochain renouvellement</span>
          <span style={s.infoValue}>{new Date(sub.current_period_ends_at).toLocaleDateString("fr-FR")}</span>
        </div>
      )}

      <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => router.push("/upgrade")} style={s.btnPrimary}>
          Changer de formule →
        </button>
        {hasStripe && (isActive || isTrialing) && (
          <button onClick={openPortal} disabled={loadingPortal}
            style={{ ...s.btnSm, background: "white", color: "#555", border: "1px solid #E0E0E0" }}>
            {loadingPortal ? "Chargement..." : "Gérer le paiement"}
          </button>
        )}
      </div>

      {(isActive || isTrialing) && !cancelDone && (
        <>
          <div style={s.divider} />
          {!cancelConfirm ? (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", margin: "0 0 3px" }}>
                  {isTrialing ? "Annuler l'essai gratuit" : "Annuler l'abonnement"}
                </p>
                <p style={{ fontSize: 12, color: "#888", margin: 0 }}>
                  {isTrialing
                    ? "Vous repasserez au plan gratuit à la fin des 7 jours. Aucun débit."
                    : "Accès maintenu jusqu'à la fin de la période payée. Aucun remboursement partiel."}
                </p>
              </div>
              <button onClick={() => setCancelConfirm(true)}
                style={{ fontSize: 12, fontWeight: 600, padding: "7px 14px", background: "white", color: "#888", border: "1px solid #E0E0E0", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap", marginLeft: 12 }}>
                Annuler
              </button>
            </div>
          ) : (
            <div style={{ background: "#FFF8E6", border: "1px solid #FDDEA0", borderRadius: 12, padding: "16px 20px" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#7A4F00", margin: "0 0 8px" }}>
                Confirmer l'annulation ?
              </p>
              <p style={{ fontSize: 13, color: "#7A4F00", margin: "0 0 14px", lineHeight: 1.6 }}>
                {isTrialing
                  ? "Votre essai sera annulé immédiatement. Vous repasserez au plan gratuit (3 recettes max). Vos données seront conservées."
                  : "Votre abonnement sera annulé. Vous conservez l'accès jusqu'au " + (sub?.current_period_ends_at ? new Date(sub.current_period_ends_at).toLocaleDateString("fr-FR") : "la fin de la période") + "."}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={openPortal} disabled={canceling}
                  style={{ fontSize: 13, fontWeight: 700, padding: "9px 18px", background: "#CC0000", color: "white", border: "none", borderRadius: 9, cursor: canceling ? "wait" : "pointer" }}>
                  {canceling ? "Annulation..." : "Confirmer l'annulation"}
                </button>
                <button onClick={() => setCancelConfirm(false)}
                  style={{ fontSize: 13, fontWeight: 600, padding: "9px 18px", background: "white", color: "#555", border: "1px solid #E0E0E0", borderRadius: 9, cursor: "pointer" }}>
                  Garder mon abonnement
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <p style={{ fontSize: 12, color: "#BBB", marginTop: 16 }}>
        Une question ? <a href="/support" style={{ color: "#888" }}>Contactez notre support</a>
      </p>
    </div>
  );
}

const s = {
  section: { background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "24px" },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 16px" },
  subTitle: { fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "0 0 12px" },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F5F5F5" },
  infoLabel: { fontSize: 13, color: "#888" },
  infoValue: { fontSize: 13, color: "#1A1A1A" },
  divider: { height: 1, background: "#F0F0F0", margin: "20px 0" },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 },
  input: { width: "100%", padding: "10px 14px", fontSize: 14, border: "1px solid #E0E0E0", borderRadius: 10, outline: "none", background: "#FAFAFA", color: "#1A1A1A", boxSizing: "border-box", fontFamily: "inherit" },
  error: { background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#CC0000", marginBottom: 16 },
  success: { background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#276749", marginBottom: 16 },
  btnPrimary: { padding: "11px 20px", fontSize: 13, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" },
  btnSm: { padding: "9px 16px", fontSize: 13, fontWeight: 600, background: "#1A1A1A", color: "white", border: "none", borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap" },
};