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
  fruits_coq: ["noix","noix de cajou","noix de pécan","noix de macadamia","noix du brésil","amande","amandes","poudre d'amande","lait d'amande","noisette","noisettes","pâte de noisette","nutella","pistache","pistaches","noix de coco","lait de coco","crème de coco","beurre de coco","huile de coco","noix de coco râpée","châtaigne","marron","farine de châtaigne","pignon","pignons","macaron","financier","praliné","gianduja","beurre de coco","huile de coco"],
  celeri:     ["céleri","céleri-rave","céleri branche","sel de céleri","extrait de céleri","graines de céleri","bouquet garni","mirepoix","bouillon de légumes","bouillon cube"],
  moutarde:   ["moutarde","moutarde de dijon","moutarde à l'ancienne","moutarde en grains","moutarde en poudre","graines de moutarde","huile de moutarde","vinaigrette","sauce remoulade","mayonnaise moutarde"],
  sesame:     ["sésame","graines de sésame","tahini","tahin","pâte de sésame","huile de sésame","gomasio","pain au sésame","hummus","houmous","halva"],
  so2:        ["vin","vin blanc","vin rouge","vin rosé","champagne","mousseux","crémant","cidre","vinaigre","vinaigre de vin","vinaigre balsamique","fruits secs","abricot sec","raisin sec","figue sèche","pruneau","sulfite","dioxyde de soufre","e220","e221","e222","cornichons"],
  lupin:      ["lupin","farine de lupin","graine de lupin","lupin blanc","lupin bleu"],
  mollusques: ["coquille saint-jacques","saint-jacques","moule","moules","huître","huîtres","coque","coques","palourde","palourdes","calmar","calmars","seiche","seiches","pieuvre","poulpe","encornet","mollusque","mollusques","fruits de mer","bigorneau","bulot","pétoncle"],
};


