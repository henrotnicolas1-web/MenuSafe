// Drapeaux SVG inline — pas d'emojis Apple, cohérents sur tous les OS

export const FLAG_SVGS = {
  fr: (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="20" fill="#002395"/>
      <rect x="10" width="10" height="20" fill="#EDEDED"/>
      <rect x="20" width="10" height="20" fill="#ED2939"/>
    </svg>
  ),
  en: (
    <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="white" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 V30 M0,15 H60" stroke="white" strokeWidth="10"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  ),
  es: (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#AA151B"/>
      <rect y="5" width="30" height="10" fill="#F1BF00"/>
    </svg>
  ),
  de: (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#000000"/>
      <rect y="7" width="30" height="7" fill="#DD0000"/>
      <rect y="14" width="30" height="6" fill="#FFCE00"/>
    </svg>
  ),
  it: (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="20" fill="#009246"/>
      <rect x="10" width="10" height="20" fill="#EDEDED"/>
      <rect x="20" width="10" height="20" fill="#CE2B37"/>
    </svg>
  ),
  nl: (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#AE1C28"/>
      <rect y="7" width="30" height="7" fill="#EDEDED"/>
      <rect y="14" width="30" height="6" fill="#21468B"/>
    </svg>
  ),
  ja: (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#EDEDED"/>
      <circle cx="15" cy="10" r="6" fill="#BC002D"/>
    </svg>
  ),
  zh: (
    <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#DE2910"/>
      <polygon points="5,2 6.5,6.5 2,4 8,4 3.5,6.5" fill="#FFDE00"/>
      <polygon points="10,1 10.8,3.2 8.6,1.8 11.4,1.8 9.2,3.2" fill="#FFDE00"/>
      <polygon points="12,3 12.5,5.2 10.5,3.8 13,3.8 11,5.2" fill="#FFDE00"/>
      <polygon points="12,6 12,8.2 10.2,6.8 12.8,6.8 11,8.2" fill="#FFDE00"/>
      <polygon points="10,9 10.8,11.2 8.6,9.8 11.4,9.8 9.2,11.2" fill="#FFDE00"/>
    </svg>
  ),
};

export const LANG_LABELS = {
  fr: "Français",
  en: "English",
  es: "Español",
  de: "Deutsch",
  it: "Italiano",
  nl: "Nederlands",
  ja: "日本語",
  zh: "中文",
};

export function LangFlag({ code, size = 28, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      title={LANG_LABELS[code] || code}
      style={{
        width: size, height: Math.round(size * 0.67),
        border: active ? "2.5px solid #1A1A1A" : "1.5px solid #D0D0D0",
        borderRadius: 4,
        cursor: "pointer",
        padding: 0,
        overflow: "hidden",
        display: "inline-flex",
        background: "none",
        boxShadow: active ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      <svg
        viewBox={FLAG_SVGS[code]?.props?.viewBox || "0 0 30 20"}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {FLAG_SVGS[code]?.props?.children}
      </svg>
    </button>
  );
}