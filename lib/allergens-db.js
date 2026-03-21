// ─── Icônes SVG allergènes — style Lucide minimaliste ─────────────────────────

export function AllergenIcon({ id, size = 20, color = "currentColor" }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round" };
  switch (id) {
    case "gluten":     return <svg {...p}><path d="M12 22V10"/><path d="M9 10c0 0 0-4 3-4s3 4 3 4"/><path d="M7 14c0 0 0-3 2-3"/><path d="M17 14c0 0 0-3-2-3"/><path d="M8 18c0 0 0-2 2-2"/><path d="M16 18c0 0 0-2-2-2"/></svg>;
    case "crustaces":  return <svg {...p}><path d="M5 12c0-4 3-7 7-7s7 3 7 7"/><path d="M12 5V3"/><path d="M8 8L6 6"/><path d="M16 8l2-2"/><path d="M5 14c-1 0-2-1-2-2s1-2 2-2"/><path d="M19 14c1 0 2-1 2-2s-1-2-2-2"/><path d="M8 16l-2 4"/><path d="M16 16l2 4"/></svg>;
    case "oeufs":      return <svg {...p}><path d="M12 3C8 3 5 7.5 5 12c0 3.9 3.1 7 7 7s7-3.1 7-7C19 7.5 16 3 12 3z"/><circle cx="10" cy="12" r="2" fill={color} stroke="none"/></svg>;
    case "poissons":   return <svg {...p}><path d="M2 12c0 0 4-7 10-7s10 7 10 7-4 7-10 7S2 12 2 12z"/><path d="M20 12l3-4v8l-3-4z"/><circle cx="8" cy="12" r="1.5" fill={color} stroke="none"/></svg>;
    case "arachides":  return <svg {...p}><path d="M9 3c-3 0-5 2.5-5 5 0 2 1.5 3 1.5 5S4 15.5 4 17c0 2.5 2 4 5 4"/><path d="M15 3c3 0 5 2.5 5 5 0 2-1.5 3-1.5 5s1.5 2.5 1.5 4c0 2.5-2 4-5 4"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="16" x2="15" y2="16"/></svg>;
    case "soja":       return <svg {...p}><path d="M12 22V12"/><path d="M12 12c0 0-5-2-5-7 2 0 5 3 5 7z"/><path d="M12 12c0 0 5-2 5-7-2 0-5 3-5 7z"/><path d="M12 17c0 0-3-1-3-4"/><path d="M12 17c0 0 3-1 3-4"/></svg>;
    case "lait":       return <svg {...p}><path d="M8 3h8l1 5H7L8 3z"/><path d="M7 8l-2 13h14L17 8"/><path d="M9 15c0-2 1.5-3 3-3s3 1 3 3"/></svg>;
    case "fruits_coq": return <svg {...p}><path d="M12 3c-4 0-7 3-7 7 0 2 .8 3.5 2 4.5L12 21l5-6.5c1.2-1 2-2.5 2-4.5 0-4-3-7-7-7z"/><path d="M12 3v5"/></svg>;
    case "celeri":     return <svg {...p}><path d="M12 22V11"/><path d="M12 11c0 0-4-2-4-7 2 0 4 3 4 7z"/><path d="M12 11c0 0 4-2 4-7-2 0-4 3-4 7z"/><path d="M12 16c0 0-3-1-3-5"/><path d="M12 16c0 0 3-1 3-5"/><line x1="9" y1="22" x2="15" y2="22"/></svg>;
    case "moutarde":   return <svg {...p}><rect x="7" y="9" width="10" height="12" rx="2"/><path d="M9 9V6c0-1.7 1.3-3 3-3s3 1.3 3 3v3"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="10" y1="15" x2="14" y2="15"/></svg>;
    case "sesame":     return <svg {...p}><ellipse cx="8.5" cy="8" rx="2" ry="3.5" transform="rotate(-15 8.5 8)"/><ellipse cx="15.5" cy="8" rx="2" ry="3.5" transform="rotate(15 15.5 8)"/><ellipse cx="12" cy="16" rx="2" ry="3.5"/></svg>;
    case "so2":        return <svg {...p}><path d="M9 3h6l1 3H8L9 3z"/><path d="M8 6l-1 4h10L16 6"/><path d="M7 10v10a1 1 0 001 1h8a1 1 0 001-1V10"/><line x1="10" y1="15" x2="14" y2="15"/></svg>;
    case "lupin":      return <svg {...p}><line x1="12" y1="22" x2="12" y2="12"/><circle cx="12" cy="9" r="3"/><path d="M12 6V3"/><path d="M9.5 10.5L7 8"/><path d="M14.5 10.5L17 8"/><path d="M9 13L6 14"/><path d="M15 13L18 14"/></svg>;
    case "mollusques": return <svg {...p}><path d="M12 3C7 3 4 7 4 11c0 3 2 5.5 4.5 6.5L12 21l3.5-3.5C18 16.5 20 14 20 11c0-4-3-8-8-8z"/><path d="M12 3c0 0-3 5-3 8"/><path d="M12 3c0 0 3 5 3 8"/></svg>;
    default:           return <svg {...p}><circle cx="12" cy="12" r="8"/></svg>;
  }
}

