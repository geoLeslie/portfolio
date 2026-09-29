import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Geoffrey Leslie | Data, ML & Design",
  description:
    "Computer Science student at BINUS University working across machine learning, data analysis, and UI/UX research.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
