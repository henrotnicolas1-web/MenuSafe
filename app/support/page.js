"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SUBJECTS = [
  "Choisissez le type de demande...",
  "Problème technique — l'application ne fonctionne pas",
  "Problème de paiement ou de facturation",
  "Question sur mon abonnement",
  "Import IA — problème lors du scan",
  "QR code — la carte ne s'affiche pas",
  "Demande de remboursement",
  "Suggestion d'amélioration",
  "Signaler un bug",
  "Partenariat commercial",
  "Autre",
];

export default function SupportPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.subject || form.subject === SUBJECTS[0]) {
      setError("Veuillez sélectionner un type de demande.");
      return;
    }
    if (!form.message.trim()) {
      setError("Veuillez décrire votre demande.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Une erreur est survenue. Réessayez ou écrivez directement à contact@menusafe.fr");
      }
    } catch {
      setError("Une erreur est survenue. Réessayez ou écrivez directement à contact@menusafe.fr");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #EBEBEB" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span onClick={() => router.push("/")} style={{ fontSize: 15, fontWeight: 800, color: "#1A1A1A", cursor: "pointer", letterSpacing: "-0.02em" }}>MenuSafe</span>
          <button onClick={() => router.push("/")} style={{ fontSize: 13, color: "#888", background: "none", border: "none", cursor: "pointer" }}>← Retour</button>
        </div>
      </nav>

      <main style={{ maxWidth: 600, margin: "0 auto", padding: "48px 20px 80px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Support</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Contactez-nous</h1>
        <p style={{ fontSize: 14, color: "#888", margin: "0 0 36px", lineHeight: 1.6 }}>
          Nous répondons sous 24h ouvrées. Pour les urgences techniques, précisez-le dans votre message.
        </p>

        {sent ? (
          <div style={{ background: "#F0FFF4", border: "1px solid #C6F6D5", borderRadius: 16, padding: "32px", textAlign: "center" }}>
            <p style={{ fontSize: 32, margin: "0 0 12px" }}>✅</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", margin: "0 0 8px" }}>Message envoyé !</p>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 20px", lineHeight: 1.6 }}>
              Nous avons bien reçu votre demande et vous répondrons sous 24h ouvrées à <strong>{form.email}</strong>.
            </p>
            <button onClick={() => router.push("/")}
              style={{ fontSize: 13, fontWeight: 600, padding: "10px 20px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>
              Retour à l'accueil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 16, padding: "28px 28px" }}>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Votre nom</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="Jean Dupont" required
                  style={s.input} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Votre email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="jean@restaurant.fr" required
                  style={s.input} />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Type de demande</label>
              <select name="subject" value={form.subject} onChange={handleChange}
                required style={{ ...s.input, color: form.subject && form.subject !== SUBJECTS[0] ? "#1A1A1A" : "#AAA" }}>
                {SUBJECTS.map((s, i) => (
                  <option key={i} value={i === 0 ? "" : s} disabled={i === 0}>{s}</option>
                ))}
              </select>
            </div>

            <div style={s.field}>
              <label style={s.label}>Votre message</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder="Décrivez votre demande en détail — plus vous êtes précis, plus vite nous pourrons vous aider."
                required rows={5}
                style={{ ...s.input, resize: "vertical", lineHeight: 1.6 }} />
            </div>

            {error && (
              <div style={{ background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#CC0000", marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "13px", fontSize: 14, fontWeight: 700, background: "#1A1A1A", color: "white", border: "none", borderRadius: 10, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Envoi en cours..." : "Envoyer le message →"}
            </button>

            <p style={{ fontSize: 12, color: "#BBB", textAlign: "center", margin: "12px 0 0" }}>
              Ou écrivez directement à <a href="mailto:contact@menusafe.fr" style={{ color: "#888" }}>contact@menusafe.fr</a>
            </p>
          </form>
        )}
      </main>
    </div>
  );
}

const s = {
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 },
  input: { width: "100%", padding: "11px 14px", fontSize: 14, border: "1px solid #E0E0E0", borderRadius: 10, outline: "none", background: "#FAFAFA", color: "#1A1A1A", boxSizing: "border-box", fontFamily: "inherit" },
};