// ─── Liste des 14 allergènes ───────────────────────────────────────────────────

export const ALLERGENS = [
  { id: "gluten",     label: "Gluten",        color: "#FFF3CD", text: "#856404" },
  { id: "crustaces",  label: "Crustacés",     color: "#FFE5D0", text: "#7D3200" },
  { id: "oeufs",      label: "Œufs",          color: "#FFF9C4", text: "#7A6800" },
  { id: "poissons",   label: "Poissons",       color: "#D0E8FF", text: "#084298" },
  { id: "arachides",  label: "Arachides",      color: "#F5E6C8", text: "#5A3800" },
  { id: "soja",       label: "Soja",           color: "#E8F5D0", text: "#2D6A00" },
  { id: "lait",       label: "Lait",           color: "#E8F4FF", text: "#084298" },
  { id: "fruits_coq", label: "Fruits à coque", color: "#F0E6D0", text: "#6B3A00" },
  { id: "celeri",     label: "Céleri",         color: "#E8F5E8", text: "#155724" },
  { id: "moutarde",   label: "Moutarde",       color: "#FFFACC", text: "#856404" },
  { id: "sesame",     label: "Sésame",         color: "#F7F0E0", text: "#7A5C00" },
  { id: "so2",        label: "SO₂/Sulfites",   color: "#F3E8FF", text: "#5A189A" },
  { id: "lupin",      label: "Lupin",          color: "#E8FFE8", text: "#155724" },
  { id: "mollusques", label: "Mollusques",     color: "#FFE8F0", text: "#8B1A4A" },
];

// ─── Détection allergènes ──────────────────────────────────────────────────────

