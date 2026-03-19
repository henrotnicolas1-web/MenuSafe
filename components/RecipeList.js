"use client";
import { useState } from "react";
import { ALLERGENS } from "@/lib/allergens-db";
import { QRCodeSVG } from "qrcode.react";

const CATEGORY_LABELS = {
  entree: "🥗 Entrée", plat: "🍽️ Plat", dessert: "🍰 Dessert",
  boisson: "🥤 Boisson", autre: "📋 Autre",
};

export default function RecipeList({ recipes, onDelete, onGeneratePDF, menuUrl }) {
  const [expandedQR, setExpandedQR] = useState(null);

  if (recipes.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyIcon}>📋</p>
        <p style={styles.emptyTitle}>Aucune recette pour l'instant</p>
        <p style={styles.emptySub}>Créez votre première recette pour générer une fiche allergènes.</p>
      </div>
    );
  }

  function getQRUrl(id) {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/fiche/${id}`;
  }

  return (
    <div style={styles.list}>
      {recipes.map((recipe) => {
        const qrUrl = getQRUrl(recipe.id);
        const isOpen = expandedQR === recipe.id;
        return (
          <div key={recipe.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <p style={styles.dishName}>{recipe.dishName}</p>
                  {recipe.category && (
                    <span style={styles.catBadge}>{CATEGORY_LABELS[recipe.category] || recipe.category}</span>
                  )}
                </div>
                <p style={styles.meta}>
                  {recipe.ingredients.length} ingrédient{recipe.ingredients.length > 1 ? "s" : ""} · {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div style={styles.actions}>
                <button style={isOpen ? styles.btnQRActive : styles.btnQR}
                  onClick={() => setExpandedQR(isOpen ? null : recipe.id)}>QR</button>
                <button style={styles.btnPDF} onClick={() => onGeneratePDF(recipe)}>PDF</button>
                <button style={styles.btnDelete} onClick={() => onDelete(recipe.id)}>✕</button>
              </div>
            </div>

            <div style={styles.ingList}>
              {recipe.ingredients.map((ing, i) => (
                <span key={i} style={styles.ingTag}>{ing}</span>
              ))}
            </div>

            {recipe.allergens.length > 0 && (
              <div style={styles.allergenRow}>
                {recipe.allergens.map((id) => {
                  const a = ALLERGENS.find((x) => x.id === id);
                  if (!a) return null;
                  return (
                    <span key={id} style={{ ...styles.allergenBadge, background: a.color, color: a.text }}>
                      {a.icon} {a.label}
                    </span>
                  );
                })}
              </div>
            )}

            {isOpen && (
              <div style={styles.qrPanel}>
                <div style={styles.qrBox}>
                  <QRCodeSVG value={qrUrl} size={110} level="M" includeMargin={false} />
                </div>
                <div style={styles.qrInfo}>
                  <p style={styles.qrTitle}>QR code — fiche plat individuelle</p>
                  <p style={styles.qrSub}>Ce QR code pointe vers la fiche allergènes de ce plat uniquement.</p>
                  {menuUrl && (
                    <p style={styles.qrSub}>
                      💡 Pour le QR code de toute la carte interactive, utilisez le bouton <strong>"QR Carte"</strong> en haut du dashboard.
                    </p>
                  )}
                  <a href={qrUrl} target="_blank" rel="noopener noreferrer" style={styles.qrLink}>
                    Voir la fiche →
                  </a>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  list: { display: "flex", flexDirection: "column", gap: 10 },
  card: { background: "white", border: "1px solid #EBEBEB", borderRadius: 14, padding: "1rem 1.25rem", fontFamily: "'Inter', -apple-system, sans-serif" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  dishName: { fontSize: 15, fontWeight: 600, color: "#1A1A1A", margin: 0 },
  catBadge: { fontSize: 11, fontWeight: 500, background: "#F5F5F3", color: "#555", border: "1px solid #E8E8E8", borderRadius: 20, padding: "2px 8px" },
  meta: { fontSize: 12, color: "#999", marginTop: 0 },
  actions: { display: "flex", gap: 6, flexShrink: 0 },
  btnQR: { fontSize: 11, fontWeight: 700, padding: "5px 10px", background: "#F5F5F3", color: "#555", border: "1px solid #E0E0E0", borderRadius: 8, cursor: "pointer" },
  btnQRActive: { fontSize: 11, fontWeight: 700, padding: "5px 10px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 8, cursor: "pointer" },
  btnPDF: { fontSize: 11, fontWeight: 700, padding: "5px 10px", background: "#1A1A1A", color: "white", border: "none", borderRadius: 8, cursor: "pointer" },
  btnDelete: { fontSize: 12, padding: "5px 9px", background: "#FFF0F0", color: "#CC0000", border: "1px solid #FFD0D0", borderRadius: 8, cursor: "pointer" },
  ingList: { display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 7 },
  ingTag: { fontSize: 12, background: "#F5F5F3", border: "1px solid #E8E8E8", borderRadius: 6, padding: "3px 8px", color: "#555" },
  allergenRow: { display: "flex", flexWrap: "wrap", gap: 5 },
  allergenBadge: { fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 },
  qrPanel: { display: "flex", gap: 14, alignItems: "flex-start", marginTop: 12, paddingTop: 12, borderTop: "1px solid #F0F0F0" },
  qrBox: { background: "white", border: "1px solid #E8E8E8", borderRadius: 10, padding: 8, flexShrink: 0 },
  qrInfo: { flex: 1 },
  qrTitle: { fontSize: 13, fontWeight: 600, color: "#1A1A1A", margin: "0 0 4px" },
  qrSub: { fontSize: 12, color: "#888", lineHeight: 1.5, margin: "0 0 6px" },
  qrLink: { fontSize: 12, fontWeight: 600, color: "#1A1A1A" },
  empty: { textAlign: "center", padding: "3rem 1rem", background: "white", borderRadius: 14, border: "1px solid #EBEBEB" },
  emptyIcon: { fontSize: 32, marginBottom: 8 },
  emptyTitle: { fontSize: 15, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 },
  emptySub: { fontSize: 13, color: "#999" },
};