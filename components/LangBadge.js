"use client";

export const LANG_LABELS = {
  fr: "Français", en: "English", es: "Español", de: "Deutsch",
  it: "Italiano", nl: "Nederlands", ja: "日本語", zh: "中文",
};

function FlagFR({ w, h }) {
  return <svg viewBox="0 0 3 2" width={w} height={h}><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ED2939"/></svg>;
}
function FlagEN({ w, h }) {
  return <svg viewBox="0 0 60 30" width={w} height={h}><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="white" strokeWidth="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/><path d="M30,0 V30 M0,15 H60" stroke="white" strokeWidth="10"/><path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/></svg>;
}
function FlagES({ w, h }) {
  return <svg viewBox="0 0 3 2" width={w} height={h}><rect width="3" height="2" fill="#AA151B"/><rect y="0.5" width="3" height="1" fill="#F1BF00"/></svg>;
}
function FlagDE({ w, h }) {
  return <svg viewBox="0 0 5 3" width={w} height={h}><rect width="5" height="1" fill="#000"/><rect y="1" width="5" height="1" fill="#DD0000"/><rect y="2" width="5" height="1" fill="#FFCE00"/></svg>;
}
function FlagIT({ w, h }) {
  return <svg viewBox="0 0 3 2" width={w} height={h}><rect width="1" height="2" fill="#009246"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#CE2B37"/></svg>;
}
function FlagNL({ w, h }) {
  return <svg viewBox="0 0 3 2" width={w} height={h}><rect width="3" height="2" fill="#21468B"/><rect width="3" height="1.33" fill="#fff"/><rect width="3" height="0.67" fill="#AE1C28"/></svg>;
}
function FlagJA({ w, h }) {
  return <svg viewBox="0 0 3 2" width={w} height={h}><rect width="3" height="2" fill="#fff"/><circle cx="1.5" cy="1" r="0.6" fill="#BC002D"/></svg>;
}
function FlagZH({ w, h }) {
  return <svg viewBox="0 0 30 20" width={w} height={h}><rect width="30" height="20" fill="#DE2910"/><circle cx="5" cy="5" r="3" fill="#FFDE00"/><circle cx="10" cy="2" r="1" fill="#FFDE00"/><circle cx="12" cy="5" r="1" fill="#FFDE00"/><circle cx="11" cy="8" r="1" fill="#FFDE00"/><circle cx="8" cy="10" r="1" fill="#FFDE00"/></svg>;
}

const FLAG_COMPONENTS = { fr: FlagFR, en: FlagEN, es: FlagES, de: FlagDE, it: FlagIT, nl: FlagNL, ja: FlagJA, zh: FlagZH };

export function LangFlag({ code, size = 28, active = false, onClick }) {
  const FlagComp = FLAG_COMPONENTS[code];
  const w = size;
  const h = Math.round(size * 0.67);

  return (
    <button
      onClick={onClick}
      title={LANG_LABELS[code] || code}
      style={{
        width: w, height: h,
        border: active ? "2.5px solid #1A1A1A" : "1.5px solid #D0D0D0",
        borderRadius: 3,
        cursor: "pointer",
        padding: 0,
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#EEE",
        boxShadow: active ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      {FlagComp ? <FlagComp w={w} h={h} /> : <span style={{ fontSize: 9, fontWeight: 700 }}>{code.toUpperCase()}</span>}
    </button>
  );
}

export function LangButton({ code, active, onClick, size = "md" }) {
  return <LangFlag code={code} active={active} onClick={onClick} size={size === "sm" ? 22 : 30} />;
}