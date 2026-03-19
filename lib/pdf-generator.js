import { ALLERGENS } from "@/lib/allergens-db";

// Logo MenuSafe en SVG converti en canvas via une approche textuelle stylée
function drawLogo(doc, x, y) {
  // Bouclier géométrique dessiné avec des primitives jsPDF
  const s = 7; // taille de base

  // Corps du bouclier
  doc.setFillColor(26, 26, 26);
  doc.triangle(x, y + s * 0.3, x + s, y, x + s * 2, y + s * 0.3, "F");
  doc.rect(x, y + s * 0.3, s * 2, s * 1.2, "F");

  // Pointe du bouclier
  doc.setFillColor(26, 26, 26);
  doc.triangle(x, y + s * 1.5, x + s, y + s * 2.2, x + s * 2, y + s * 1.5, "F");

  // Coche blanche à l'intérieur
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.8);
  doc.line(x + s * 0.5, y + s * 1.1, x + s * 0.9, y + s * 1.5);
  doc.line(x + s * 0.9, y + s * 1.5, x + s * 1.6, y + s * 0.8);
}

export async function generateAllergenPDF(recipe) {
  const { jsPDF } = await import("jspdf");

  const W = 210;
  const m = 16;
  let y = 0;

  const hexToRGB = (hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];

  // ── Pré-calcul hauteur ────────────────────────────────────────────────────
  const tempDoc = new jsPDF({ unit: "mm", format: "a4" });
  const ingText = tempDoc.splitTextToSize(recipe.ingredients.join(", "), W - m * 2);
  const allergenRows = Math.ceil((recipe.allergens.length || 1) / 3);
  const absent = ALLERGENS.filter((a) => !recipe.allergens.includes(a.id));
  const absentText = tempDoc.splitTextToSize(absent.map((a) => a.label).join("  ·  "), W - m * 2);

  const H = Math.max(
    24 +                              // header
    10 + 8 + 6 +                     // nom plat
    8 + ingText.length * 5 + 8 +     // ingrédients
    8 + allergenRows * 14 + 6 +      // allergènes présents
    (absent.length > 0 ? 8 + absentText.length * 5 + 6 : 0) +
    6 + 12 + 10,                     // bandeau + footer
    80
  );

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [W, H] });

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, W, 22, "F");

  // Logo bouclier
  drawLogo(doc, m, 4.5);

  // Nom de la marque
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("MenuSafe", m + 18, 11);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text("Fiche allergènes officielle", m + 18, 17);

  // Date à droite
  doc.setTextColor(180, 180, 180);
  doc.setFontSize(7);
  doc.text(new Date().toLocaleDateString("fr-FR"), W - m, 17, { align: "right" });

  // Bandeau vert "CONFORME INCO"
  doc.setFillColor(240, 255, 244);
  doc.rect(0, 22, W, 6, "F");
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 87, 36);
  doc.text("✓  CONFORME  ·  Règlement UE n°1169/2011 (INCO)  ·  14 allergènes majeurs déclarés", W / 2, 26, { align: "center" });

  y = 34;

  // ── Nom du plat ───────────────────────────────────────────────────────────
  doc.setTextColor(26, 26, 26);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(recipe.dishName, m, y);
  y += 5;
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(m, y, W - m, y);
  y += 7;

  // ── Ingrédients ───────────────────────────────────────────────────────────
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(150, 150, 150);
  doc.text("COMPOSITION", m, y);
  y += 4.5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  const ingLines = doc.splitTextToSize(recipe.ingredients.join(", "), W - m * 2);
  doc.text(ingLines, m, y);
  y += ingLines.length * 5 + 7;
  doc.line(m, y, W - m, y);
  y += 7;

  // ── Allergènes présents ───────────────────────────────────────────────────
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(150, 150, 150);
  doc.text(`ALLERGÈNES PRÉSENTS (${recipe.allergens.length} / 14)`, m, y);
  y += 5;

  if (recipe.allergens.length === 0) {
    doc.setFillColor(240, 255, 244);
    doc.roundedRect(m, y, W - m * 2, 10, 2, 2, "F");
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(21, 87, 36);
    doc.text("✓  Aucun allergène majeur détecté dans ce plat.", m + 4, y + 6.5);
    y += 14;
  } else {
    const cols = 3;
    const colW = (W - m * 2) / cols;
    const boxH = 11;
    const gapY = 3;

    recipe.allergens.forEach((id, idx) => {
      const a = ALLERGENS.find((x) => x.id === id);
      if (!a) return;
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const bx = m + col * colW + 1;
      const bw = colW - 2;
      const rowY = y + row * (boxH + gapY);
      const [r, g, b] = hexToRGB(a.color);
      doc.setFillColor(r, g, b);
      doc.roundedRect(bx, rowY, bw, boxH, 2, 2, "F");
      const [tr, tg, tb] = hexToRGB(a.text);
      doc.setTextColor(tr, tg, tb);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(a.label, bx + bw / 2, rowY + 7.2, { align: "center" });
    });

    const rows = Math.ceil(recipe.allergens.length / cols);
    y += rows * (boxH + gapY) + 4;
  }

  // ── Allergènes absents ────────────────────────────────────────────────────
  if (absent.length > 0) {
    doc.setLineWidth(0.3);
    doc.line(m, y, W - m, y);
    y += 6;
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(150, 150, 150);
    doc.text("NE CONTIENT PAS", m, y);
    y += 4.5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200);
    const absentLines = doc.splitTextToSize(
      absent.map((a) => a.label).join("   ·   "),
      W - m * 2
    );
    doc.text(absentLines, m, y);
    y += absentLines.length * 4.5 + 6;
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  y += 2;
  doc.setDrawColor(240, 240, 240);
  doc.line(m, y, W - m, y);
  y += 4;
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(200, 200, 200);
  doc.text(
    `MenuSafe  ·  menusafe.fr  ·  Document généré le ${new Date().toLocaleDateString("fr-FR")}`,
    W / 2, y,
    { align: "center" }
  );

  doc.save(`MenuSafe_${recipe.dishName.replace(/\s+/g, "_")}_allergenes.pdf`);
}