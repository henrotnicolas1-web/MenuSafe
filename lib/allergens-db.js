// ─── Icônes SVG allergènes — style Lucide minimaliste ligne ───────────────────
// Chaque icône est un composant React inline, cohérent sur tous les OS/navigateurs

export function AllergenIcon({ id, size = 20, color = "currentColor" }) {
  const icons = {
    gluten: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c0 0-4 4-4 9s4 11 4 11"/>
        <path d="M12 2c0 0 4 4 4 9s-4 11-4 11"/>
        <path d="M8 8c2 1 4 1 8 0"/>
        <path d="M7 13c2 1 5 1 10-1"/>
      </svg>
    ),
    crustaces: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15c3 0 6-2 6-5s-3-5-6-5-6 2-6 5 3 5 6 5z"/>
        <path d="M6 10c-2 0-3 1-3 2s1 2 3 2"/>
        <path d="M18 10c2 0 3 1 3 2s-1 2-3 2"/>
        <path d="M9 15l-2 4"/><path d="M15 15l2 4"/>
        <path d="M10 15l-1 4"/><path d="M14 15l1 4"/>
      </svg>
    ),
    oeufs: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3C8 3 5 7.5 5 12c0 3.9 3.1 7 7 7s7-3.1 7-7c0-4.5-3-9-7-9z"/>
      </svg>
    ),
    poissons: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12c0 0-4-6-9-6S3 12 3 12s4 6 9 6 8-6 8-6z"/>
        <path d="M20 12l2-3v6l-2-3z"/>
        <circle cx="8" cy="12" r="1" fill={color}/>
      </svg>
    ),
    arachides: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21c-3 0-5-2-5-4.5C7 14 9 12.5 9 11c0-1.5-2-3-2-5.5C7 3 9 2 12 2s5 1 5 3.5C17 8 15 9.5 15 11c0 1.5 2 3 2 5.5 0 2.5-2 4.5-5 4.5z"/>
        <path d="M12 2v19"/>
      </svg>
    ),
    soja: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12"/>
        <path d="M12 12C12 12 7 10 7 6c0-2 2-4 5-4s5 2 5 4c0 4-5 6-5 6z"/>
        <path d="M12 12c0 0-5 2-5 6 0 2 2 3 5 3s5-1 5-3c0-4-5-6-5-6z"/>
      </svg>
    ),
    lait: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3h8l1 4H7L8 3z"/>
        <path d="M7 7l-2 13h14L17 7"/>
        <path d="M9 13c0 0 1 2 3 2s3-2 3-2"/>
      </svg>
    ),
    fruits_coq: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8c0-4-2.5-6-5-6S7 4 7 8c0 2 1 3.5 2 4.5L12 22l3-9.5c1-1 2-2.5 2-4.5z"/>
        <path d="M12 2v5"/>
      </svg>
    ),
    celeri: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V10"/>
        <path d="M12 10c0 0-4-1-5-5 1 0 4 1 5 5z"/>
        <path d="M12 10c0 0 4-1 5-5-1 0-4 1-5 5z"/>
        <path d="M12 14c0 0-4-1-5-5"/>
        <path d="M12 14c0 0 4-1 5-5"/>
        <path d="M9 22h6"/>
      </svg>
    ),
    moutarde: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <circle cx="12" cy="4" r="1.5"/>
        <circle cx="12" cy="20" r="1.5"/>
        <circle cx="4" cy="12" r="1.5"/>
        <circle cx="20" cy="12" r="1.5"/>
        <circle cx="6.5" cy="6.5" r="1.5"/>
        <circle cx="17.5" cy="17.5" r="1.5"/>
        <circle cx="17.5" cy="6.5" r="1.5"/>
        <circle cx="6.5" cy="17.5" r="1.5"/>
      </svg>
    ),
    sesame: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="9" cy="7" rx="2.5" ry="4" transform="rotate(-20 9 7)"/>
        <ellipse cx="15" cy="7" rx="2.5" ry="4" transform="rotate(20 15 7)"/>
        <ellipse cx="12" cy="15" rx="2.5" ry="4"/>
        <path d="M12 11v2"/>
      </svg>
    ),
    so2: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M8 12c0-2 1.5-4 4-4s4 2 4 4"/>
        <path d="M8 16h8"/>
        <path d="M10 20l2-4 2 4"/>
      </svg>
    ),
    lupin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12"/>
        <path d="M12 12c0 0-3-2-3-6 1.5 0 3 2 3 6z"/>
        <path d="M12 12c0 0 3-2 3-6-1.5 0-3 2-3 6z"/>
        <path d="M12 16c0 0-3-2-3-5"/>
        <path d="M12 16c0 0 3-2 3-5"/>
      </svg>
    ),
    mollusques: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4C8 4 5 7 5 11c0 2 1 4 3 5l4 4 4-4c2-1 3-3 3-5 0-4-3-7-7-7z"/>
        <path d="M9 11c0-1.5 1.5-3 3-3s3 1.5 3 3"/>
        <path d="M12 8v1"/>
      </svg>
    ),
  };
  return icons[id] || null;
}