// ─── Ingrédients supplémentaires (autocomplétion étendue ~3000) ───────────────
// Ingrédients sans allergène ou déjà couverts par le ALLERGEN_MAP
const EXTRA_INGREDIENTS = [
  // Viandes & charcuterie
  "bœuf","veau","agneau","porc","poulet","canard","dinde","pintade","caille","faisan",
  "lapin","gibier","sanglier","cerf","chevreuil","perdrix","pigeon","oie","autruche",
  "jambon blanc","jambon cru","jambon de Bayonne","jambon de Parme","prosciutto",
  "jambon ibérique","jambon serrano","chorizo","merguez","saucisse","saucisson",
  "boudin noir","boudin blanc","andouille","andouillette","rillettes","terrine",
  "pâté","foie gras","magret","confit de canard","lardons","bacon","pancetta",
  "guanciale","coppa","bresaola","viande hachée","steak haché","escalope",
  "côte de bœuf","entrecôte","filet","tournedos","bavette","onglet","paleron",
  "joue de bœuf","osso buco","jarret","travers de porc","côte de porc","filet mignon",
  "rôti de porc","échine","poitrine de porc","lomo","mortadelle","salami",
  "pepperoni","speck","tête fromagée","langue de bœuf","ris de veau","rognons",
  "foie de veau","foie de poulet","gésiers","cœur","cervelle","os à moelle",

  // Poissons (supplémentaires)
  "dorade","mulet","grondin","vieille","mérou","pageot","chapelure de poisson",
  "stockfish","morue","morue salée","brandade","bouillabaisse","lotte","baudroie",
  "flétan","raie","requin","espadon","marlin","saumon fumé","truite fumée",
  "hareng fumé","hareng saur","kipper","maquereau fumé","anguille fumée",
  "caviar","œufs de lump","œufs de saumon","rogue","poutargue","bottarga",
  "furikake","katsuobushi","bonite séchée","dashi","kombu","nori",

  // Crustacés & mollusques (supplémentaires)
  "bouquet","crevette rose","crevette grise","crevette tiger","scampi",
  "cigale de mer","squille","étrille","araignée de mer","dormeur","poupart",
  "couteau de mer","violet","oursin","telline","amande de mer","praire",
  "clovisse","clam","abalone","ormeau","escargot","limaçon",
  "encornet","chipiron","tentacule","encre de seiche",

  // Légumes frais
  "tomate","tomates cerises","tomate séchée","poivron","poivron rouge","poivron vert",
  "poivron jaune","piment","piment doux","piment d'Espelette","paprika frais",
  "courgette","aubergine","concombre","cornichon","radis","navet","rutabaga",
  "panais","topinambour","salsifis","betterave","betterave rouge","betterave jaune",
  "carotte","carotte violette","patate douce","pomme de terre","pommes de terre",
  "pomme de terre ratte","vitelotte","grenaille","gnocchi de pomme de terre",
  "oignon","oignon rouge","oignon blanc","oignon de Roscoff","cive","ciboule",
  "ciboulette","échalote","ail","ail noir","ail des ours","ail confit","ail fumé",
  "poireau","fenouil","céleri branche","céleri-rave","brocoli","chou-fleur",
  "chou blanc","chou rouge","chou vert","chou frisé","chou de Bruxelles","kale",
  "pak choi","bok choy","chou chinois","chou romanesco","épinard","blette",
  "bette","oseille","cresson","mâche","roquette","mesclun","endive","chicorée",
  "radicchio","laitue","laitue romaine","scarole","frisée","batavia",
  "artichaut","cardon","asperge","asperge verte","asperge blanche","asperge sauvage",
  "petit pois","pois cassé","pois gourmand","mange-tout","haricot vert",
  "haricot beurre","haricot plat","haricot blanc","haricot rouge","haricot noir",
  "flageolet","lentille verte","lentille coral","lentille beluga","lentille du Puy",
  "pois chiche","fève","edamame","soja vert","germe de soja","pousse de bambou",
  "maïs","maïs doux","polenta","semoule de maïs","farine de maïs","épis de maïs",
  "champignon","champignon de Paris","shiitake","pleurote","girolles","chanterelle",
  "morille","cèpe","bolet","truffe","truffe noire","truffe blanche","truffe d'été",
  "olive","olive noire","olive verte","tapenade","olivade","huile d'olive",
  "câpre","câpron","cornichon à la moutarde","pickles","kimchi","choucroute",

  // Fruits frais
  "pomme","poire","pêche","nectarine","abricot","cerise","prune","mirabelle",
  "quetsche","reine-claude","brugnon","mangue","papaye","ananas","kiwi","goyave",
  "maracuja","fruit de la passion","litchi","longane","rambutan","carambole",
  "physalis","pitaya","fruit du dragon","kumquat","bergamote","yuzu","combava",
  "citron","citron vert","lime","orange","mandarine","clémentine","pamplemousse",
  "pomelo","blood orange","fraise","framboise","myrtille","mûre","groseille",
  "cassis","airelle","cranberry","figue","figue de Barbarie","grenade","datte",
  "banane","banane plantain","ananas victoria","melon","pastèque","raisin",
  "raisin muscat","raisin blanc","raisin rouge","raisin noir","avocat",

  // Herbes aromatiques fraîches
  "basilic","basilic thaï","basilic citron","basilic pourpre","persil plat",
  "persil frisé","coriandre","coriandre fraîche","menthe","menthe poivrée",
  "menthe fraîche","estragon","cerfeuil","aneth","fenouil frais","feuilles de fenouil",
  "romarin","thym","thym citron","thym frais","laurier","sauge","origan",
  "origan frais","sarriette","marjolaine","lavande","verveine","mélisse",
  "citronnelle","lemongrass","feuilles de citronnier","feuilles de curry",
  "feuilles de laurier","feuilles de vigne","feuilles de kaffir","shiso",
  "perilla","feuilles de shiso rouge","rau om","rau ram","feuilles de pandan",

  // Épices & condiments
  "sel","sel de mer","fleur de sel","sel de guérande","sel rose de l'Himalaya",
  "sel fumé","sel aux herbes","poivre noir","poivre blanc","poivre vert","poivre rouge",
  "poivre long","poivre de Sichuan","poivre de Kampot","poivre de Madagascar",
  "piment de Cayenne","paprika","paprika fumé","piment d'Espelette en poudre",
  "curcuma","cumin","cumin en grains","coriandre en poudre","cardamome",
  "cannelle","noix de muscade","clou de girofle","badiane","anis étoilé",
  "anis vert","fenouil en poudre","fenugrec","sumac","zaatar","ras el hanout",
  "harissa","chermoula","dukkah","baharat","garam masala","curry","curry jaune",
  "curry rouge","curry vert","massaman","madras","colombo","tandoori","tikka masala",
  "herbes de Provence","bouquet garni","quatre épices","épices cajun","old bay",
  "poudre de chili","jalapeño en poudre","chipotle","ancho","pasilla","guajillo",
  "wasabi","raifort","raifort en crème","gingembre","gingembre frais","gingembre confit",
  "galanga","curcuma frais","tamarin","tamarin en pâte","tamarin en poudre",
  "safran","vanille","vanille en poudre","extrait de vanille","gousse de vanille",
  "fleur d'oranger","eau de rose","eau de fleur d'oranger",

  // Sauces & condiments
  "ketchup","sauce tomate","coulis de tomate","concentré de tomate","tomate pelée",
  "passata","sauce bolognaise","sauce arrabiata","sauce puttanesca","sauce marinara",
  "sauce napolitaine","sauce romesco","sauce vierge","sauce à la crème","sauce au vin",
  "sauce bourguignonne","sauce chasseur","sauce périgueux","sauce bordelaise",
  "sauce poivrade","sauce grand veneur","sauce diane","sauce lyonnaise",
  "sauce soubise","sauce aurore","sauce suprême","sauce velouté","sauce espagnole",
  "fond de veau","fond de volaille","fond de poisson","bouillon de bœuf",
  "bouillon de poulet","bouillon de légumes","consommé","dashi","fumet de poisson",
  "glace de viande","jus de veau","jus de canard","sauce soja","tamari",
  "sauce hoisin","sauce teriyaki","sauce yakitori","sauce tsuyu","mirin",
  "saké","vin de riz","sauce nuoc-mâm","sauce poisson","sauce huître",
  "sauce XO","sauce aux prunes","sauce aux haricots noirs","sauce douce-amère",
  "sauce piquante","tabasco","sriracha","sambal oelek","harissa","gochujang",
  "doenjang","miso blanc","miso rouge","miso noir","tahini","beurre de sésame",
  "houmous","caviar d'aubergine","baba ganoush","tzatziki","yaourt nature",
  "crème aigre","smetana","labné","fromage blanc","ricotta fraîche",
  "vinaigrette","huile d'olive","huile de tournesol","huile de colza",
  "huile de pépin de raisin","huile de noix","huile de noisette","huile de sésame",
  "huile de coco","huile de palme","huile de maïs","huile d'arachide",
  "vinaigre de vin rouge","vinaigre de vin blanc","vinaigre balsamique",
  "vinaigre de cidre","vinaigre de riz","vinaigre de Xérès","vinaigre de framboise",

  // Féculents, céréales & légumineuses
  "riz blanc","riz basmati","riz jasmin","riz noir","riz rouge","riz carnaroli",
  "riz arborio","riz vialone","riz complet","riz sauvage","riz gluant","riz soufflé",
  "quinoa","quinoa blanc","quinoa rouge","quinoa noir","amarante","sarrasin",
  "farine de sarrasin","galette de sarrasin","millet","sorgho","teff","épeautre",
  "petit épeautre","farro","orge mondé","orge perlé","boulgour fin","boulgour gros",
  "couscous fin","couscous moyen","couscous israélien","polenta fine","polenta épaisse",
  "farine de riz","farine de pois chiche","farine de châtaigne","farine de coco",
  "farine de lin","farine d'amarante","farine de teff","fécule de maïs",
  "fécule de pomme de terre","fécule de tapioca","arrow-root","agar-agar",
  "pain blanc","pain complet","pain de mie","baguette","ciabatta","focaccia",
  "pita","naan","chapati","tortilla","wraps","blinis","crackers","gressins",
  "croûton","chapelure","panko","pain rassis","pain de campagne","pain au levain",
  "brioche","croissant","pain au chocolat","pain aux raisins","kouglof",
  "pâte filo","pâte brick","pâte feuilletée","pâte brisée","pâte sablée",
  "pâte à choux","pâte à pizza","pâte fraîche","pâtes alimentaires",
  "spaghetti","linguine","tagliatelle","fettuccine","pappardelle","bucatini",
  "rigatoni","penne","fusilli","farfalle","orecchiette","mezze penne",
  "conchiglie","lumache","tortiglioni","maccheroni","ditalini","tubetti",
  "vermicelle","spaghettini","capellini","cheveux d'ange","lasagne","cannelloni",
  "tortellini","ravioli","gnocchi","spätzle","nouilles","nouilles de riz",
  "nouilles soba","nouilles udon","nouilles ramen","nouilles somen","pho",
  "vermicelle de riz","vermicelle de soja","cellophane","shirataki",

  // Produits laitiers (supplémentaires)
  "beurre demi-sel","beurre doux","beurre clarifié","ghee","beurre de cacahuète",
  "crème fraîche épaisse","crème fraîche liquide","crème fouettée","crème chantilly",
  "crème de coco","crème de soja","lait entier","lait demi-écrémé","lait écrémé",
  "lait en poudre","lait concentré sucré","lait concentré non sucré","lait de coco",
  "lait d'amande","lait de riz","lait d'avoine","lait de noisette","lait de soja",
  "yaourt grec","yaourt brassé","yaourt nature","fromage blanc","faisselle",
  "petit-suisse","kéfir","babeurre","crème de Bresse","crème d'Isigny",
  "comté","beaufort","abondance","gruyère","emmental","raclette","reblochon",
  "tartiflette","fondue savoyarde","vacherin","tomme de Savoie","tomme de brebis",
  "ossau-iraty","manchego","idiazabal","mahon","tetilla","queso fresco",
  "parmesan","grana padano","pecorino romano","pecorino sardo","grana","asiago",
  "provolone","scamorza","mozzarella","mozzarella di bufala","burrata","stracciatella",
  "mascarpone","ricotta","ricotta salata","caciocavallo","ragusano",
  "brie","camembert","coulommiers","chaource","neufchâtel","brillat-savarin",
  "époisses","munster","livarot","pont-l'évêque","maroilles","langres","soumaintrain",
  "roquefort","bleu d'auvergne","fourme d'ambert","bleu de gex","stilton","gorgonzola",
  "chèvre frais","crottin de Chavignol","sainte-maure","valençay","selles-sur-Cher",
  "pouligny-saint-pierre","picodon","rocamadour","banon","bûche de chèvre",
  "feta","halloumi","mizithra","manouri","fromage de brebis","pélardon",
  "cottage cheese","ricotta fraîche","fromage à tartiner","kiri","vache qui rit",

  // Fruits secs & oléagineux
  "amande mondée","amande effilée","amande concassée","poudre d'amande","purée d'amande",
  "noisette entière","noisette concassée","praliné noisette","purée de noisette",
  "noix entière","cerneaux de noix","noix de cajou entière","noix de cajou grillée",
  "beurre de cajou","noix du Brésil","noix de pécan","noix de macadamia",
  "pistache nature","pistache grillée","pistache mondée","pâte de pistache",
  "pignon de pin","noix de coco râpée","noix de coco en poudre","noix de coco grillée",
  "farine de noix de coco","beurre de coco","huile de coco vierge",
  "graines de tournesol","graines de citrouille","graines de courge","graines de lin",
  "graines de chia","graines de chanvre","graines de pavot","graines de nigelle",
  "graines de coriandre","graines de fenouil","graines de cumin","graines de moutarde",
  "graines de sésame blanc","graines de sésame noir","tahini blanc","tahini noir",
  "sésame grillé","gomme arabique","lecithine de tournesol","lécithine",
  "raisin sec","raisin de Corinthe","raisin de Malaga","sultanine",
  "abricot sec","pêche séchée","prune sèche","pruneau d'Agen","figue sèche",
  "datte Medjool","datte Deglet","figue de Smyrne","canneberge séchée",
  "cranberry séchée","cerise séchée","mangue séchée","papaye séchée","ananas séché",
  "kiwi séché","pomme séchée","poire séchée","coing séché","tamarin sec",

  // Sucres, sirops & édulcorants
  "sucre blanc","sucre roux","sucre de canne","cassonade","vergeoise blonde",
  "vergeoise brune","sucre glace","sucre semoule","sucre cristal","sucre perlé",
  "sucre muscovado","sucre de coco","sucre de palme","sirop d'érable",
  "sirop d'agave","sirop de glucose","sirop de fructose","sirop de maïs",
  "miel d'acacia","miel de fleurs","miel de châtaignier","miel de lavande",
  "miel toutes fleurs","miel de sapin","miel de bruyère","miel crémeux",
  "confiture","gelée de groseille","marmelade","pâte de fruits","coulis de fruits",
  "compote","purée de fruits","caramel","caramel au beurre salé","dulce de leche",
  "pâte à tartiner","nutella","pralinoise","chocolat noir","chocolat au lait",
  "chocolat blanc","chocolat de couverture","cacao en poudre","cacao amer",
  "cacao cru","fève de cacao","nibs de cacao","carob","caroube",

  // Alcools & boissons
  "vin blanc","vin rouge","vin rosé","vin de Bourgogne","vin de Bordeaux",
  "champagne","prosecco","cava","crémant","vin mousseux","vin pétillant",
  "porto","madère","xérès","marsala","vin de Sauternes","vin d'Alsace",
  "bière blonde","bière brune","bière blanche","bière ambrée","bière de garde",
  "cidre brut","cidre doux","pommeau","calvados","cognac","armagnac","rhum",
  "rhum blanc","rhum ambré","rhum vieux","whisky","whiskey","bourbon","scotch",
  "vodka","gin","tequila","mezcal","cachaca","sake","vin de prune","vin de riz",
  "liqueur d'orange","cointreau","grand marnier","triple sec","amaretto","baileys",
  "crème de cassis","crème de menthe","crème de cacao","kahlua","tia maria",
  "jus d'orange","jus de citron","jus de pomme","jus de pamplemousse",
  "jus d'ananas","jus de mangue","jus de tomate","jus de grenade","jus de coing",
  "thé vert","thé noir","thé oolong","thé blanc","matcha","sencha","gyokuro",
  "earl grey","darjeeling","assam","lapsang souchong","rooibos","tisane",
  "café","café expresso","café lungo","café ristretto","café noisette",
  "café latte","cappuccino","café mocha","café viennois","café glacé",

  // Cuisine asiatique
  "tofu soyeux","tofu ferme","tofu fumé","tempeh","natto","seitan","gluten de blé",
  "fu","yuba","peau de tofu","lait de soja","haricot noir fermenté",
  "pâte de soja fermentée","miso shiro","miso aka","tsuyu","ponzu","mentsuyu",
  "dashi de kombu","dashi de bonite","dashi mixte","bonite en flocons",
  "algue nori","algue wakame","algue kombu","algue hijiki","algue mozuku",
  "algue spiruline","algue chlorelle","agar agar","konnyaku","shirataki",
  "konjac","patate de konjac","sauce hoisin","sauce aux prunes","sauce XO",
  "pâte de crevettes","belacan","balachan","bagoong","prahok","pa daek",
  "galangal","citronnelle","feuilles de lime kaffir","pandan","gochugaru",
  "doenjang","gochujang","ssamjang","dwenjang","kimchi","kimchi de chou",
  "kimchi de radis","kimchi de concombre","banchan","japchae","bibimbap",
  "pad thaï","pad see ew","khao pad","larb","som tam","massaman","gaeng daeng",
  "pho bo","bun bo hue","banh mi","banh xeo","goi cuon","cha gio","com tam",
  "char siu","dim sum","xiaolongbao","har gow","siu mai","cheung fun",

  // Cuisine du monde
  "zaatar","sumac","dukkah","baharat","ras el hanout","chermoula","harissa",
  "preserved lemon","citron confit","olive kalamata","olive taggiasca",
  "guanciale","nduja","'nduja","pecorino","caciocavallo","provolone piccante",
  "gremolata","salsa verde","pesto","pesto genovese","pesto rosso","tapenade",
  "anchoïade","brandade de morue","ratatouille","piperade","bouillabaisse",
  "cassoulet","confit","magret séché","foie gras poêlé","foie gras mi-cuit",
  "tortilla española","gazpacho","salmorejo","pan con tomate","sobrasada",
  "patatas bravas","croquetas","jamón ibérico","jamon serrano","chorizo ibérico",
  "morcilla","lacón","tetilla","tetilla cheese","txakoli","sidra",
  "hummus","mutabal","fattoush","tabboulé","kibbeh","kofta","shawarma",
  "falafel","labneh","fatteh","manakeesh","knafeh","baklava","kunafa",
  "halloumi grillé","za'atar","pomegranate molasses","mélasse de grenade",
  "rose water","eau de rose","orange blossom water","carob molasses",
  "injera","berbere","niter kibbeh","tej","teff","fenugrec",
  "jollof rice","egusi","ugali","fufu","yam","manioc","plantain",
  "achards","rougail","massalé","curcuma frais","feuilles de caloupilé",
  "colombo","chili","cumin","coriandre","piment antillais","bonda man jack",

  // Pâtisserie & boulangerie
  "levure fraîche","levure sèche","levure chimique","bicarbonate de soude",
  "gélatine","gélatine en feuille","gélatine en poudre","agar agar","pectine",
  "glucose","dextrose","isomalt","fondant","pâte d'amande","massepain",
  "praliné","gianduja","crème de marrons","pâte de pistache",
  "crème pâtissière","crème mousseline","crème chiboust","crème diplomate",
  "crème légère","crème au beurre","ganache","ganache montée","gelée de fruits",
  "biscuit joconde","biscuit cuillère","génoise","dacquoise","financier",
  "madeleine","cannelé","kouign-amann","far breton","clafoutis",
  "tarte tatin","quiche","gougère","chou à la crème","éclair","mille-feuille",
  "opéra","saint-honoré","paris-brest","religieuse","baba au rhum",
  "savarin","charlotte","bavarois","entremet","mousse au chocolat","soufflé",
  "crème brûlée","île flottante","œufs à la neige","tarte aux pommes",
  "tarte citron","tarte aux fraises","tarte bourdaloue","galette des rois",
  "bûche de Noël","bûche glacée","macaron","meringue","pavlova",

  // Divers
  "fleur comestible","fleur de sureau","fleur de courgette","fleur de bourrache",
  "fleur de capucine","pétale de rose","lavande","violette","pensée",
  "truffe blanche d'Alba","truffe noire du Périgord","truffe d'été",
  "champignon trompette de la mort","champignon pied de mouton",
  "champignon matsutake","champignon enoki","champignon maitake",
  "champignon nameko","champignon reishi","champignon chaga",
  "levure nutritionnelle","levure de bière","malt","extrait de malt",
  "vinaigre de cidre non filtré","vinaigre de champagne","vinaigre d'umeboshi",
  "citron caviar","main de Bouddha","bergamote fraîche","sudachi","kabosu",
  "poivre de Timut","poivre de la Jamaïque","poivre cubèbe","poivre de Selim",
  "cardamome noire","cardamome verte","cardamome blanche","mastic","galanga",
  "curcuma de la Réunion","vanille de Madagascar","vanille de Tahiti",
  "wasabi frais","wasabi en poudre","raifort frais","yuzu","combava",
];

