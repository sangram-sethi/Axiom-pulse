import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/Providers";
import { TopNav } from "@/components/layout/TopNav";
import { SearchProvider } from "@/context/SearchContext";

export const metadata: Metadata = {
  title: "AXIOM Pro • Pulse",
  description: "Token discovery table clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-axiom-textPrimary antialiased">
        <Providers>
          <SearchProvider>
            <div className="flex min-h-screen flex-col">
              <TopNav />
              <main className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 md:px-6">
                {children}
              </main>
            </div>
          </SearchProvider>
        </Providers>
      </body>
    </html>
  );
}

