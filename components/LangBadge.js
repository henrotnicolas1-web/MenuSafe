// Sélecteur de langue sans emojis — codes texte colorés

const LANG_STYLES = {
  fr: { label: "FR", bg: "#003189", color: "white" },
  en: { label: "EN", bg: "#C8102E", color: "white" },
  es: { label: "ES", bg: "#AA151B", color: "white" },
  de: { label: "DE", bg: "#000000", color: "#FFD700" },
  it: { label: "IT", bg: "#009246", color: "white" },
  nl: { label: "NL", bg: "#AE1C28", color: "white" },
  ja: { label: "JP", bg: "#BC002D", color: "white" },
  zh: { label: "ZH", bg: "#DE2910", color: "#FFDE00" },
};

export function LangButton({ code, active, onClick, size = "md" }) {
  const style = LANG_STYLES[code] || { label: code.toUpperCase(), bg: "#555", color: "white" };
  const dim = size === "sm" ? 28 : 36;
  const fontSize = size === "sm" ? 9 : 11;

  return (
    <button
      onClick={() => onClick(code)}
      title={code}
      style={{
        width: dim, height: dim, borderRadius: 8,
        background: active ? style.bg : "#F0F0F0",
        color: active ? style.color : "#888",
        border: active ? `2px solid ${style.bg}` : "2px solid transparent",
        cursor: "pointer", fontSize, fontWeight: 800,
        fontFamily: "'Inter', sans-serif", letterSpacing: "0.02em",
        transition: "all 0.15s",
      }}
    >
      {style.label}
    </button>
  );
}

export { LANG_STYLES };