// Autocomplétion — liste plate de tous les ingrédients connus
const ALL_INGREDIENTS = [...new Set([...Object.values(ALLERGEN_MAP).flat(), ...EXTRA_INGREDIENTS])].sort();

export function getSuggestions(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const scored = ALL_INGREDIENTS
    .map((ing) => {
      const norm = ing.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (norm.startsWith(q)) return { ing, score: 0 };       // "larc" → "lardons" ✓
      if (norm.includes(q)) return { ing, score: 1 };          // "beurre clarifié" ← "beurr" ✓
      if (q.includes(norm) && norm.length > 3) return { ing, score: 2 }; // sous-chaîne inverse
      // Fuzzy: chaque mot de l'ingrédient commence par la saisie
      const words = norm.split(/\s+/);
      if (words.some(w => w.startsWith(q))) return { ing, score: 1 };
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score);
  return scored.slice(0, 10).map(x => x.ing);
}

export function detectAllergens(ingredients) {
  if (!ingredients || !Array.isArray(ingredients)) return [];
  const found = new Set();
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const normalized = ingredients.map(norm);

  // Exclusions explicites : ingrédients qui contiennent un mot-clé mais ne sont pas allergènes
  const EXCLUSIONS = {
    lait: ["lait de coco", "lait d'amande", "lait de riz", "lait d'avoine",
           "lait de noisette", "lait vegetal", "beurre de coco", "creme de coco",
           "beurre de cacahuete", "beurre de cajou", "beurre d'amande",
           "creme de soja", "creme de riz", "creme de coco"],
    soja: ["yaourt", "yaourt nature", "yaourt grec", "yaourt brasse",
           "yaourt vanille", "fromage blanc", "faisselle"],
  };

  for (const [allergenId, keywords] of Object.entries(ALLERGEN_MAP)) {
    const exclusions = (EXCLUSIONS[allergenId] || []).map(norm);
    
    for (const kw of keywords) {
      const normKw = norm(kw);
      const kwIsMultiWord = normKw.includes(" ");

      const match = normalized.some((ing) => {
        // Vérifie d'abord les exclusions
        if (exclusions.some(ex => ing === ex)) return false;

        if (ing === normKw) return true;  // correspondance exacte

        if (kwIsMultiWord) {
          // Mot-clé multi-mots : l'ingrédient doit le contenir
          return ing.includes(normKw);
        } else {
          // Mot-clé simple : correspondance exacte ou l'ingrédient commence par le mot-clé
          // "lait" matche "lait entier" mais PAS "lait de coco"
          // On vérifie que le mot suivant n'est pas "de" ou "d'"
          if (!ing.includes(normKw)) return false;
          const idx = ing.indexOf(normKw);
          const after = ing[idx + normKw.length];
          // Accepté si : fin de chaîne, espace suivi d'autre chose que "de/d'",
          // ou précédé d'un espace (milieu de phrase)
          if (after === undefined) return true;  // fin exacte
          if (after === " ") {
            const nextWord = ing.slice(idx + normKw.length + 1).split(" ")[0];
            if (nextWord === "de" || nextWord === "d") return false;  // "lait de coco"
            return true;
          }
          return false;
        }
      });

      if (match) { found.add(allergenId); break; }
    }
  }
  return [...found];
}