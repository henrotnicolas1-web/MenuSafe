import { NextResponse } from "next/server";

// Rate limiting en mémoire — par IP
// Max 5 scans par heure par IP (largement suffisant même pour 20 pages de menu)
const rateLimitMap = new Map();
const LIMIT_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 heure

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: LIMIT_PER_HOUR - 1 };
  }
  if (entry.count >= LIMIT_PER_HOUR) {
    const resetIn = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 60000);
    return { allowed: false, remaining: 0, resetIn };
  }
  entry.count += 1;
  return { allowed: true, remaining: LIMIT_PER_HOUR - entry.count };
}

// Nettoyage périodique pour éviter les fuites mémoire
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > WINDOW_MS * 2) rateLimitMap.delete(ip);
  }
}, WINDOW_MS);

export async function POST(request) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Limite atteinte. Vous pouvez faire ${LIMIT_PER_HOUR} analyses par heure. Réessayez dans ${rl.resetIn} minute(s).` },
      { status: 429 }
    );
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type || "image/jpeg";
    const isPDF = mimeType === "application/pdf";

    const prompt = `Tu es un expert en cuisine française et réglementation allergènes INCO (règlement UE 1169/2011).

Analyse ce document (carte de restaurant, fiche recette, ou menu) et extrais tous les plats.

RÈGLE PRINCIPALE — pour chaque plat, deux cas :
CAS 1 — Les ingrédients sont listés dans le document : utilise-les exactement. "source": "carte"
CAS 2 — Ingrédients non listés : propose la recette traditionnelle française la plus courante. "source": "suggestion_ia"

━━━ RÈGLES STRICTES POUR LES ALLERGÈNES ━━━
Sois TRÈS conservateur. Un faux positif est pire qu'un oubli pour un restaurateur.
✓ Liste un allergène UNIQUEMENT si :
  - Il est explicitement mentionné dans les ingrédients (ex: "farine" → gluten, "lait" → lait)
  - OU c'est un composant INDISSOCIABLE et SYSTÉMATIQUE de l'ingrédient listé
    Ex valides : mozzarella→lait, parmesan→lait, pain→gluten, beurre→lait, crème→lait
    Ex valides : oeuf entier→oeufs, mayonnaise→oeufs, pâte fraîche→gluten+oeufs
✗ NE PAS déduire par association vague :
  - "sauce tomate" seule → PAS de fruits à coque, PAS de gluten, PAS de lait
  - "jambon" seul → aucun allergène
  - "champignons" → aucun allergène
  - "légumes", "salade", "tomate", "oignon" → aucun allergène
  - Un plat de viande grillée sans sauce → probablement aucun allergène
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRADUCTIONS : Pour chaque plat, génère les traductions dans ces 7 langues en une seule fois :
en (English), es (Spanish), de (German), it (Italian), nl (Dutch), ja (Japanese), zh (Mandarin)
Traduis le nom ET les ingrédients de manière naturelle et culinaire.
Ingrédients : noms courts (1-3 mots max), pas de phrases.

RÈGLES GÉNÉRALES :
1. Retourne UNIQUEMENT du JSON valide, aucun texte avant ou après
2. Ingrédients en français minuscules
3. Ignore les prix, descriptions marketing, numéros

CATÉGORIE : Détermine la catégorie de chaque plat parmi ces valeurs exactes :
- "entree" : entrées, salades, soupes, amuse-bouches, tartares, carpaccios
- "plat" : plats principaux, pizzas, pastas, burgers, viandes, poissons
- "dessert" : desserts, glaces, sorbets, pâtisseries, tiramisus, panacottas, crèmes, tartes sucrées, gâteaux
- "boisson" : boissons, cocktails, vins, cafés, thés
- "autre" : tout ce qui ne rentre pas dans les catégories ci-dessus

FORMAT JSON EXACT :
{
  "plats": [
    {
      "nom": "Nom du plat en français",
      "ingredients": ["ingredient1", "ingredient2"],
      "categorie": "plat",
      "source": "carte",
      "confidence": "haute",
      "translations": {
        "en": { "dish_name": "Dish name", "ingredients": ["ing1", "ing2"] },
        "es": { "dish_name": "Nombre", "ingredients": ["ing1", "ing2"] },
        "de": { "dish_name": "Name", "ingredients": ["Zut1", "Zut2"] },
        "it": { "dish_name": "Nome", "ingredients": ["ing1", "ing2"] },
        "nl": { "dish_name": "Naam", "ingredients": ["ing1", "ing2"] },
        "ja": { "dish_name": "料理名", "ingredients": ["食材1", "食材2"] },
        "zh": { "dish_name": "菜名", "ingredients": ["食材1", "食材2"] }
      }
    }
  ],
  "stats": {
    "total": 5,
    "depuis_carte": 3,
    "suggestions_ia": 2
  },
  "note": "Message optionnel si problème de lisibilité"
}

Si aucun plat détectable : {"plats":[],"stats":{"total":0,"depuis_carte":0,"suggestions_ia":0},"note":"Aucun plat détecté"}`;

    const messageContent = isPDF
      ? [{ type: "text", text: prompt }, { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } }]
      : [{ type: "image", source: { type: "base64", media_type: mimeType, data: base64 } }, { type: "text", text: prompt }];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 16000,
        messages: [{ role: "user", content: messageContent }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Erreur API: ${err}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Erreur scan-menu:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}