import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!email || !subject || !message) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Envoi via Resend (ou Supabase edge function)
    // Pour l'instant : log + réponse OK (à connecter avec Resend ou Nodemailer)
    console.log("Support request:", { name, email, subject, message });

    // Si tu veux utiliser Resend (recommandé, gratuit jusqu'à 3000 emails/mois) :
    // npm install resend
    // const { Resend } = require("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "MenuSafe Support <noreply@menusafe.fr>",
    //   to: "contact@menusafe.fr",
    //   replyTo: email,
    //   subject: `[Support MenuSafe] ${subject}`,
    //   text: `De: ${name} <${email}>\n\nSujet: ${subject}\n\n${message}`,
    // });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}