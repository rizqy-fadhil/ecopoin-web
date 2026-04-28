"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ClientAppLayout } from "@/components/ClientAppLayout";

export function ClientRootLayout({
  children,
  bodyClassName,
}: {
  children: React.ReactNode;
  bodyClassName?: string;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <body className={bodyClassName}>
      {!isAdminRoute ? <ClientAppLayout>{children}</ClientAppLayout> : children}
    </body>
  );
}