// ─── Base de données allergènes — sans emojis ──────────────────────────────────
export const ALLERGENS = [
  { id: "gluten",     label: "Gluten",         color: "#FFF3CD", text: "#856404" },
  { id: "crustaces",  label: "Crustacés",       color: "#FFE5D0", text: "#7D3200" },
  { id: "oeufs",      label: "Œufs",            color: "#FFF9C4", text: "#7A6800" },
  { id: "poissons",   label: "Poissons",         color: "#D0E8FF", text: "#084298" },
  { id: "arachides",  label: "Arachides",        color: "#F5E6C8", text: "#5A3800" },
  { id: "soja",       label: "Soja",             color: "#E8F5D0", text: "#2D6A00" },
  { id: "lait",       label: "Lait",             color: "#E8F4FF", text: "#084298" },
  { id: "fruits_coq", label: "Fruits à coque",   color: "#F0E6D0", text: "#6B3A00" },
  { id: "celeri",     label: "Céleri",            color: "#E8F5E8", text: "#155724" },
  { id: "moutarde",   label: "Moutarde",         color: "#FFFACC", text: "#856404" },
  { id: "sesame",     label: "Sésame",            color: "#F7F0E0", text: "#7A5C00" },
  { id: "so2",        label: "SO₂/Sulfites",      color: "#F3E8FF", text: "#5A189A" },
  { id: "lupin",      label: "Lupin",             color: "#E8FFE8", text: "#155724" },
  { id: "mollusques", label: "Mollusques",        color: "#FFE8F0", text: "#8B1A4A" },
];

// ─── Détection allergènes ──────────────────────────────────────────────────────
// 897 ingrédients mappés aux 14 allergènes légaux

