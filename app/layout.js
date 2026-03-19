import "./globals.css";

export const metadata = {
  title: "MenuSafe — Gestion allergènes restaurant",
  description: "Créez et gérez vos fiches allergènes en quelques minutes. Conformité légale garantie.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}