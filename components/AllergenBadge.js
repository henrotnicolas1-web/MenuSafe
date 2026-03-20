// Composant réutilisable — badge allergène sans emoji
import { AllergenIcon, ALLERGENS } from "@/lib/allergens-db";

export default function AllergenBadge({ id, size = "md", showLabel = true, removable = false, onRemove }) {
  const allergen = ALLERGENS.find((a) => a.id === id);
  if (!allergen) return null;

  const iconSize = size === "sm" ? 13 : size === "lg" ? 22 : 16;
  const fontSize = size === "sm" ? 10 : size === "lg" ? 14 : 12;
  const padding  = size === "sm" ? "3px 7px" : size === "lg" ? "7px 14px" : "4px 10px";

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: allergen.color, color: allergen.text,
      borderRadius: 20, padding,
      fontSize, fontWeight: 600,
    }}>
      <AllergenIcon id={id} size={iconSize} color={allergen.text} />
      {showLabel && <span>{allergen.label}</span>}
      {removable && (
        <button
          onClick={onRemove}
          style={{
            background: "rgba(0,0,0,0.12)", border: "none", borderRadius: "50%",
            width: 14, height: 14, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 9, color: allergen.text, fontWeight: 800, padding: 0,
          }}
        >×</button>
      )}
    </div>
  );
}