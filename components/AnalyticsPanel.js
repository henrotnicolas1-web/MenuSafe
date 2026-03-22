"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { BarChart2, Smartphone, Globe, TrendingUp, Eye, Monitor, Tablet, ShieldAlert } from "lucide-react";

const LANG_FLAGS = {
  fr:"🇫🇷", en:"🇬🇧", es:"🇪🇸", de:"🇩🇪",
  it:"🇮🇹", nl:"🇳🇱", ja:"🇯🇵", zh:"🇨🇳",
};
const LANG_LABELS = {
  fr:"Français", en:"English", es:"Español", de:"Deutsch",
  it:"Italiano", nl:"Nederlands", ja:"日本語", zh:"中文",
};
const ALLERGEN_LABELS = {
  gluten:"Gluten", crustaces:"Crustacés", oeufs:"Œufs", poissons:"Poissons",
  arachides:"Arachides", soja:"Soja", lait:"Lait", fruits_coq:"Fruits à coque",
  celeri:"Céleri", moutarde:"Moutarde", sesame:"Sésame", so2:"Sulfites",
  lupin:"Lupin", mollusques:"Mollusques",
};

const PERIODS = [
  { key:"7d",  label:"7 jours" },
  { key:"30d", label:"30 jours" },
  { key:"90d", label:"3 mois" },
];

