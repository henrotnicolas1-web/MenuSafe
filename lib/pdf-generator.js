import { ALLERGENS } from "@/lib/allergens-db";

function hexToRGB(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export async function generateAllergenPDF(recipe) {
  const { jsPDF } = await import("jspdf");

  const W = 210;
  const H = 297;
  const m = 20;
  const cW = W - m * 2;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let y = 0;

  // ── HEADER ────────────────────────────────────────────────────────────────
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, W, 26, "F");

  // Bouclier
  const sx = m, sy = 5, sw = 10, sh = 13;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(sx, sy, sw, sh * 0.72, 1.2, 1.2, "F");
  doc.triangle(sx, sy + sh * 0.65, sx + sw / 2, sy + sh, sx + sw, sy + sh * 0.65, "F");
  doc.setDrawColor(74, 222, 128);
  doc.setLineWidth(0.85);
  doc.line(sx + sw * 0.22, sy + sh * 0.42, sx + sw * 0.44, sy + sh * 0.62);
  doc.line(sx + sw * 0.44, sy + sh * 0.62, sx + sw * 0.8, sy + sh * 0.28);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("MenuSafe", m + 14, 13);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("Fiche allergènes officielle", m + 14, 19);

  doc.setTextColor(120, 120, 120);
  doc.setFontSize(7);
  doc.text(new Date().toLocaleDateString("fr-FR"), W - m, 19, { align: "right" });

  // ── BANDEAU CONFORME ──────────────────────────────────────────────────────
  doc.setFillColor(240, 253, 244);
  doc.rect(0, 26, W, 7.5, "F");
  doc.setFontSize(6.8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 87, 36);
  doc.text(
    "✓  CONFORME  ·  Règlement UE n°1169/2011 (INCO)  ·  14 allergènes majeurs",
    W / 2, 31.2, { align: "center" }
  );

  y = 42;

  // ── NOM DU PLAT avec wrap ─────────────────────────────────────────────────
  let titleSize = 20;
  doc.setFontSize(titleSize);
  doc.setFont("helvetica", "bold");
  let titleLines = doc.splitTextToSize(recipe.dishName, cW);
  if (titleLines.length > 2) { titleSize = 14; }
  else if (titleLines.length > 1) { titleSize = 17; }
  doc.setFontSize(titleSize);
  titleLines = doc.splitTextToSize(recipe.dishName, cW);
  doc.setTextColor(26, 26, 26);
  titleLines.forEach((line) => {
    doc.text(line, W / 2, y, { align: "center" });
    y += titleSize * 0.45;
  });
  y += 3;

  doc.setDrawColor(235, 235, 235);
  doc.setLineWidth(0.3);
  doc.line(m, y, W - m, y);
  y += 10;

  // ── COMPOSITION ──────────────────────────────────────────────────────────
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(160, 160, 160);
  doc.text("COMPOSITION", m, y);
  y += 5;

  const ingStr = (recipe.ingredients || []).join(", ") || "—";
  const ingLines = doc.splitTextToSize(ingStr, cW - 10);
  const ingH = ingLines.length * 5.2 + 10;
  doc.setFillColor(247, 247, 245);
  doc.roundedRect(m, y, cW, ingH, 3, 3, "F");
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.text(ingLines, m + 5, y + 7);
  y += ingH + 10;

  // ── ALLERGÈNES PRÉSENTS ──────────────────────────────────────────────────
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(160, 160, 160);
  doc.text(`ALLERGÈNES PRÉSENTS (${(recipe.allergens || []).length} / 14)`, m, y);
  y += 6;

  if (!recipe.allergens || recipe.allergens.length === 0) {
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(m, y, cW, 13, 3, 3, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 87, 36);
    doc.text("✓  Aucun allergène majeur détecté dans ce plat", W / 2, y + 8.5, { align: "center" });
    y += 19;
  } else {
    const gap = 3;
    const boxW = (cW - gap * 2) / 3;
    const boxH = 12;
    recipe.allergens.forEach((id, idx) => {
      const a = ALLERGENS.find((x) => x.id === id);
      if (!a) return;
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const bx = m + col * (boxW + gap);
      const by = y + row * (boxH + gap);
      const [r, g, b] = hexToRGB(a.color);
      const [tr, tg, tb] = hexToRGB(a.text);
      doc.setFillColor(r, g, b);
      doc.roundedRect(bx, by, boxW, boxH, 2.5, 2.5, "F");
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(tr, tg, tb);
      doc.text(a.label, bx + boxW / 2, by + 8, { align: "center" });
    });
    const rows = Math.ceil(recipe.allergens.length / 3);
    y += rows * (boxH + gap) + 10;
  }

  // ── LABELS VEGAN / VÉGÉTARIEN / CERTIFICATION ────────────────────────────
  const tags = [];
  if (recipe.isVegan) tags.push({ text: "Vegan", bg: "#F0FFF4", fg: "#155724" });
  else if (recipe.isVegetarian) tags.push({ text: "Végétarien", bg: "#F0FFF4", fg: "#155724" });
  const certLabels = { halal: "Halal", casher: "Casher", label_rouge: "Label Rouge", bio: "Bio" };
  if (recipe.meatCertification && certLabels[recipe.meatCertification]) {
    tags.push({ text: certLabels[recipe.meatCertification], bg: "#FFF8E6", fg: "#7A4F00" });
  }

  if (tags.length > 0) {
    doc.setDrawColor(235, 235, 235);
    doc.line(m, y, W - m, y);
    y += 8;
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(160, 160, 160);
    doc.text("LABELS", m, y);
    y += 6;

    const tagW = 38, tagH = 10, tagGap = 4;
    const totalW = tags.length * tagW + (tags.length - 1) * tagGap;
    let tx = (W - totalW) / 2;
    tags.forEach(({ text, bg, fg }) => {
      const [r, g, b] = hexToRGB(bg);
      const [tr, tg, tb] = hexToRGB(fg);
      doc.setFillColor(r, g, b);
      doc.roundedRect(tx, y, tagW, tagH, 2, 2, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(tr, tg, tb);
      doc.text(text, tx + tagW / 2, y + 7, { align: "center" });
      tx += tagW + tagGap;
    });
    y += tagH + 8;
  }

  // ── NE CONTIENT PAS ──────────────────────────────────────────────────────
  const absent = ALLERGENS.filter((a) => !(recipe.allergens || []).includes(a.id));
  if (absent.length > 0) {
    doc.setDrawColor(235, 235, 235);
    doc.setLineWidth(0.3);
    doc.line(m, y, W - m, y);
    y += 8;
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(160, 160, 160);
    doc.text("NE CONTIENT PAS", m, y);
    y += 5;
    const absentStr = absent.map((a) => a.label).join("   ·   ");
    const absentLines = doc.splitTextToSize(absentStr, cW);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(195, 195, 195);
    absentLines.forEach((line) => {
      doc.text(line, W / 2, y, { align: "center" });
      y += 5;
    });
  }

  // ── FOOTER FIXE BAS DE PAGE ───────────────────────────────────────────────
  doc.setFillColor(247, 247, 245);
  doc.rect(0, H - 12, W, 12, "F");
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(0, H - 12, W, H - 12);
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(180, 180, 180);
  doc.text(
    `MenuSafe  ·  menusafe.fr  ·  Document généré le ${new Date().toLocaleDateString("fr-FR")}`,
    W / 2, H - 5, { align: "center" }
  );

  doc.save(`MenuSafe_${recipe.dishName.replace(/\s+/g, "_")}_allergenes.pdf`);
}