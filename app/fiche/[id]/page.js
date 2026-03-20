"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { ALLERGENS } from "@/lib/allergens-db";
import { useParams } from "next/navigation";

export default function FichePage() {
  const params = useParams();
  const id = params?.id;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("recipes")
        .select("*, establishments(name)")
        .eq("id", id)
        .single();
      setRecipe(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return (
    <div style={s.page}>
      <div style={s.center}>
        <div style={s.spinner} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!recipe) return (
    <div style={s.page}>
      <div style={s.center}>
        <p style={{ fontSize: 14, color: "#999", fontFamily: "Inter, sans-serif" }}>Fiche introuvable.</p>
      </div>
    </div>
  );

  const presentAllergens = ALLERGENS.filter((a) => recipe.allergens?.includes(a.id));
  const absentAllergens = ALLERGENS.filter((a) => !recipe.allergens?.includes(a.id));

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div style={s.logoMark}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L4 7V17C4 23.5 9.5 29.2 16 31C22.5 29.2 28 23.5 28 17V7L16 2Z" fill="white"/>
              <path d="M16 4.5L6 9V17C6 22.5 10.5 27.5 16 29.2C21.5 27.5 26 22.5 26 17V9L16 4.5Z" fill="#E5E5E5"/>
              <path d="M10.5 16.5L14 20L21.5 12.5" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={s.logoText}>MenuSafe</span>
          </div>
          {recipe.establishments?.name && (
            <p style={s.estName}>{recipe.establishments.name}</p>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div style={s.body}>
        {/* Conformité */}
        <div style={s.conformBadge}>
          ✓ Fiche conforme — Règlement UE n°1169/2011 (INCO)
        </div>

        {/* Nom du plat */}
        <h1 style={s.dishName}>{recipe.dish_name}</h1>

        {/* Ingrédients */}
        <div style={s.section}>
          <p style={s.sectionLabel}>Composition</p>
          <p style={s.ingText}>{(recipe.ingredients ?? []).join(", ")}</p>
        </div>

        <div style={s.divider} />

        {/* Allergènes présents */}
        <div style={s.section}>
          <p style={s.sectionLabel}>
            Allergènes présents
            <span style={s.countBadge}>{presentAllergens.length} / 14</span>
          </p>
          {presentAllergens.length === 0 ? (
            <div style={s.noAllergenBox}>
              <p style={{ fontSize: 13, color: "#155724", fontWeight: 600, margin: 0 }}>
                ✓ Aucun allergène majeur détecté dans ce plat.
              </p>
            </div>
          ) : (
            <div style={s.allergenGrid}>
              {presentAllergens.map((a) => {
                const [r, g, b] = hexToRGB(a.color);
                return (
                  <div key={a.id} style={{ ...s.allergenPill, background: a.color, color: a.text }}>
                    <span style={{ fontSize: 20 }}>{a.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{a.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Allergènes absents */}
        {absentAllergens.length > 0 && (
          <>
            <div style={s.divider} />
            <div style={s.section}>
              <p style={s.sectionLabel}>Ne contient pas</p>
              <p style={s.absentText}>
                {absentAllergens.map((a) => a.label).join("  ·  ")}
              </p>
            </div>
          </>
        )}

        <div style={s.divider} />

        {/* Footer */}
        <div style={s.footer}>
          <p style={s.footerText}>Fiche générée par MenuSafe · menusafe.fr</p>
          <p style={s.footerDate}>Dernière mise à jour : {new Date(recipe.created_at).toLocaleDateString("fr-FR")}</p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function hexToRGB(hex) {
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
}

const s = {
  page: { minHeight: "100vh", background: "#F7F7F5", fontFamily: "'Inter', -apple-system, sans-serif" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
  spinner: { width: 32, height: 32, border: "3px solid #F0F0F0", borderTop: "3px solid #1A1A1A", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  header: { background: "#1A1A1A" },
  headerInner: { maxWidth: 560, margin: "0 auto", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logoMark: { display: "flex", alignItems: "center", gap: 8 },
  logoText: { fontSize: 14, fontWeight: 800, color: "white", letterSpacing: "-0.02em" },
  estName: { fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 },
  body: { maxWidth: 560, margin: "0 auto", padding: "24px 20px 48px" },
  conformBadge: { display: "inline-block", fontSize: 11, fontWeight: 600, background: "#D4EDDA", color: "#155724", padding: "5px 12px", borderRadius: 20, marginBottom: 20 },
  dishName: { fontSize: 28, fontWeight: 800, color: "#1A1A1A", margin: "0 0 24px", letterSpacing: "-0.02em", lineHeight: 1.2 },
  section: { marginBottom: 4 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: "#AAA", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 8 },
  countBadge: { fontSize: 11, fontWeight: 700, background: "#1A1A1A", color: "white", padding: "2px 8px", borderRadius: 20 },
  ingText: { fontSize: 14, color: "#444", lineHeight: 1.7, margin: 0 },
  divider: { height: 1, background: "#EBEBEB", margin: "20px 0" },
  noAllergenBox: { background: "#D4EDDA", borderRadius: 10, padding: "12px 16px" },
  allergenGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 },
  allergenPill: { display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 12 },
  absentText: { fontSize: 12, color: "#BBB", lineHeight: 1.8, margin: 0 },
  footer: { textAlign: "center", paddingTop: 8 },
  footerText: { fontSize: 11, color: "#CCC", margin: "0 0 2px" },
  footerDate: { fontSize: 11, color: "#CCC", margin: 0 },
};