export default function AnalyticsPanel({ estId, isPro }) {
  const [period, setPeriod]   = useState("30d");
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!estId) return;
    loadAnalytics();
  }, [estId, period]);

  async function loadAnalytics() {
    setLoading(true);
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const since = new Date(Date.now() - days * 86400000).toISOString();
    const prevSince = new Date(Date.now() - days * 2 * 86400000).toISOString();

    // Fetch en parallèle
    const [{ data: scans }, { data: events }, { data: prevScans }] = await Promise.all([
      supabase.from("qr_scans")
        .select("session_id, device_type, scanned_at")
        .eq("establishment_id", estId)
        .gte("scanned_at", since)
        .order("scanned_at", { ascending: true }),
      supabase.from("qr_events")
        .select("session_id, event_type, payload, created_at")
        .eq("establishment_id", estId)
        .gte("created_at", since),
      supabase.from("qr_scans")
        .select("session_id", { count: "exact", head: true })
        .eq("establishment_id", estId)
        .gte("scanned_at", prevSince)
        .lt("scanned_at", since),
    ]);

    if (!scans) { setLoading(false); return; }

    const total = scans.length;
    const prevTotal = prevScans ?? 0;
    const growth = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : null;
    const avgPerDay = total > 0 ? (total / days).toFixed(1) : 0;

    // ── Langue réelle = dernier lang_change par session ───────────────────────
    // Si pas de lang_change → la session est restée en FR (langue par défaut)
    const lastLangBySession = {};
    (events || [])
      .filter(e => e.event_type === "lang_change")
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .forEach(e => {
        lastLangBySession[e.session_id] = e.payload?.lang;
      });

    const byLang = {};
    scans.forEach(s => {
      const l = lastLangBySession[s.session_id] || "fr";
      byLang[l] = (byLang[l] || 0) + 1;
    });
    const langSorted = Object.entries(byLang)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    // ── Top allergènes (sessions uniques qui ont coché cet allergène) ─────────
    const allergenSessions = {}; // allergen_id → Set de session_ids
    (events || [])
      .filter(e => e.event_type === "allergen_toggle" && e.payload?.active === true)
      .forEach(e => {
        const id = e.payload?.allergen;
        if (!id) return;
        if (!allergenSessions[id]) allergenSessions[id] = new Set();
        allergenSessions[id].add(e.session_id);
      });
    const allergenCounts = Object.entries(allergenSessions)
      .map(([id, sessions]) => [id, sessions.size])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    // Taux de filtrage : sessions ayant coché au moins 1 allergène
    const sessionsWithFilter = new Set(
      (events || [])
        .filter(e => e.event_type === "allergen_toggle" && e.payload?.active === true)
        .map(e => e.session_id)
    );
    const filterRate = total > 0 ? Math.round((sessionsWithFilter.size / total) * 100) : 0;

    // ── Diet filters (sessions uniques) ───────────────────────────────────────
    const dietBySession = {};
    (events || [])
      .filter(e => e.event_type === "diet_filter")
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .forEach(e => {
        dietBySession[e.session_id] = e.payload?.filter;
      });
    const vegSessions = Object.values(dietBySession).filter(f => f === "vegetarian").length;
    const veganSessions = Object.values(dietBySession).filter(f => f === "vegan").length;

    // ── Devices ───────────────────────────────────────────────────────────────
    const byDevice = {};
    scans.forEach(s => {
      const d = s.device_type || "mobile";
      byDevice[d] = (byDevice[d] || 0) + 1;
    });

    // ── Courbe par jour ───────────────────────────────────────────────────────
    const byDay = {};
    scans.forEach(s => {
      const day = s.scanned_at.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });
    const allDays = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      allDays.push({ date: key, count: byDay[key] || 0 });
    }

    setData({
      total, prevTotal, growth, avgPerDay,
      byLang: langSorted,
      allergenCounts,
      filterRate,
      vegSessions, veganSessions,
      byDevice,
      allDays,
    });
    setLoading(false);
  }

  // ── Gate Pro ─────────────────────────────────────────────────────────────────
  if (!isPro) return (
    <div style={{ background:"#FFF8E6", border:"1px solid #FDE68A", borderRadius:14, padding:"24px", textAlign:"center" }}>
      <BarChart2 size={32} color="#856404" style={{ marginBottom:10 }} />
      <p style={{ fontSize:14, fontWeight:700, color:"#856404", margin:"0 0 6px" }}>Analytics disponibles en plan Pro</p>
      <p style={{ fontSize:13, color:"#B68A00", margin:"0 0 14px", lineHeight:1.6 }}>
        Découvrez combien de clients consultent votre carte, dans quelle langue, et quels allergènes ils filtrent.
      </p>
      <a href="/upgrade" style={{ fontSize:13, fontWeight:700, padding:"9px 20px", background:"#1A1A1A", color:"white", borderRadius:10, textDecoration:"none" }}>
        Passer au Pro →
      </a>
    </div>
  );

  return (
    <div>
      {/* Header + toggles période */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <BarChart2 size={18} color="#1A1A1A" />
          <span style={{ fontSize:15, fontWeight:700, color:"#1A1A1A" }}>Analytics carte interactive</span>
        </div>
        <div style={{ display:"flex", gap:4, background:"#F0F0F0", borderRadius:9, padding:3 }}>
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              style={{ fontSize:12, fontWeight:600, padding:"5px 10px", borderRadius:7, border:"none", cursor:"pointer",
                background: period === p.key ? "white" : "transparent",
                color: period === p.key ? "#1A1A1A" : "#888",
                boxShadow: period === p.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"40px 0", color:"#BBB", fontSize:13 }}>Chargement...</div>
      ) : !data || data.total === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 20px", background:"#F7F7F5", borderRadius:14, border:"1px solid #EBEBEB" }}>
          <Eye size={28} color="#DDD" style={{ marginBottom:10 }} />
          <p style={{ fontSize:14, fontWeight:600, color:"#888", margin:"0 0 4px" }}>Aucun scan pour cette période</p>
          <p style={{ fontSize:12, color:"#BBB", margin:0 }}>Les données apparaîtront dès que des clients scanneront votre QR code.</p>
        </div>
      ) : (
        <>
          {/* ── KPIs ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginBottom:12 }}>
            <KpiCard
              icon={<Eye size={14} color="#888" />}
              label="Scans"
              value={data.total}
              sub={data.growth !== null
                ? <span style={{ color: data.growth >= 0 ? "#155724" : "#CC0000" }}>
                    {data.growth >= 0 ? "↑" : "↓"} {Math.abs(data.growth)}% vs préc.
                  </span>
                : null}
            />
            <KpiCard
              icon={<TrendingUp size={14} color="#888" />}
              label="Moy/jour"
              value={data.avgPerDay}
              sub="scans par jour"
            />
            <KpiCard
              icon={<ShieldAlert size={14} color="#888" />}
              label="Filtrent"
              value={`${data.filterRate}%`}
              sub="cochent un allergène"
            />
          </div>

          {/* ── Vegan / Végé ── */}
          {(data.vegSessions > 0 || data.veganSessions > 0) && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
              <div style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontSize:11, color:"#888", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Végétarien</div>
                <div style={{ fontSize:22, fontWeight:800, color:"#1A1A1A" }}>{data.vegSessions}</div>
                <div style={{ fontSize:11, color:"#BBB" }}>sessions filtrées</div>
              </div>
              <div style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontSize:11, color:"#888", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Vegan</div>
                <div style={{ fontSize:22, fontWeight:800, color:"#1A1A1A" }}>{data.veganSessions}</div>
                <div style={{ fontSize:11, color:"#BBB" }}>sessions filtrées</div>
              </div>
            </div>
          )}

          {/* ── Courbe scans/jour ── */}
          <div style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:12, padding:"16px", marginBottom:12 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 12px" }}>
              Scans par jour
            </p>
            <MiniBarChart days={data.allDays} />
          </div>

          {/* ── Top allergènes ── */}
          {data.allergenCounts.length > 0 && (
            <div style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:12, padding:"16px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
                <ShieldAlert size={14} color="#888" />
                <p style={{ fontSize:12, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:"0.05em", margin:0 }}>
                  Allergènes les plus filtrés
                </p>
              </div>
              {data.allergenCounts.map(([id, count]) => {
                const pct = Math.round((count / data.total) * 100);
                return (
                  <div key={id} style={{ marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <span style={{ fontSize:13, fontWeight:500, color:"#444" }}>
                        {ALLERGEN_LABELS[id] || id}
                      </span>
                      <span style={{ fontSize:12, fontWeight:700, color:"#1A1A1A" }}>
                        {count} <span style={{ color:"#AAA", fontWeight:400 }}>session{count > 1 ? "s" : ""}</span>
                      </span>
                    </div>
                    <div style={{ height:6, background:"#F0F0F0", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${Math.min(pct * 2, 100)}%`,
                        background:"#1A1A1A", borderRadius:3, transition:"width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
              <p style={{ fontSize:11, color:"#CCC", margin:"8px 0 0" }}>
                Nombre de sessions uniques ayant coché cet allergène
              </p>
            </div>
          )}

          {/* ── Langues (réelles) ── */}
          {data.byLang.length > 0 && (
            <div style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:12, padding:"16px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
                <Globe size={14} color="#888" />
                <p style={{ fontSize:12, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:"0.05em", margin:0 }}>
                  Langues utilisées
                </p>
                <span style={{ fontSize:10, color:"#BBB", marginLeft:"auto" }}>langue finale de la session</span>
              </div>
              {data.byLang.map(([lang, count]) => {
                const pct = Math.round((count / data.total) * 100);
                return (
                  <div key={lang} style={{ marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3, alignItems:"center" }}>
                      <span style={{ fontSize:13, fontWeight:500, color:"#444", display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:16 }}>{LANG_FLAGS[lang] || "🌐"}</span>
                        {LANG_LABELS[lang] || lang.toUpperCase()}
                      </span>
                      <span style={{ fontSize:12, fontWeight:700, color:"#1A1A1A" }}>
                        {count} <span style={{ color:"#AAA", fontWeight:400 }}>({pct}%)</span>
                      </span>
                    </div>
                    <div style={{ height:6, background:"#F0F0F0", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:"#1A1A1A", borderRadius:3, transition:"width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Appareils ── */}
          <div style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:12, padding:"16px" }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 12px" }}>
              Appareils
            </p>
            <div style={{ display:"flex", gap:10 }}>
              {Object.entries(data.byDevice).map(([device, count]) => {
                const pct = Math.round((count / data.total) * 100);
                const DeviceIcon = device === "desktop" ? Monitor : device === "tablet" ? Tablet : Smartphone;
                const labels = { mobile:"Mobile", tablet:"Tablette", desktop:"Desktop" };
                return (
                  <div key={device} style={{ flex:1, textAlign:"center", background:"#F7F7F5", borderRadius:10, padding:"12px 8px" }}>
                    <DeviceIcon size={20} color="#888" style={{ marginBottom:4 }} />
                    <div style={{ fontSize:18, fontWeight:800, color:"#1A1A1A" }}>{pct}%</div>
                    <div style={{ fontSize:11, color:"#888" }}>{labels[device] || device}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Sous-composants ───────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub }) {
  return (
    <div style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:12, padding:"16px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
        {icon}
        <span style={{ fontSize:11, color:"#888", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</span>
      </div>
      <div style={{ fontSize:28, fontWeight:800, color:"#1A1A1A", letterSpacing:"-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"#BBB", marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function MiniBarChart({ days }) {
  const max = Math.max(...days.map(d => d.count), 1);
  const showEvery = days.length > 14 ? 7 : days.length > 7 ? 3 : 1;
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:2, height:64 }}>
      {days.map((d, i) => {
        const h = Math.round((d.count / max) * 52);
        const showLabel = i % showEvery === 0;
        return (
          <div key={d.date} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <div title={`${d.date}: ${d.count} scans`}
              style={{ width:"100%", height: h || 2, minHeight:2,
                background: d.count > 0 ? "#1A1A1A" : "#F0F0F0",
                borderRadius:2, transition:"height 0.3s ease" }} />
            {showLabel && (
              <span style={{ fontSize:8, color:"#CCC", whiteSpace:"nowrap" }}>
                {new Date(d.date).toLocaleDateString("fr-FR", { day:"numeric", month:"short" }).replace(" ", "/")}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}