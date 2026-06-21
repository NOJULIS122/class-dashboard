import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClassFlow Dashboard",
  description: "A class management dashboard for students and teachers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
