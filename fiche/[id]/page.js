"use client";
import { useEffect, useState } from "react";
import { ALLERGENS } from "@/lib/allergens-db";

const STORAGE_KEY = "menusafe_recipes";

export default function FichePage({ params }) {
  const [recipe, setRecipe] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const recipes = JSON.parse(saved);
        const found = recipes.find((r) => r.id === params.id);
        if (found) setRecipe(found);
        else setNotFound(true);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
  }, [params.id]);

  if (notFound) return (
    <div style={styles.page}>
      <div style={styles.center}>
        <p style={{ fontSize: 32 }}>404</p>
        <p style={{ fontSize: 14, color: "#999", marginTop: 8 }}>Fiche introuvable ou supprimée.</p>
      </div>
    </div>
  );

  if (!recipe) return (
    <div style={styles.page}>
      <div style={styles.center}>
        <p style={{ fontSize: 13, color: "#999" }}>Chargement...</p>
      </div>
    </div>
  );

  const present = ALLERGENS.filter((a) => recipe.allergens.includes(a.id));
  const absent  = ALLERGENS.filter((a) => !recipe.allergens.includes(a.id));

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <p style={styles.brand}>MenuSafe</p>
        <p style={styles.brandSub}>Fiche allergènes officielle</p>
      </div>

      <div style={styles.body}>
        <div style={styles.dishCard}>
          <p style={styles.dishName}>{recipe.dishName}</p>
          <p style={styles.dishMeta}>
            {recipe.ingredients.length} ingrédient{recipe.ingredients.length > 1 ? "s" : ""} · {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>

        <p style={styles.sectionLabel}>Composition</p>
        <div style={styles.ingList}>
          {recipe.ingredients.map((ing, i) => (
            <span key={i} style={styles.ingTag}>{ing}</span>
          ))}
        </div>

        <p style={{ ...styles.sectionLabel, marginTop: 16 }}>
          {present.length > 0 ? `Allergènes présents (${present.length})` : "Allergènes"}
        </p>

        {present.length === 0 ? (
          <div style={{ ...styles.banner, background: "#F0FFF4", borderColor: "#C6F6D5" }}>
            <p style={{ fontSize: 13, color: "#276749", margin: 0 }}>✅ Aucun allergène majeur détecté.</p>
          </div>
        ) : (
          <>
            <div style={{ ...styles.banner, background: "#FFF8E6", borderColor: "#FDDEA0" }}>
              <p style={{ fontSize: 13, color: "#7A4F00", margin: 0 }}>
                ⚠️ Ce plat contient <strong>{present.length} allergène{present.length > 1 ? "s" : ""}</strong>
              </p>
            </div>
            <div style={styles.allergenGrid}>
              {present.map((a) => (
                <div key={a.id} style={{ ...styles.allergenCard, background: a.color }}>
                  <span style={{ fontSize: 20 }}>{a.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: a.text }}>{a.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {absent.length > 0 && (
          <>
            <p style={{ ...styles.sectionLabel, marginTop: 16 }}>Ne contient pas</p>
            <div style={styles.absentGrid}>
              {absent.map((a) => (
                <div key={a.id} style={styles.absentCard}>
                  <span style={{ fontSize: 14, opacity: 0.35 }}>{a.icon}</span>
                  <span style={styles.absentLabel}>{a.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={styles.footer}>
          <p style={styles.footerText}>Conforme règlement UE n°1169/2011 (INCO) · 14 allergènes déclarés</p>
          <p style={styles.footerPowered}>Propulsé par MenuSafe</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: 480, margin: "0 auto" },
  center: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" },
  header: { background: "#1A1A1A", padding: "14px 18px" },
  brand: { fontSize: 14, fontWeight: 700, color: "white", margin: 0 },
  brandSub: { fontSize: 11, color: "rgba(255,255,255,0.45)", margin: "2px 0 0" },
  body: { padding: 16 },
  dishCard: { background: "white", border: "1px solid #EBEBEB", borderRadius: 14, padding: 16, marginBottom: 16 },
  dishName: { fontSize: 20, fontWeight: 700, color: "#1A1A1A", margin: 0, letterSpacing: "-0.02em" },
  dishMeta: { fontSize: 12, color: "#999", margin: "4px 0 0" },
  sectionLabel: { fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 },
  ingList: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 },
  ingTag: { fontSize: 13, background: "white", border: "1px solid #E8E8E8", borderRadius: 8, padding: "4px 10px", color: "#444" },
  banner: { border: "1px solid", borderRadius: 10, padding: "10px 14px", marginBottom: 10 },
  allergenGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 },
  allergenCard: { borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 },
  absentGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 },
  absentCard: { background: "white", border: "1px solid #F0F0F0", borderRadius: 10, padding: "8px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  absentLabel: { fontSize: 10, color: "#BBB", textAlign: "center" },
  footer: { marginTop: 24, paddingTop: 12, borderTop: "1px solid #E8E8E8", textAlign: "center" },
  footerText: { fontSize: 10, color: "#CCC", margin: 0, lineHeight: 1.5 },
  footerPowered: { fontSize: 10, color: "#CCC", margin: "4px 0 0" },
};