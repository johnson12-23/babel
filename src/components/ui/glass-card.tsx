import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <article
      className={`luxury-glow rounded-2xl border border-mist/25 bg-charcoal/50 p-6 backdrop-blur-md ${className}`}
    >
      {children}
    </article>
  );
}