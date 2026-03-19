import { NextResponse } from "next/server";

const LANGUAGES = {
  en: "English",
  es: "Spanish",
  de: "German",
  it: "Italian",
  nl: "Dutch",
  ja: "Japanese",
  zh: "Mandarin Chinese",
};

export async function POST(request) {
  try {
    const { recipes, targetLanguage } = await request.json();

    if (!recipes?.length || !targetLanguage) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    if (targetLanguage === "fr") {
      return NextResponse.json({ translations: recipes.map((r) => ({
        id: r.id, dishName: r.dish_name, ingredients: r.ingredients,
      })) });
    }

    const langName = LANGUAGES[targetLanguage];
    if (!langName) return NextResponse.json({ error: "Langue non supportée" }, { status: 400 });

    const prompt = `You are a professional culinary translator specializing in French cuisine.

Translate the following French restaurant menu items into ${langName}.

RULES:
1. Return ONLY valid JSON, no text before or after
2. Keep culinary terms authentic to the target language (use local equivalents when they exist)
3. Translate ingredient names naturally — not word by word
4. For Japanese and Mandarin, use standard culinary terminology
5. Keep the same array structure

INPUT:
${JSON.stringify(recipes.map((r) => ({ id: r.id, dishName: r.dish_name, ingredients: r.ingredients })))}

OUTPUT FORMAT (exact):
[
  {
    "id": "same-uuid",
    "dishName": "Translated dish name",
    "ingredients": ["translated ingredient 1", "translated ingredient 2"]
  }
]`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 8000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const translations = JSON.parse(clean);

    return NextResponse.json({ translations });
  } catch (err) {
    console.error("Translate error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}