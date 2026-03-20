"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="#1A1A1A"/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#2D2D2D"/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [done, setDone]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError("Erreur lors de la mise à jour. Le lien a peut-être expiré.");
    else setDone(true);
    setLoading(false);
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo} onClick={() => router.push("/")}>
          <Logo size={32} />
          <p style={s.logoName}>MenuSafe</p>
        </div>

        {done ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 32, margin: "0 0 14px" }}>✅</p>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px" }}>Mot de passe mis à jour !</h1>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            <button onClick={() => router.push("/dashboard")} style={s.btn}>
              Accéder au dashboard →
            </button>
          </div>
        ) : (
          <>
            <h1 style={s.title}>Nouveau mot de passe</h1>
            <p style={s.sub}>Choisissez un nouveau mot de passe sécurisé.</p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={s.label}>Nouveau mot de passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caractères minimum" required minLength={8} style={s.input} />
              </div>
              <div>
                <label style={s.label}>Confirmer le mot de passe</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Répétez votre mot de passe" required style={s.input} />
              </div>
              {error && <div style={s.error}>{error}</div>}
              <button type="submit" disabled={loading} style={s.btn}>
                {loading ? "Mise à jour..." : "Mettre à jour mon mot de passe →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', -apple-system, sans-serif" },
  card: { background: "white", border: "1px solid #EBEBEB", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 420 },
  logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center", cursor: "pointer" },
  logoName: { fontSize: 20, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: "-0.02em" },
  title: { fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", textAlign: "center", letterSpacing: "-0.02em" },
  sub: { fontSize: 13, color: "#888", textAlign: "center", margin: "0 0 24px" },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 },
  input: { width: "100%", padding: "11px 14px", fontSize: 14, border: "1px solid #E0E0E0", borderRadius: 10, outline: "none", background: "#FAFAFA", color: "#1A1A1A", boxSizing: "border-box" },
  error: { background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#CC0000" },
  btn: { padding: "13px", fontSize: 14, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, cursor: "pointer", width: "100%" },
};