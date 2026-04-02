"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackConversion } from "@/lib/tracking";

type TrackLinkProps = {
  href: string;
  eventName: string;
  className: string;
  children: ReactNode;
  target?: "_self" | "_blank";
  rel?: string;
};

export function TrackLink({
  href,
  eventName,
  className,
  children,
  target,
  rel,
}: TrackLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      target={target}
      rel={rel ?? (target === "_blank" ? "noreferrer" : undefined)}
      onClick={() => {
        void trackConversion(eventName, { href });
      }}
    >
      {children}
    </Link>
  );
}
