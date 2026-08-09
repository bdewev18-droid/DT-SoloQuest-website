import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import "./effects.css";
import { ScrollReveal } from "./components/ScrollReveal";
import { AuthProvider } from "./components/AuthProvider";

const display = Cinzel({ variable: "--font-display", subsets: ["latin"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solo Quest — L’aventure Dice Throne en solo",
  description: "Affrontez Minion Rush et Naxarus avec un automate de combat et une narration pilotée par IA.",
  metadataBase: new URL("https://solo-quest.example.com"),
  openGraph: { title: "Solo Quest", description: "Votre héros. Leur tour de jouer.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Solo Quest", description: "L’aventure Dice Throne en solo.", images: ["/og.png"] },
  icons: { icon: "/app_icon.png", shortcut: "/app_icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body className={`${display.variable} ${body.variable}`}><AuthProvider>{children}<ScrollReveal/></AuthProvider></body></html>;
}
