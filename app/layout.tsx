import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Workforce Fit Diagnostic",
  description: "Discover the specialist AI Agents best matched to your business.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
