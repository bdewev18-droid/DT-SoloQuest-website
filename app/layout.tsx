import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import "./effects.css";
import { ScrollReveal } from "./components/ScrollReveal";
import { AuthProvider } from "./components/AuthProvider";

const display = Cinzel({ variable: "--font-display", subsets: ["latin"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solo Quest — A Dice Throne Solo Adventure",
  description: "Face Minion Rush and Naxarus with combat automation and AI-powered narration.",
  metadataBase: new URL("https://solo-quest-companion.darby4.chatgpt.site"),
  openGraph: { title: "Solo Quest", description: "Your hero. Their turn to play.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Solo Quest", description: "A Dice Throne solo adventure.", images: ["/og.png"] },
  icons: { icon: "/app_icon.png", shortcut: "/app_icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${body.variable}`}><AuthProvider>{children}<ScrollReveal/></AuthProvider></body></html>;
}
