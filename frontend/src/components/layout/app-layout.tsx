"use client";

import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className={cn("flex-1 flex flex-col h-screen overflow-hidden", className)}>
      {children}
    </div>
  );
}
