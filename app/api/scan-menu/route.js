import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type || "image/jpeg";
    const isPDF = mimeType === "application/pdf";

    const prompt = `Tu es un chef cuisinier expert en cuisine française et internationale, spécialisé dans la réglementation allergènes INCO.

Analyse ce document (carte de restaurant, fiche recette, ou menu) et extrais tous les plats.

RÈGLE PRINCIPALE — pour chaque plat, tu as deux cas :

CAS 1 — Les ingrédients sont listés dans le document :
→ Utilise exactement ces ingrédients
→ "source": "carte"

CAS 2 — Le nom du plat est lisible mais les ingrédients ne sont PAS détaillés :
→ Propose les ingrédients de la recette traditionnelle française la plus courante pour ce plat
→ Sois exhaustif et précis (inclus les ingrédients principaux ET les ingrédients "cachés" comme farine, œufs, beurre dans les sauces)
→ "source": "suggestion_ia"
→ Exemple : "Blanquette de veau" → ["veau", "carottes", "poireaux", "oignon", "bouquet garni", "crème fraîche", "beurre", "farine", "jaune d'oeuf", "citron", "champignons"]

RÈGLES GÉNÉRALES :
1. Retourne UNIQUEMENT du JSON valide, aucun texte avant ou après
2. Normalise les noms d'ingrédients en français minuscules
3. Ignore les prix, descriptions marketing, numéros de section
4. Si le nom d'un plat est illisible ou flou, ignore-le
5. Inclus TOUS les plats détectés : entrées, plats, desserts, boissons avec ingrédients

FORMAT JSON EXACT — respecte-le strictement :
{
  "plats": [
    {
      "nom": "Nom exact du plat",
      "ingredients": ["ingredient1", "ingredient2"],
      "source": "carte",
      "confidence": "haute"
    },
    {
      "nom": "Nom d'un plat sans détail ingrédients",
      "ingredients": ["ingredient1", "ingredient2"],
      "source": "suggestion_ia",
      "confidence": "moyenne"
    }
  ],
  "stats": {
    "total": 5,
    "depuis_carte": 2,
    "suggestions_ia": 3
  },
  "note": "Message optionnel si problème de lisibilité"
}

Si aucun plat n'est détectable : {"plats": [], "stats": {"total": 0, "depuis_carte": 0, "suggestions_ia": 0}, "note": "Aucun plat détecté"}`;

    const messageContent = isPDF
      ? [
          { type: "text", text: prompt },
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
        ]
      : [
          { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
          { type: "text", text: prompt },
        ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 4096,
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