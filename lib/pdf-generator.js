import { ALLERGENS } from "@/lib/allergens-db";

function hexToRGB(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function drawShield(doc, cx, cy, size = 8) {
  // Bouclier centré sur cx, cy
  const w = size * 1.6;
  const h = size * 2;
  const x = cx - w / 2;
  const y = cy - h / 2;

  doc.setFillColor(26, 26, 26);
  // Corps rectangulaire
  doc.roundedRect(x, y, w, h * 0.7, 1.5, 1.5, "F");
  // Pointe triangulaire
  doc.triangle(x, y + h * 0.65, cx, y + h, x + w, y + h * 0.65, "F");

  // Coche verte
  doc.setDrawColor(74, 222, 128);
  doc.setLineWidth(0.9);
  const ck = { x: cx - w * 0.22, y: cy - h * 0.05 };
  doc.line(ck.x, ck.y, ck.x + w * 0.18, ck.y + h * 0.12);
  doc.line(ck.x + w * 0.18, ck.y + h * 0.12, ck.x + w * 0.52, ck.y - h * 0.12);
}

export async function generateAllergenPDF(recipe) {
  const { jsPDF } = await import("jspdf");

  // Format A4 portrait fixe — toujours centré
  const W = 210;
  const H = 297;
  const m = 18; // marges
  const cW = W - m * 2; // largeur contenu

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let y = 0;

  // ── HEADER ────────────────────────────────────────────────────────────────
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, W, 28, "F");

  // Logo bouclier
  drawShield(doc, m + 8, 14, 7);

  // Nom marque
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("MenuSafe", m + 20, 13);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 160);
  doc.text("Fiche allergènes officielle", m + 20, 19.5);

  // Date alignée à droite
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(7);
  doc.text(new Date().toLocaleDateString("fr-FR"), W - m, 19.5, { align: "right" });

  // ── BANDEAU CONFORME ──────────────────────────────────────────────────────
  doc.setFillColor(240, 253, 244);
  doc.rect(0, 28, W, 8, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 87, 36);
  doc.text(
    "✓  CONFORME  ·  Règlement UE n°1169/2011 (INCO)  ·  14 allergènes majeurs",
    W / 2, 33.5,
    { align: "center" }
  );

  y = 46;

  // ── NOM DU PLAT ───────────────────────────────────────────────────────────
  doc.setTextColor(26, 26, 26);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  // Centrer le nom du plat
  doc.text(recipe.dishName, W / 2, y, { align: "center" });
  y += 4;

  doc.setDrawColor(235, 235, 235);
  doc.setLineWidth(0.4);
  doc.line(m, y, W - m, y);
  y += 10;

  // ── COMPOSITION ──────────────────────────────────────────────────────────
  // Label section
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(160, 160, 160);
  doc.text("COMPOSITION", m, y);
  y += 5;

  // Fond léger
  const ingText = recipe.ingredients.join(", ");
  const ingLines = doc.splitTextToSize(ingText, cW - 8);
  const ingBoxH = ingLines.length * 5.2 + 8;

  doc.setFillColor(247, 247, 245);
  doc.roundedRect(m, y, cW, ingBoxH, 3, 3, "F");

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.text(ingLines, m + 4, y + 6);
  y += ingBoxH + 10;

  // ── ALLERGÈNES PRÉSENTS ──────────────────────────────────────────────────
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(160, 160, 160);
  doc.text(`ALLERGÈNES PRÉSENTS (${recipe.allergens.length} / 14)`, m, y);
  y += 6;

  if (recipe.allergens.length === 0) {
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(m, y, cW, 12, 3, 3, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 87, 36);
    doc.text("✓  Aucun allergène majeur détecté dans ce plat", W / 2, y + 8, { align: "center" });
    y += 18;
  } else {
    // Grille 3 colonnes, centrée
    const cols = 3;
    const gap = 3;
    const boxW = (cW - gap * (cols - 1)) / cols;
    const boxH = 13;

    recipe.allergens.forEach((id, idx) => {
      const a = ALLERGENS.find((x) => x.id === id);
      if (!a) return;
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const bx = m + col * (boxW + gap);
      const by = y + row * (boxH + gap);
      const [r, g, b] = hexToRGB(a.color);
      const [tr, tg, tb] = hexToRGB(a.text);

      doc.setFillColor(r, g, b);
      doc.roundedRect(bx, by, boxW, boxH, 2.5, 2.5, "F");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(tr, tg, tb);
      doc.text(a.label, bx + boxW / 2, by + 8.5, { align: "center" });
    });

    const rows = Math.ceil(recipe.allergens.length / cols);
    y += rows * (boxH + gap) + 10;
  }

  // ── NE CONTIENT PAS ──────────────────────────────────────────────────────
  const absent = ALLERGENS.filter((a) => !recipe.allergens.includes(a.id));
  if (absent.length > 0) {
    doc.setDrawColor(235, 235, 235);
    doc.setLineWidth(0.3);
    doc.line(m, y, W - m, y);
    y += 8;

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(160, 160, 160);
    doc.text("NE CONTIENT PAS", m, y);
    y += 5;

    const absentStr = absent.map((a) => a.label).join("  ·  ");
    const absentLines = doc.splitTextToSize(absentStr, cW);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(190, 190, 190);
    // Centrer les allergènes absents
    absentLines.forEach((line) => {
      doc.text(line, W / 2, y, { align: "center" });
      y += 5;
    });
    y += 4;
  }

  // Labels vegan/végétarien si présents
  if (recipe.isVegan || recipe.isVegetarian) {
    y += 4;
    doc.setDrawColor(235, 235, 235);
    doc.line(m, y, W - m, y);
    y += 8;

    const labels = [];
    if (recipe.isVegan) labels.push({ text: "Vegan", bg: "#F0FFF4", fg: "#155724" });
    else if (recipe.isVegetarian) labels.push({ text: "Végétarien", bg: "#F0FFF4", fg: "#155724" });

    const lw = 32;
    const lh = 9;
    let lx = W / 2 - (labels.length * (lw + 4)) / 2;
    labels.forEach(({ text, bg, fg }) => {
      const [r, g, b] = hexToRGB(bg);
      const [tr, tg, tb] = hexToRGB(fg);
      doc.setFillColor(r, g, b);
      doc.roundedRect(lx, y, lw, lh, 2, 2, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(tr, tg, tb);
      doc.text(text, lx + lw / 2, y + 6.3, { align: "center" });
      lx += lw + 4;
    });
    y += lh + 6;
  }

  // ── FOOTER collé en bas de page ──────────────────────────────────────────
  const footerY = H - 14;
  doc.setFillColor(247, 247, 245);
  doc.rect(0, footerY - 2, W, 16, "F");

  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(0, footerY - 2, W, footerY - 2);

  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(180, 180, 180);
  doc.text(
    `MenuSafe  ·  menusafe.fr  ·  Document généré le ${new Date().toLocaleDateString("fr-FR")}`,
    W / 2, footerY + 5,
    { align: "center" }
  );

  doc.save(`MenuSafe_${recipe.dishName.replace(/\s+/g, "_")}_allergenes.pdf`);
}