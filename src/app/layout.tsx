import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import AuthProvider from "@/context/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carverse — Explore Every Machine Ever Created",
  description: "A premium vehicle intelligence platform. Compare hypercars, superbikes, electric vehicles, and SUVs in the interactive Battle Arena and build your Dream Garage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-matte-black text-foreground antialiased">
        <AuthProvider>
          <AppProvider>
            <Navbar />
            <main className="flex-grow w-full flex flex-col">
              {children}
            </main>
            <Footer />
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
