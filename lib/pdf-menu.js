import { ALLERGENS } from "@/lib/allergens-db";

const CATEGORY_LABELS = {
  entree: "ENTRÉES", plat: "PLATS", dessert: "DESSERTS",
  boisson: "BOISSONS", autre: "AUTRES",
};
const CATEGORY_ORDER = ["entree", "plat", "dessert", "boisson", "autre"];

function hexToRGB(hex) {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

// Abréviations lisibles pour chaque allergène (sans emoji)
const ALLERGEN_ABBR = {
  gluten:     "GLU",
  crustaces:  "CRU",
  oeufs:      "OEU",
  poissons:   "POI",
  arachides:  "ARA",
  soja:       "SOJ",
  lait:       "LAI",
  fruits_coq: "F.C",
  celeri:     "CEL",
  moutarde:   "MOU",
  sesame:     "SES",
  so2:        "SO2",
  lupin:      "LUP",
  mollusques: "MOL",
};

export async function generateMenuPDF(establishmentName, recipes, menuUrl) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const W = 297;
  const H = 210;
  const m = 10;
  let y = 0;

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, W, 18, "F");

  // Logo bouclier simplifié
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(m, 4, 8, 10, 1, 1, "F");
  doc.setFillColor(26, 26, 26);
  doc.roundedRect(m + 0.5, 4.5, 7, 9, 0.8, 0.8, "F");
  doc.setDrawColor(74, 222, 128);
  doc.setLineWidth(0.8);
  doc.line(m + 1.8, 10, m + 3.2, 11.8);
  doc.line(m + 3.2, 11.8, m + 6.2, 8.2);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(establishmentName, m + 11, 10);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text("Fiche allergenes complete - Reglement UE n.1169/2011 (INCO)", m + 11, 15);
  doc.text(`Generee le ${new Date().toLocaleDateString("fr-FR")}`, W - m, 15, { align: "right" });

  // Bandeau vert
  doc.setFillColor(240, 255, 244);
  doc.rect(0, 18, W, 6, "F");
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 87, 36);
  doc.text(
    "CONFORME - 14 allergenes majeurs declares - Scannez le QR code pour la version interactive et multilingue",
    W / 2, 22.5, { align: "center" }
  );

  y = 30;

  // ── Légende allergènes ────────────────────────────────────────────────────
  const nAllerg = ALLERGENS.length; // 14
  const legendW = W - m * 2;
  const aColW = legendW / nAllerg;

  ALLERGENS.forEach((a, i) => {
    const x = m + i * aColW;
    const [r, g, b] = hexToRGB(a.color);
    doc.setFillColor(r, g, b);
    doc.roundedRect(x + 0.5, y, aColW - 1, 8, 1, 1, "F");
    const [tr, tg, tb] = hexToRGB(a.text);
    doc.setTextColor(tr, tg, tb);
    doc.setFontSize(5);
    doc.setFont("helvetica", "bold");
    // Nom court sur 2 lignes si besoin
    const short = a.label.length > 8 ? a.label.slice(0, 8) : a.label;
    doc.text(short, x + aColW / 2, y + 5.2, { align: "center" });
  });

  y += 10;

  // ── En-tête colonnes ──────────────────────────────────────────────────────
  const dishColW = 52;
  const ingColW  = 70;
  const restW    = W - m * 2 - dishColW - ingColW;
  const aW       = restW / nAllerg;

  doc.setFillColor(240, 240, 240);
  doc.rect(m, y, W - m * 2, 6, "F");
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.text("PLAT", m + 2, y + 4);
  doc.text("INGREDIENTS PRINCIPAUX", m + dishColW + 2, y + 4);

  ALLERGENS.forEach((a, i) => {
    const ax = m + dishColW + ingColW + i * aW + aW / 2;
    doc.setFontSize(5);
    doc.text(ALLERGEN_ABBR[a.id] || a.id.slice(0, 3).toUpperCase(), ax, y + 4, { align: "center" });
  });
  y += 6;

  // ── Lignes par catégorie ──────────────────────────────────────────────────
  const grouped = {};
  CATEGORY_ORDER.forEach((cat) => { grouped[cat] = []; });
  recipes.forEach((r) => {
    const cat = r.category || "plat";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(r);
  });

  CATEGORY_ORDER.forEach((cat) => {
    const items = grouped[cat];
    if (!items?.length) return;

    // Nouvelle page si besoin
    if (y > H - 25) {
      doc.addPage("a4", "landscape");
      y = 15;
    }

    // En-tête catégorie
    doc.setFillColor(26, 26, 26);
    doc.rect(m, y, W - m * 2, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(CATEGORY_LABELS[cat] || cat.toUpperCase(), m + 3, y + 4);
    y += 6;

    items.forEach((recipe, idx) => {
      if (y > H - 15) {
        doc.addPage("a4", "landscape");
        y = 15;
      }

      const rowH = 9;
      // Fond alterné
      if (idx % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(249, 249, 249);
      }
      doc.rect(m, y, W - m * 2, rowH, "F");

      // Bordure fine
      doc.setDrawColor(240, 240, 240);
      doc.setLineWidth(0.2);
      doc.line(m, y + rowH, W - m, y + rowH);

      // Nom du plat
      doc.setTextColor(26, 26, 26);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      const nameLines = doc.splitTextToSize(recipe.dish_name, dishColW - 4);
      doc.text(nameLines[0], m + 2, y + 6);

      // Séparateur vertical
      doc.setDrawColor(230, 230, 230);
      doc.line(m + dishColW, y, m + dishColW, y + rowH);
      doc.line(m + dishColW + ingColW, y, m + dishColW + ingColW, y + rowH);

      // Ingrédients
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(100, 100, 100);
      const ingStr = (recipe.ingredients ?? []).join(", ");
      const ingLine = doc.splitTextToSize(ingStr, ingColW - 4);
      doc.text(ingLine[0], m + dishColW + 2, y + 6);

      // Points allergènes — cercles colorés
      ALLERGENS.forEach((a, i) => {
        const ax = m + dishColW + ingColW + i * aW + aW / 2;
        const ay = y + rowH / 2;
        const hasAllergen = recipe.allergens?.includes(a.id);

        if (hasAllergen) {
          const [r, g, b] = hexToRGB(a.color);
          doc.setFillColor(r, g, b);
          doc.circle(ax, ay, 2.8, "F");
          // Bordure colorée
          const [tr, tg, tb] = hexToRGB(a.text);
          doc.setDrawColor(tr, tg, tb);
          doc.setLineWidth(0.3);
          doc.circle(ax, ay, 2.8, "S");
          // Coche
          doc.setTextColor(tr, tg, tb);
          doc.setFontSize(5.5);
          doc.setFont("helvetica", "bold");
          doc.text("v", ax, ay + 1.8, { align: "center" });
        } else {
          doc.setTextColor(210, 210, 210);
          doc.setFontSize(8);
          doc.text("-", ax, ay + 2.5, { align: "center" });
        }
      });

      y += rowH;
    });

    y += 2;
  });

  // ── Footer sur toutes les pages ───────────────────────────────────────────
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(6);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(180, 180, 180);
    doc.text(
      `MenuSafe - ${establishmentName} - Page ${p}/${pages}`,
      W / 2, H - 4, { align: "center" }
    );
    if (menuUrl) {
      doc.setTextColor(150, 150, 150);
      doc.text(`Carte interactive : ${menuUrl}`, W - m, H - 4, { align: "right" });
    }
  }

  const filename = `MenuSafe_${establishmentName.replace(/\s+/g, "_")}_allergenes.pdf`;
  doc.save(filename);
}