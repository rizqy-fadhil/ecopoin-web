import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientAppLayout } from "@/components/ClientAppLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoPoin - Bank Sampah Digital",
  description: "Platform daur ulang sampah menjadi poin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ClientAppLayout>{children}</ClientAppLayout>
      </body>
    </html>
  );
}