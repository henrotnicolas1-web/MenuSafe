"use client";
import { useState } from "react";
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

export default function ResetPasswordPage() {
  const [email, setEmail]       = useState("");
  const [sent, setSent]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) setError("Adresse email introuvable ou erreur. Vérifiez l'adresse saisie.");
    else setSent(true);
    setLoading(false);
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo} onClick={() => router.push("/")}>
          <Logo size={32} />
          <p style={s.logoName}>MenuSafe</p>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 32, margin: "0 0 14px" }}>📬</p>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px" }}>Email envoyé !</h1>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 24px" }}>
              Un lien de réinitialisation a été envoyé à <strong>{email}</strong>.<br />
              Vérifiez vos spams si vous ne le recevez pas.
            </p>
            <button onClick={() => router.push("/auth")}
              style={s.btn}>
              Retour à la connexion →
            </button>
          </div>
        ) : (
          <>
            <h1 style={s.title}>Mot de passe oublié ?</h1>
            <p style={s.sub}>Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={s.label}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean@restaurant.fr" required style={s.input} />
              </div>
              {error && <div style={s.error}>{error}</div>}
              <button type="submit" disabled={loading} style={s.btn}>
                {loading ? "Envoi en cours..." : "Envoyer le lien →"}
              </button>
            </form>
            <p style={s.back} onClick={() => router.push("/auth")}>← Retour à la connexion</p>
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
  sub: { fontSize: 13, color: "#888", textAlign: "center", margin: "0 0 24px", lineHeight: 1.6 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 },
  input: { width: "100%", padding: "11px 14px", fontSize: 14, border: "1px solid #E0E0E0", borderRadius: 10, outline: "none", background: "#FAFAFA", color: "#1A1A1A", boxSizing: "border-box" },
  error: { background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#CC0000" },
  btn: { padding: "13px", fontSize: 14, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, cursor: "pointer", width: "100%" },
  back: { fontSize: 12, color: "#BBB", textAlign: "center", margin: "16px 0 0", cursor: "pointer" },
};