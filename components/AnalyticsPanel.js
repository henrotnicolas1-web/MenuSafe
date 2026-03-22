"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { BarChart2, Smartphone, Globe, TrendingUp, Eye } from "lucide-react";

const LANG_LABELS = {
  fr: "Français", en: "English", es: "Español", de: "Deutsch",
  it: "Italiano", nl: "Nederlands", ja: "日本語", zh: "中文",
};

const PERIODS = [
  { key: "7d",  label: "7 jours" },
  { key: "30d", label: "30 jours" },
  { key: "90d", label: "3 mois" },
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

    const { data: scans } = await supabase
      .from("qr_scans")
      .select("lang, device_type, scanned_at")
      .eq("establishment_id", estId)
      .gte("scanned_at", since)
      .order("scanned_at", { ascending: true });

    if (!scans) { setLoading(false); return; }

    // Total scans
    const total = scans.length;

    // Par langue
    const byLang = {};
    scans.forEach(s => {
      byLang[s.lang] = (byLang[s.lang] || 0) + 1;
    });
    const langSorted = Object.entries(byLang)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    // Par device
    const byDevice = {};
    scans.forEach(s => {
      const d = s.device_type || "mobile";
      byDevice[d] = (byDevice[d] || 0) + 1;
    });

    // Par jour (courbe)
    const byDay = {};
    scans.forEach(s => {
      const day = s.scanned_at.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });

    // Générer tous les jours de la période
    const allDays = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      allDays.push({ date: key, count: byDay[key] || 0 });
    }

    // Moyenne par jour
    const avgPerDay = total > 0 ? (total / days).toFixed(1) : 0;

    // Comparaison période précédente
    const prevSince = new Date(Date.now() - days * 2 * 86400000).toISOString();
    const { data: prevScans } = await supabase
      .from("qr_scans")
      .select("id", { count: "exact", head: true })
      .eq("establishment_id", estId)
      .gte("scanned_at", prevSince)
      .lt("scanned_at", since);
    const prevTotal = prevScans?.length ?? 0;
    const growth = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : null;

    setData({ total, byLang: langSorted, byDevice, allDays, avgPerDay, growth });
    setLoading(false);
  }

  if (!isPro) return (
    <div style={{ background: "#FFF8E6", border: "1px solid #FDE68A", borderRadius: 14, padding: "24px", textAlign: "center" }}>
      <BarChart2 size={32} color="#856404" style={{ marginBottom: 10 }} />
      <p style={{ fontSize: 14, fontWeight: 700, color: "#856404", margin: "0 0 6px" }}>Analytics disponibles en plan Pro</p>
      <p style={{ fontSize: 13, color: "#B68A00", margin: "0 0 14px", lineHeight: 1.6 }}>
        Découvrez combien de clients consultent votre carte, dans quelle langue, et depuis quel appareil.
      </p>
      <a href="/upgrade" style={{ fontSize: 13, fontWeight: 700, padding: "9px 20px", background: "#1A1A1A", color: "white", borderRadius: 10, textDecoration: "none" }}>
        Passer au Pro →
      </a>
    </div>
  );

  return (
    <div>
      {/* Header + période */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BarChart2 size={18} color="#1A1A1A" />
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>Analytics carte interactive</span>
        </div>
        <div style={{ display: "flex", gap: 4, background: "#F0F0F0", borderRadius: 9, padding: 3 }}>
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              style={{ fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 7, border: "none", cursor: "pointer",
                background: period === p.key ? "white" : "transparent",
                color: period === p.key ? "#1A1A1A" : "#888",
                boxShadow: period === p.key ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#BBB", fontSize: 13 }}>Chargement...</div>
      ) : !data || data.total === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: "#F7F7F5", borderRadius: 14, border: "1px solid #EBEBEB" }}>
          <Eye size={28} color="#DDD" style={{ marginBottom: 10 }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#888", margin: "0 0 4px" }}>Aucun scan pour cette période</p>
          <p style={{ fontSize: 12, color: "#BBB", margin: 0 }}>Les données apparaîtront dès que des clients scanneront votre QR code.</p>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Eye size={14} color="#888" />
                <span style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Scans</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>{data.total}</div>
              {data.growth !== null && (
                <div style={{ fontSize: 11, fontWeight: 600, color: data.growth >= 0 ? "#155724" : "#CC0000", marginTop: 2 }}>
                  {data.growth >= 0 ? "↑" : "↓"} {Math.abs(data.growth)}% vs période préc.
                </div>
              )}
            </div>

            <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <TrendingUp size={14} color="#888" />
                <span style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Moy/jour</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>{data.avgPerDay}</div>
              <div style={{ fontSize: 11, color: "#BBB", marginTop: 2 }}>scans par jour</div>
            </div>

            <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Smartphone size={14} color="#888" />
                <span style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Mobile</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em" }}>
                {data.total > 0 ? Math.round(((data.byDevice.mobile || 0) / data.total) * 100) : 0}%
              </div>
              <div style={{ fontSize: 11, color: "#BBB", marginTop: 2 }}>des consultations</div>
            </div>
          </div>

          {/* Courbe scans par jour */}
          <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "16px", marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>Scans par jour</p>
            <MiniBarChart days={data.allDays} />
          </div>

          {/* Langues */}
          {data.byLang.length > 0 && (
            <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "16px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <Globe size={14} color="#888" />
                <p style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>Langues utilisées</p>
              </div>
              {data.byLang.map(([lang, count]) => {
                const pct = Math.round((count / data.total) * 100);
                return (
                  <div key={lang} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#444" }}>{LANG_LABELS[lang] || lang.toUpperCase()}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A" }}>{count} <span style={{ color: "#AAA", fontWeight: 400 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: 6, background: "#F0F0F0", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#1A1A1A", borderRadius: 3, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Devices */}
          <div style={{ background: "white", border: "1px solid #EBEBEB", borderRadius: 12, padding: "16px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>Appareils</p>
            <div style={{ display: "flex", gap: 10 }}>
              {Object.entries(data.byDevice).map(([device, count]) => {
                const pct = Math.round((count / data.total) * 100);
                const icons = { mobile: "📱", tablet: "💻", desktop: "🖥️" };
                const labels = { mobile: "Mobile", tablet: "Tablette", desktop: "Desktop" };
                return (
                  <div key={device} style={{ flex: 1, textAlign: "center", background: "#F7F7F5", borderRadius: 10, padding: "12px 8px" }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{icons[device] || "📱"}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A" }}>{pct}%</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{labels[device] || device}</div>
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

function MiniBarChart({ days }) {
  const max = Math.max(...days.map(d => d.count), 1);
  const showEvery = days.length > 14 ? 7 : days.length > 7 ? 3 : 1;

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 60 }}>
      {days.map((d, i) => {
        const h = Math.round((d.count / max) * 52);
        const showLabel = i % showEvery === 0;
        return (
          <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div title={`${d.date}: ${d.count} scans`}
              style={{ width: "100%", height: h || 2, background: d.count > 0 ? "#1A1A1A" : "#F0F0F0",
                borderRadius: 2, minHeight: 2, transition: "height 0.3s ease" }} />
            {showLabel && (
              <span style={{ fontSize: 8, color: "#CCC", whiteSpace: "nowrap" }}>
                {new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).replace(" ", "/")}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}