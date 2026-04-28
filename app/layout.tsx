import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientRootLayout } from "@/components/ClientRootLayout";

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
  // html must be server component, but body/client wrappers are client
  return (
    <html lang="id">
      <ClientRootLayout bodyClassName={inter.className}>
        {children}
      </ClientRootLayout>
    </html>
  );
}