const ALLERGEN_MAP = {
  gluten:     ["farine","farine de blé","farine complète","pain","pain de mie","pain grillé","pain complet","pain de seigle","pain au levain","pâte","pâtes","pâtes fraîches","pâtes sèches","spaghetti","tagliatelles","linguines","penne","rigatoni","fusilli","farfalle","gnocchi","blé","blé dur","semoule","boulgour","épeautre","kamut","seigle","orge","avoine","malt","levure de bière","biscuit","cookie","gâteau","cake","tarte","quiche","pizza","pâte à pizza","chapelure","panure","croûte","couscous","muesli","granola","crackers","biscotte","amidon de blé","bière","seitan","nouilles","ramen","udon","tempura"],
  crustaces:  ["crevette","crevettes","gambas","langoustine","langoustines","homard","crabe","tourteau","araignée de mer","langouste","écrevisse","bisque","fumet de crustacés","bouquet"],
  oeufs:      ["œuf","œufs","oeuf","oeufs","jaune d'œuf","blanc d'œuf","œuf entier","mayonnaise","mayo","meringue","hollandaise","béarnaise","pâte fraîche","omelette","frittata","crêpe","gaufre","lemon curd","crème brûlée","île flottante","mousse au chocolat","soufflé","madeleine","poudre d'œuf","albumine","crème pâtissière","crème anglaise"],
  poissons:   ["poisson","saumon","thon","cabillaud","bar","loup","daurade","sole","turbot","lieu noir","merlu","truite","sardine","maquereau","hareng","anchois","filets d'anchois","rouget","espadon","tilapia","pangasius","anguille","sauce nuoc-mâm","fumet de poisson","surimi","brandade","tarama"],
  arachides:  ["arachide","arachides","cacahuète","cacahuètes","cacahouète","beurre de cacahuète","pâte d'arachide","huile d'arachide","satay","sauce satay"],
  soja:       ["soja","soya","tofu","tempeh","miso","sauce soja","tamari","edamame","lait de soja","yaourt de soja","crème de soja","lécithine de soja","protéine de soja","natto"],
  lait:       ["lait","lait entier","lait demi-écrémé","lait écrémé","lait de vache","lait de brebis","lait de chèvre","lait en poudre","beurre","beurre doux","beurre salé","ghee","crème","crème fraîche","crème liquide","crème épaisse","crème fouettée","fromage","gruyère","emmental","comté","parmesan","grana padano","pecorino","mozzarella","mozzarella di bufala","burrata","ricotta","gorgonzola","roquefort","brie","camembert","chèvre","feta","halloumi","mascarpone","yaourt","yaourt grec","crème glacée","glace","chocolat au lait","lactosérum","caséine","lactose","whey","béchamel","sauce mornay","fondue","raclette","tartiflette"],
  fruits_coq: ["noix","noix de cajou","noix de pécan","noix de macadamia","noix du brésil","amande","amandes","poudre d'amande","lait d'amande","noisette","noisettes","pâte de noisette","nutella","pistache","pistaches","noix de coco","lait de coco","crème de coco","châtaigne","marron","farine de châtaigne","pignon","pignons","macaron","financier","praliné","gianduja"],
  celeri:     ["céleri","céleri-rave","céleri branche","sel de céleri","extrait de céleri","graines de céleri","bouquet garni","mirepoix","bouillon de légumes","bouillon cube"],
  moutarde:   ["moutarde","moutarde de dijon","moutarde à l'ancienne","moutarde en grains","moutarde en poudre","graines de moutarde","huile de moutarde","vinaigrette","sauce remoulade","mayonnaise moutarde"],
  sesame:     ["sésame","graines de sésame","tahini","tahin","pâte de sésame","huile de sésame","gomasio","pain au sésame","hummus","houmous","halva"],
  so2:        ["vin","vin blanc","vin rouge","vin rosé","champagne","mousseux","crémant","cidre","vinaigre","vinaigre de vin","vinaigre balsamique","fruits secs","abricot sec","raisin sec","figue sèche","pruneau","sulfite","dioxyde de soufre","e220","e221","e222","cornichons"],
  lupin:      ["lupin","farine de lupin","graine de lupin","lupin blanc","lupin bleu"],
  mollusques: ["coquille saint-jacques","saint-jacques","moule","moules","huître","huîtres","coque","coques","palourde","palourdes","calmar","calmars","seiche","seiches","pieuvre","poulpe","encornet","mollusque","mollusques","fruits de mer","bigorneau","bulot","pétoncle"],
};

// Autocomplétion — liste plate de tous les ingrédients connus
const ALL_INGREDIENTS = [...new Set(Object.values(ALLERGEN_MAP).flat())].sort();

export function getSuggestions(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return ALL_INGREDIENTS
    .filter((ing) => {
      const norm = ing.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return norm.includes(q);
    })
    .slice(0, 8);
}

export function detectAllergens(ingredients) {
  if (!ingredients || !Array.isArray(ingredients)) return [];
  const found = new Set();
  const normalized = ingredients.map((i) =>
    i.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
  );
  for (const [allergenId, keywords] of Object.entries(ALLERGEN_MAP)) {
    for (const kw of keywords) {
      const normKw = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized.some((ing) => ing.includes(normKw) || (normKw.includes(ing) && ing.length > 3))) {
        found.add(allergenId);
        break;
      }
    }
  }
  return [...found];
}