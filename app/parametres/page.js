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

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <p style={{ color: "#999" }}>Chargement...</p>
    </div>
  );

  const TABS = [
    { id: "compte", label: "Mon compte" },
    { id: "securite", label: "Sécurité" },
    { id: "etablissements", label: "Établissements" },
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

        {/* ── Abonnement ── */}
        {activeTab === "abonnement" && (
          <div style={s.section}>
            <h2 style={s.sectionTitle}>Mon abonnement</h2>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Plan actuel</span>
              <span style={{ ...s.infoValue, fontWeight: 700, textTransform: "capitalize" }}>{sub?.plan || "free"}</span>
            </div>
            <div style={s.infoRow}>
              <span style={s.infoLabel}>Statut</span>
              <span style={{ ...s.infoValue, color: sub?.status === "active" ? "#38A169" : sub?.status === "trialing" ? "#D69E2E" : "#E53E3E", fontWeight: 600 }}>
                {sub?.status === "active" ? "Actif" : sub?.status === "trialing" ? "Période d'essai" : sub?.status === "past_due" ? "Paiement en retard" : "Inactif"}
              </span>
            </div>
            {sub?.trial_ends_at && sub.status === "trialing" && (
              <div style={s.infoRow}>
                <span style={s.infoLabel}>Fin d'essai</span>
                <span style={s.infoValue}>{new Date(sub.trial_ends_at).toLocaleDateString("fr-FR")}</span>
              </div>
            )}
            {sub?.current_period_ends_at && sub.status === "active" && (
              <div style={s.infoRow}>
                <span style={s.infoLabel}>Prochain renouvellement</span>
                <span style={s.infoValue}>{new Date(sub.current_period_ends_at).toLocaleDateString("fr-FR")}</span>
              </div>
            )}
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button onClick={() => router.push("/upgrade")}
                style={s.btnPrimary}>
                Changer de formule →
              </button>
              {sub?.status === "active" && (
                <a href="https://billing.stripe.com/p/login/test_00g00000000000" target="_blank" rel="noopener noreferrer"
                  style={{ ...s.btnSm, background: "white", color: "#555", border: "1px solid #E0E0E0", textDecoration: "none", display: "flex", alignItems: "center" }}>
                  Gérer via Stripe
                </a>
              )}
            </div>
            <p style={{ fontSize: 12, color: "#BBB", marginTop: 12 }}>
              Pour annuler votre abonnement ou obtenir un remboursement, contactez-nous via le <a href="/support" style={{ color: "#888" }}>formulaire de support</a>.
            </p>
          </div>
        )}
      </main>
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