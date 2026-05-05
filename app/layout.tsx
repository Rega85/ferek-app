import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Férek – Férové tržiště, kde vás nenapálí",
  description: "Prodávej a nakupuj bezpečně. První český marketplace s ověřováním inzerátů. Bez podvodů, bez stresu.",
  keywords: "marketplace, bazar, inzeráty, prodej, nákup, bezpečný, ověřený, Česko",
  openGraph: {
    title: "Férek – Férové tržiště",
    description: "Prodávej a nakupuj bezpečně. První český marketplace s ověřováním inzerátů.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>
        {children}
      </body>
    </html>
  );
}
