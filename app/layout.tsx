import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mahek Provisions | Your Quality Grocery Store",
  description: "Experience the best quality groceries and provisions at Mahek Provisions. Freshness you can trust since decades. Located in Digras, Maharashtra.",
  keywords: ["Mahek Provisions", "Grocery Store Digras", "Premium Grains", "Organic Groceries", "Quality Provisions", "Mahek Provision Digras"],
  metadataBase: new URL("https://mahekprovisions.com"),
  alternates: {
    canonical: "/",
  },
};

export const viewport = {
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${plusJakarta.variable}`}>
        {children}
      </body>
    </html>
  );
}
