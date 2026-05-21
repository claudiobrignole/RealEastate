import type { Metadata } from "next";
import { Manrope, Noto_Serif } from 'next/font/google';
import "../index.css";

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
});

export const metadata: Metadata = {
  title: "ZeroAgenzia - CRM Immobiliare & Lead Builder",
  description: "Piattaforma CRM & Landing Page Builder per la Lead Generation Immobiliare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${notoSerif.variable}`}>
      <body className="font-body-md text-body-md bg-background text-on-background">
        {children}
      </body>
    </html>
  );
}
