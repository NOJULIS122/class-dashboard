import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baltas Triušis | Valdymo sistema",
  description: "Mokinių, grupių, lankomumo ir mokėjimų valdymo sistema",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt" className="h-full antialiased">
      <body className="min-h-full bg-[#f7fbff] text-[#19407a]">
        {children}
      </body>
    </html>
  );
}
