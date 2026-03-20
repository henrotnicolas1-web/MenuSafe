// Utilitaire d'envoi d'email via Resend
// Usage : import { sendEmail } from "@/lib/sendEmail";

export async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — email not sent");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MenuSafe <noreply@menusafe.fr>",
        to,
        subject,
        html,
      }),
    });
    const data = await res.json();
    if (!res.ok) console.error("Resend error:", data);
    return data;
  } catch (err) {
    console.error("sendEmail error:", err);
  }
}