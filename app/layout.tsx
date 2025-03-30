import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Federal Regulations Analyzer",
  description:
    "Analyze and visualize federal regulations from the Electronic Code of Federal Regulations (eCFR)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
