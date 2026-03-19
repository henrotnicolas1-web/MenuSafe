"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="#1A1A1A"/>
      <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#2D2D2D"/>
      <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function AuthPage() {
  const [mode, setMode]           = useState("login");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [name, setName]           = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, restaurant_name: restaurant } },
      });

      if (error) {
        setError(error.message);
      } else {
        // Met à jour le nom de l'établissement créé par défaut
        if (data?.user && restaurant) {
          await supabase
            .from("establishments")
            .update({ name: restaurant })
            .eq("user_id", data.user.id);
          
          await supabase
            .from("profiles")
            .update({ full_name: name })
            .eq("id", data.user.id);
        }
        setSuccess("Compte créé ! Vérifiez votre email pour confirmer votre inscription.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Email ou mot de passe incorrect.");
      else router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <Logo size={36} />
          <p style={s.logoName}>MenuSafe</p>
        </div>

        <h1 style={s.title}>{mode === "login" ? "Connexion" : "Créer un compte"}</h1>
        <p style={s.sub}>
          {mode === "login"
            ? "Accédez à votre espace MenuSafe"
            : "7 jours gratuits · Sans carte bancaire"}
        </p>

        <form onSubmit={handleSubmit} style={s.form}>
          {mode === "signup" && (
            <>
              <div style={s.field}>
                <label style={s.label}>Votre prénom et nom</label>
                <input style={s.input} type="text" placeholder="Jean Dupont"
                  value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Nom de votre restaurant</label>
                <input style={s.input} type="text" placeholder="Le Bistrot du Coin"
                  value={restaurant} onChange={(e) => setRestaurant(e.target.value)} required />
                <p style={s.hint}>Ce nom apparaîtra sur vos fiches PDF et QR codes</p>
              </div>
            </>
          )}

          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="jean@restaurant.fr"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div style={s.field}>
            <label style={s.label}>Mot de passe</label>
            <input style={s.input} type="password"
              placeholder={mode === "signup" ? "8 caractères minimum" : "••••••••"}
              value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>

          {error && <div style={s.error}>{error}</div>}
          {success && <div style={s.successMsg}>{success}</div>}

          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "Chargement..." : mode === "login" ? "Se connecter →" : "Créer mon compte →"}
          </button>
        </form>

        <p style={s.toggle}>
          {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <button style={s.toggleBtn}
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}>
            {mode === "login" ? "S'inscrire gratuitement" : "Se connecter"}
          </button>
        </p>
        <p style={s.back} onClick={() => router.push("/")}>← Retour à l'accueil</p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#F7F7F5", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Inter', -apple-system, sans-serif" },
  card: { background: "white", border: "1px solid #EBEBEB", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 440 },
  logo: { display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" },
  logoName: { fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: "-0.02em" },
  title: { fontSize: 24, fontWeight: 800, color: "#1A1A1A", margin: "0 0 6px", textAlign: "center", letterSpacing: "-0.02em" },
  sub: { fontSize: 13, color: "#999", textAlign: "center", margin: "0 0 28px" },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  field: { display: "flex", flexDirection: "column", gap: 5 },
  label: { fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em" },
  hint: { fontSize: 11, color: "#BBB", margin: "3px 0 0" },
  input: { padding: "11px 14px", fontSize: 14, border: "1px solid #E0E0E0", borderRadius: 10, outline: "none", background: "#FAFAFA", color: "#1A1A1A" },
  error: { background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#CC0000" },
  successMsg: { background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#276749" },
  btn: { padding: "13px", fontSize: 15, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 12, cursor: "pointer", marginTop: 4 },
  toggle: { fontSize: 13, color: "#888", textAlign: "center", margin: "20px 0 0" },
  toggleBtn: { background: "none", border: "none", color: "#1A1A1A", fontWeight: 700, cursor: "pointer", fontSize: 13, textDecoration: "underline" },
  back: { fontSize: 12, color: "#BBB", textAlign: "center", margin: "12px 0 0", cursor: "pointer" },
};