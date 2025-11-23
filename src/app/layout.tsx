import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Axiom Pulse Clone",
  description: "Token discovery table – demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-axiom-bg text-axiom-textPrimary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

