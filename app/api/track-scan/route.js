import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const { establishment_id, menu_slug, lang, user_agent } = await request.json();
    if (!establishment_id) return NextResponse.json({ ok: false });

    // Détection device type depuis user agent
    const ua = (user_agent || "").toLowerCase();
    const device_type = /mobile|iphone|android|ipad/.test(ua)
      ? (/ipad|tablet/.test(ua) ? "tablet" : "mobile")
      : "desktop";

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    await supabase.from("qr_scans").insert({
      establishment_id,
      menu_slug,
      lang: lang || "fr",
      device_type,
      user_agent: null, // on ne stocke pas l'UA complet pour RGPD
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Silencieux — ne pas bloquer la carte client
    return NextResponse.json({ ok: false });
  }
}