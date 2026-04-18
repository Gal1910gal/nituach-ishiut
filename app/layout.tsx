import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ניתוח אישיות ASIO",
  description: "דשבורד לניתוח אישיות מקצועי — Big Five",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-gray-50 min-h-screen antialiased">{children}</body>
    </html>
  );
}