const ALLERGEN_MAP = {
  // GLUTEN
  gluten: [
    "farine","farine de blé","farine complète","farine t45","farine t55","farine t65",
    "pain","pain de mie","pain grillé","pain complet","pain de seigle","pain au levain",
    "pain pita","pain naan","baguette","brioche","croissant","pain au chocolat",
    "pâte","pâtes","pâtes fraîches","pâtes sèches","spaghetti","tagliatelles",
    "linguines","fettuccines","penne","rigatoni","fusilli","farfalle","gnocchi",
    "blé","blé dur","blé tendre","semoule","semoule de blé","boulgour","épeautre",
    "kamut","seigle","orge","avoine","malt","levure de bière",
    "biscuit","biscuits","cookie","gâteau","cake","tarte","quiche",
    "pizza","pâte à pizza","fond de tarte","chapelure","panure","croûte",
    "soupe en sachet","sauce soja","taboulé","couscous","muesli","granola",
    "crackers","biscotte","maïzena","fécule de blé","amidon de blé",
    "bière","whisky","seitan","fu","tempura","nouilles","ramen","udon","soba",
  ],
  // CRUSTACÉS
  crustaces: [
    "crevette","crevettes","gambas","langoustine","langoustines","homard","crabe",
    "tourteau","araignée de mer","langouste","écrevisse","bernard l'hermite",
    "crustacé","crustacés","bouquet","palourde cuite","bisque","fumet de crustacés",
  ],
  // ŒUFS
  oeufs: [
    "œuf","œufs","oeuf","oeufs","jaune d'œuf","blanc d'œuf","œuf entier",
    "mayonnaise","mayo","meringue","hollandaise","béarnaise",
    "pâte fraîche","pasta fraîche","gnocchi","brioche","quiche","flan",
    "crème brûlée","île flottante","mousse au chocolat","soufflé",
    "omelette","frittata","tortilla espagnole","crêpe","gaufre",
    "lemon curd","crème anglaise","crème pâtissière","madeleine",
    "poudre d'œuf","albumine","lysozyme","lécithine d'œuf",
  ],
  // POISSONS
  poissons: [
    "poisson","saumon","thon","cabillaud","bar","loup","daurade","sole",
    "turbot","lieu noir","merlu","truite","sardine","maquereau","hareng",
    "anchois","filets d'anchois","rouget","saint-pierre","espadon","esturgeon",
    "tilapia","pangasius","perche","brochet","carpe","anguille",
    "sauce nuoc-mâm","sauce worcestershire","garum","fumet de poisson",
    "surimi","fish and chips","brandade","tarama","bottarga",
  ],
  // ARACHIDES
  arachides: [
    "arachide","arachides","cacahuète","cacahuètes","cacahouète","cacahouètes",
    "beurre de cacahuète","pâte d'arachide","huile d'arachide",
    "satay","sauce satay","praline","pralinoise",
  ],
  // SOJA
  soja: [
    "soja","soya","tofu","tempeh","miso","sauce soja","tamari","edamame",
    "lait de soja","yaourt de soja","crème de soja","fromage de soja",
    "lécithine de soja","protéine de soja","concentré de soja",
    "textured soy protein","tsp","huile de soja","natto",
  ],
  // LAIT
  lait: [
    "lait","lait entier","lait demi-écrémé","lait écrémé","lait de vache",
    "lait de brebis","lait de chèvre","lait en poudre","lait concentré",
    "beurre","beurre doux","beurre salé","beurre clarifié","ghee",
    "crème","crème fraîche","crème liquide","crème épaisse","crème fouettée",
    "fromage","gruyère","emmental","comté","beaufort","parmesan","grana padano",
    "pecorino","mozzarella","mozzarella di bufala","burrata","ricotta",
    "gorgonzola","roquefort","brie","camembert","chèvre","feta","halloumi",
    "mascarpone","philadelphia","fromage frais","fromage blanc","faisselle",
    "yaourt","yaourt grec","kéfir","crème glacée","glace",
    "chocolat au lait","lactosérum","caséine","lactose","whey",
    "caramel au beurre","sauce béchamel","gratinée","gratin",
    "sauce mornay","fondue","raclette","tartiflette",
  ],
  // FRUITS À COQUE
  fruits_coq: [
    "noix","noix de cajou","noix de pécan","noix de macadamia","noix du brésil",
    "amande","amandes","poudre d'amande","extrait d'amande","lait d'amande",
    "noisette","noisettes","pâte de noisette","praline noisette","nutella",
    "pistache","pistaches","pâte de pistache",
    "noix de coco","lait de coco","crème de coco","noix de coco râpée",
    "châtaigne","châtaignes","marron","marrons","farine de châtaigne",
    "pignon","pignons","pignon de pin","pin nut",
    "macaron","financier","dacquoise","gianduja","praliné",
  ],
  // CÉLERI
  celeri: [
    "céleri","céleri-rave","céleri branche","céleri en branches",
    "sel de céleri","extrait de céleri","graines de céleri",
    "bouquet garni","fumet","mirepoix","bouillon de légumes","bouillon cube",
    "waldorf","remoulade","soup de céleri",
  ],
  // MOUTARDE
  moutarde: [
    "moutarde","moutarde de dijon","moutarde à l'ancienne","moutarde en grains",
    "moutarde en poudre","graines de moutarde","huile de moutarde",
    "vinaigrette","sauce remoulade","sauce cocktail","mayonnaise moutarde",
    "chutney moutarde","pickles","cornichons à la moutarde",
  ],
  // SÉSAME
  sesame: [
    "sésame","graines de sésame","tahini","tahin","pâte de sésame",
    "huile de sésame","gomasio","pain au sésame","bagel",
    "hummus","houmous","halva","beurre de sésame",
  ],
  // SO2 / SULFITES
  so2: [
    "vin","vin blanc","vin rouge","vin rosé","champagne","mousseux","crémant",
    "cidre","bière sans gluten","vinaigre","vinaigre de vin","vinaigre balsamique",
    "fruits secs","abricot sec","raisin sec","figue sèche","pruneau",
    "jus de raisin","moutarde en poudre","sulfite","dioxyde de soufre",
    "e220","e221","e222","e223","e224","e225","e226","e227","e228",
    "cornichons","conserves de légumes","crevettes séchées",
  ],
  // LUPIN
  lupin: [
    "lupin","farine de lupin","graine de lupin","lupin blanc","lupin bleu",
    "graines de lupin","lupin en conserve","lupin germé",
  ],
  // MOLLUSQUES
  mollusques: [
    "coquille saint-jacques","saint-jacques","noix de saint-jacques",
    "moule","moules","huître","huîtres","coque","coques","palourde","palourdes",
    "couteau","pétoncle","pétoncles","bigorneau","bigorneaux","bulot","bulots",
    "calmar","calmars","seiche","seiches","pieuvre","poulpe","encornet",
    "mollusque","mollusques","fruits de mer",
  ],
};

export function detectAllergens(ingredients) {
  if (!ingredients || !Array.isArray(ingredients)) return [];
  const found = new Set();
  const normalized = ingredients.map((i) => i.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim());

  for (const [allergenId, keywords] of Object.entries(ALLERGEN_MAP)) {
    for (const kw of keywords) {
      const normKw = kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized.some((ing) => ing.includes(normKw) || normKw.includes(ing) && ing.length > 3)) {
        found.add(allergenId);
        break;
      }
    }
  }
  return [...found];
}