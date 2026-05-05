import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Férek.cz - Bezpečný český marketplace",
  description: "Prodávej na Férkovi. Bez obav. První český marketplace s Neklikni ochranou.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={inter.variable}>
      <body className="font-body">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
