import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CATEGORY_LABELS_FR = {
  entree: "Entrées", plat: "Plats", dessert: "Desserts",
  boisson: "Boissons", autre: "Autres",
};
const CATEGORY_ORDER = ["entree", "plat", "dessert", "boisson", "autre"];

export async function POST(request) {
  try {
    const { establishmentId } = await request.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const [{ data: est }, { data: recipes }] = await Promise.all([
      supabase.from("establishments").select("name").eq("id", establishmentId).single(),
      supabase.from("recipes").select("*")
        .eq("establishment_id", establishmentId)
        .order("category").order("dish_name"),
    ]);

    if (!recipes?.length) {
      return NextResponse.json({ error: "Aucune recette trouvée" }, { status: 404 });
    }

    return NextResponse.json({
      establishment: est,
      recipes,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}