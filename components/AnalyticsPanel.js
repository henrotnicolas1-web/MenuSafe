"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { BarChart2, Smartphone, Globe, TrendingUp, Eye, Monitor, Tablet, ShieldAlert, Download } from "lucide-react";

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

// ── Générateur PDF ────────────────────────────────────────────────────────────

async function generateAnalyticsPDF({ estName, estLogo, period, data }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210;
  const MARGIN = 16;
  const COL = W - MARGIN * 2;
  const periodLabel = period === "7d" ? "7 derniers jours" : period === "30d" ? "30 derniers jours" : "3 derniers mois";
  const today = new Date().toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" });

  let y = 0;

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function setFont(size, weight = "normal", color = [26, 26, 26]) {
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setFont("helvetica", weight);
  }

  function rect(x, fy, w, h, r = 3, fill = [247, 247, 245], stroke = null) {
    doc.setFillColor(...fill);
    if (stroke) doc.setDrawColor(...stroke);
    doc.roundedRect(x, fy, w, h, r, r, stroke ? "FD" : "F");
  }

  function bar(x, fy, w, h, fill = [26, 26, 26]) {
    doc.setFillColor(...fill);
    doc.rect(x, fy, w, h, "F");
  }

  function checkPageBreak(needed = 30) {
    if (y + needed > 277) {
      doc.addPage();
      y = MARGIN;
    }
  }

  // ── HEADER ───────────────────────────────────────────────────────────────────
  // Fond noir header
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, W, 42, "F");

  // Logo SVG bouclier — dessiné en vecteur jsPDF
  const lx = MARGIN, ly = 8;
  doc.setFillColor(45, 45, 45);
  // Bouclier simplifié (rectangle arrondi)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(lx, ly + 1, 16, 20, 2, 2, "F");
  doc.setFillColor(26, 26, 26);
  doc.roundedRect(lx + 1, ly + 2, 14, 17, 1.5, 1.5, "F");
  // Checkmark vert
  doc.setDrawColor(74, 222, 128);
  doc.setLineWidth(1.5);
  doc.line(lx + 4, ly + 11, lx + 7, ly + 14);
  doc.line(lx + 7, ly + 14, lx + 13, ly + 7);

  // MenuSafe
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("MenuSafe", lx + 20, ly + 10);
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text("Analytics · Rapport", lx + 20, ly + 16);

  // Nom du restaurant à droite
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  const estNameShort = estName?.length > 30 ? estName.slice(0, 30) + "…" : (estName || "Établissement");
  doc.text(estNameShort, W - MARGIN, ly + 10, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(`Généré le ${today}`, W - MARGIN, ly + 16, { align: "right" });
  doc.text(`Période : ${periodLabel}`, W - MARGIN, ly + 21, { align: "right" });

  y = 50;

  // ── TITRE SECTION ────────────────────────────────────────────────────────────
  setFont(18, "bold");
  doc.text("Rapport d'analytics", MARGIN, y);
  setFont(10, "normal", [136, 136, 136]);
  doc.text(`Carte interactive QR · ${periodLabel}`, MARGIN, y + 6);
  y += 16;

  // ── KPIs 3 colonnes ──────────────────────────────────────────────────────────
  const kpiW = (COL - 8) / 3;
  const kpis = [
    { label: "Scans totaux", value: String(data.total), sub: data.growth !== null ? `${data.growth >= 0 ? "↑" : "↓"} ${Math.abs(data.growth)}% vs période préc.` : "Première période" },
    { label: "Moy. par jour",  value: String(data.avgPerDay), sub: "scans / jour" },
    { label: "Filtrent",       value: `${data.filterRate}%`, sub: "cochent un allergène" },
  ];

  kpis.forEach((kpi, i) => {
    const kx = MARGIN + i * (kpiW + 4);
    rect(kx, y, kpiW, 28, 3, [255, 255, 255], [235, 235, 235]);
    setFont(8, "bold", [136, 136, 136]);
    doc.text(kpi.label.toUpperCase(), kx + 6, y + 8);
    setFont(18, "bold", [26, 26, 26]);
    doc.text(kpi.value, kx + 6, y + 19);
    setFont(8, "normal", [187, 187, 187]);
    doc.text(kpi.sub, kx + 6, y + 25);
  });
  y += 36;

  // Régimes alimentaires
  if (data.vegSessions > 0 || data.veganSessions > 0) {
    const dietW = (COL - 4) / 2;
    [
      { label: "Végétarien", value: data.vegSessions },
      { label: "Vegan",      value: data.veganSessions },
    ].forEach((d, i) => {
      const dx = MARGIN + i * (dietW + 4);
      rect(dx, y, dietW, 22, 3, [255, 255, 255], [235, 235, 235]);
      setFont(8, "bold", [136, 136, 136]);
      doc.text(d.label.toUpperCase(), dx + 6, y + 8);
      setFont(16, "bold", [26, 26, 26]);
      doc.text(String(d.value), dx + 6, y + 18);
    });
    y += 30;
  }

  // ── SCANS PAR JOUR ──────────────────────────────────────────────────────────
  checkPageBreak(50);
  rect(MARGIN, y, COL, 50, 3, [255, 255, 255], [235, 235, 235]);
  setFont(8, "bold", [136, 136, 136]);
  doc.text("SCANS PAR JOUR", MARGIN + 6, y + 8);

  const chartX = MARGIN + 6;
  const chartY = y + 12;
  const chartW = COL - 12;
  const chartH = 28;
  const maxCount = Math.max(...data.allDays.map(d => d.count), 1);
  const barW = chartW / data.allDays.length;

  // Fond gris clair du graphe
  doc.setFillColor(247, 247, 245);
  doc.rect(chartX, chartY, chartW, chartH, "F");

  data.allDays.forEach((d, i) => {
    const h = Math.max((d.count / maxCount) * (chartH - 4), d.count > 0 ? 2 : 0);
    const bx = chartX + i * barW;
    const by = chartY + chartH - h;
    if (d.count > 0) {
      bar(bx + 0.5, by, barW - 1, h, [26, 26, 26]);
    }
  });

  // Labels dates (début, milieu, fin)
  const showEvery = data.allDays.length > 14 ? 7 : 3;
  setFont(7, "normal", [204, 204, 204]);
  data.allDays.forEach((d, i) => {
    if (i % showEvery === 0) {
      const label = new Date(d.date).toLocaleDateString("fr-FR", { day:"numeric", month:"short" });
      doc.text(label, chartX + i * barW + barW / 2, chartY + chartH + 5, { align: "center" });
    }
  });

  y += 58;

  // ── TOP ALLERGÈNES ──────────────────────────────────────────────────────────
  if (data.allergenCounts.length > 0) {
    checkPageBreak(14 + data.allergenCounts.length * 12);
    rect(MARGIN, y, COL, 14 + data.allergenCounts.length * 12 + 8, 3, [255, 255, 255], [235, 235, 235]);
    setFont(8, "bold", [136, 136, 136]);
    doc.text("ALLERGÈNES LES PLUS FILTRÉS", MARGIN + 6, y + 8);

    let ay = y + 14;
    data.allergenCounts.forEach(([id, count]) => {
      const pct = Math.round((count / data.total) * 100);
      const barMaxW = COL - 60;

      setFont(10, "normal", [68, 68, 68]);
      doc.text(ALLERGEN_LABELS[id] || id, MARGIN + 6, ay + 4);
      setFont(10, "bold", [26, 26, 26]);
      doc.text(`${count} session${count > 1 ? "s" : ""}`, W - MARGIN - 6, ay + 4, { align: "right" });

      // Barre de progression
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(MARGIN + 6, ay + 6, barMaxW, 3, 1, 1, "F");
      doc.setFillColor(26, 26, 26);
      doc.roundedRect(MARGIN + 6, ay + 6, Math.max((pct / 100) * barMaxW, 2), 3, 1, 1, "F");

      ay += 12;
    });
    y = ay + 8;
  }

  // ── LANGUES ─────────────────────────────────────────────────────────────────
  if (data.byLang.length > 0) {
    checkPageBreak(14 + data.byLang.length * 12);
    rect(MARGIN, y, COL, 14 + data.byLang.length * 12 + 8, 3, [255, 255, 255], [235, 235, 235]);
    setFont(8, "bold", [136, 136, 136]);
    doc.text("LANGUES UTILISÉES", MARGIN + 6, y + 8);
    setFont(7, "normal", [187, 187, 187]);
    doc.text("langue finale de chaque session", W - MARGIN - 6, y + 8, { align: "right" });

    let ly2 = y + 14;
    data.byLang.forEach(([lang, count]) => {
      const pct = Math.round((count / data.total) * 100);
      const barMaxW = COL - 60;

      setFont(10, "normal", [68, 68, 68]);
      doc.text(`${LANG_LABELS[lang] || lang.toUpperCase()}`, MARGIN + 6, ly2 + 4);
      setFont(10, "bold", [26, 26, 26]);
      doc.text(`${count} (${pct}%)`, W - MARGIN - 6, ly2 + 4, { align: "right" });

      doc.setFillColor(240, 240, 240);
      doc.roundedRect(MARGIN + 6, ly2 + 6, barMaxW, 3, 1, 1, "F");
      doc.setFillColor(26, 26, 26);
      doc.roundedRect(MARGIN + 6, ly2 + 6, Math.max((pct / 100) * barMaxW, 2), 3, 1, 1, "F");

      ly2 += 12;
    });
    y = ly2 + 8;
  }

  // ── APPAREILS ───────────────────────────────────────────────────────────────
  if (Object.keys(data.byDevice).length > 0) {
    checkPageBreak(44);
    const devices = Object.entries(data.byDevice);
    const devW = (COL - (devices.length - 1) * 4) / devices.length;
    const labels = { mobile:"Mobile", tablet:"Tablette", desktop:"Desktop" };

    rect(MARGIN, y, COL, 40, 3, [255, 255, 255], [235, 235, 235]);
    setFont(8, "bold", [136, 136, 136]);
    doc.text("APPAREILS", MARGIN + 6, y + 8);

    devices.forEach(([device, count], i) => {
      const pct = Math.round((count / data.total) * 100);
      const dx = MARGIN + i * (devW + 4);
      rect(dx + 2, y + 12, devW - 4, 24, 2, [247, 247, 245]);
      setFont(16, "bold", [26, 26, 26]);
      doc.text(`${pct}%`, dx + devW / 2, y + 26, { align: "center" });
      setFont(8, "normal", [136, 136, 136]);
      doc.text(labels[device] || device, dx + devW / 2, y + 32, { align: "center" });
    });
    y += 48;
  }

  // ── FOOTER ──────────────────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFillColor(247, 247, 245);
    doc.rect(0, 284, W, 13, "F");
    setFont(8, "normal", [187, 187, 187]);
    doc.text("MenuSafe · Rapport analytics carte interactive · Conforme règlement INCO UE n°1169/2011", MARGIN, 291);
    doc.text(`Page ${p}/${pageCount}`, W - MARGIN, 291, { align: "right" });
  }

  // ── Sauvegarde ───────────────────────────────────────────────────────────────
  const filename = `analytics-${(estName || "restaurant").toLowerCase().replace(/[^a-z0-9]/g, "-")}-${period}-${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(filename);
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AnalyticsPanel({ estId, estName, isPro }) {
  const [period, setPeriod]       = useState("30d");
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [exporting, setExporting] = useState(false);
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

    const lastLangBySession = {};
    (events || [])
      .filter(e => e.event_type === "lang_change")
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .forEach(e => { lastLangBySession[e.session_id] = e.payload?.lang; });

    const byLang = {};
    scans.forEach(s => {
      const l = lastLangBySession[s.session_id] || "fr";
      byLang[l] = (byLang[l] || 0) + 1;
    });
    const langSorted = Object.entries(byLang).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const allergenSessions = {};
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
      .sort((a, b) => b[1] - a[1]).slice(0, 8);

    const sessionsWithFilter = new Set(
      (events || []).filter(e => e.event_type === "allergen_toggle" && e.payload?.active === true).map(e => e.session_id)
    );
    const filterRate = total > 0 ? Math.round((sessionsWithFilter.size / total) * 100) : 0;

    const dietBySession = {};
    (events || [])
      .filter(e => e.event_type === "diet_filter")
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .forEach(e => { dietBySession[e.session_id] = e.payload?.filter; });
    const vegSessions = Object.values(dietBySession).filter(f => f === "vegetarian").length;
    const veganSessions = Object.values(dietBySession).filter(f => f === "vegan").length;

    const byDevice = {};
    scans.forEach(s => {
      const d = s.device_type || "mobile";
      byDevice[d] = (byDevice[d] || 0) + 1;
    });

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

    setData({ total, prevTotal, growth, avgPerDay, byLang: langSorted, allergenCounts, filterRate, vegSessions, veganSessions, byDevice, allDays });
    setLoading(false);
  }

  async function handleExportPDF() {
    if (!data) return;
    setExporting(true);
    try {
      await generateAnalyticsPDF({ estName, period, data });
    } catch (e) {
      console.error("PDF export error:", e);
    }
    setExporting(false);
  }

  // ── Gate Pro ──────────────────────────────────────────────────────────────────
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
      {/* ── Header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <BarChart2 size={18} color="#1A1A1A" />
          <span style={{ fontSize:15, fontWeight:700, color:"#1A1A1A" }}>Analytics carte interactive</span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {/* Périodes */}
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
          {/* Bouton export PDF */}
          {data && data.total > 0 && (
            <button onClick={handleExportPDF} disabled={exporting}
              style={{ display:"flex", alignItems:"center", gap:6,
                fontSize:12, fontWeight:700, padding:"7px 12px",
                background: exporting ? "#F0F0F0" : "#1A1A1A",
                color: exporting ? "#888" : "white",
                border:"none", borderRadius:9, cursor: exporting ? "not-allowed" : "pointer",
                transition:"all 0.15s" }}>
              <Download size={13} />
              {exporting ? "Export..." : "PDF"}
            </button>
          )}
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
          {/* KPIs */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:10, marginBottom:12 }}>
            <KpiCard icon={<Eye size={14} color="#888" />} label="Scans" value={data.total}
              sub={data.growth !== null
                ? <span style={{ color: data.growth >= 0 ? "#155724" : "#CC0000" }}>{data.growth >= 0 ? "↑" : "↓"} {Math.abs(data.growth)}% vs préc.</span>
                : null} />
            <KpiCard icon={<TrendingUp size={14} color="#888" />} label="Moy/jour" value={data.avgPerDay} sub="scans par jour" />
            <KpiCard icon={<ShieldAlert size={14} color="#888" />} label="Filtrent" value={`${data.filterRate}%`} sub="cochent un allergène" />
          </div>

          {/* Vegan / Végé */}
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

          {/* Courbe */}
          <div style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:12, padding:"16px", marginBottom:12 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 12px" }}>Scans par jour</p>
            <MiniBarChart days={data.allDays} />
          </div>

          {/* Top allergènes */}
          {data.allergenCounts.length > 0 && (
            <div style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:12, padding:"16px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
                <ShieldAlert size={14} color="#888" />
                <p style={{ fontSize:12, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:"0.05em", margin:0 }}>Allergènes les plus filtrés</p>
              </div>
              {data.allergenCounts.map(([id, count]) => {
                const pct = Math.round((count / data.total) * 100);
                return (
                  <div key={id} style={{ marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <span style={{ fontSize:13, fontWeight:500, color:"#444" }}>{ALLERGEN_LABELS[id] || id}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:"#1A1A1A" }}>{count} <span style={{ color:"#AAA", fontWeight:400 }}>session{count > 1 ? "s" : ""}</span></span>
                    </div>
                    <div style={{ height:6, background:"#F0F0F0", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${Math.min(pct * 2, 100)}%`, background:"#1A1A1A", borderRadius:3, transition:"width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
              <p style={{ fontSize:11, color:"#CCC", margin:"8px 0 0" }}>Sessions uniques ayant coché cet allergène</p>
            </div>
          )}

          {/* Langues */}
          {data.byLang.length > 0 && (
            <div style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:12, padding:"16px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
                <Globe size={14} color="#888" />
                <p style={{ fontSize:12, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:"0.05em", margin:0 }}>Langues utilisées</p>
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
                      <span style={{ fontSize:12, fontWeight:700, color:"#1A1A1A" }}>{count} <span style={{ color:"#AAA", fontWeight:400 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height:6, background:"#F0F0F0", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:"#1A1A1A", borderRadius:3, transition:"width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Appareils */}
          <div style={{ background:"white", border:"1px solid #EBEBEB", borderRadius:12, padding:"16px" }}>
            <p style={{ fontSize:12, fontWeight:700, color:"#888", textTransform:"uppercase", letterSpacing:"0.05em", margin:"0 0 12px" }}>Appareils</p>
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