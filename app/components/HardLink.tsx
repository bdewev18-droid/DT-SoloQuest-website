import type { AnchorHTMLAttributes, ReactNode } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function HardLink({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  let resolvedHref = href;
  if (
    resolvedHref &&
    basePath &&
    resolvedHref.startsWith("/") &&
    !resolvedHref.startsWith(basePath)
  ) {
    resolvedHref = `${basePath}${resolvedHref}`;
  }
  return (
    <a href={resolvedHref} {...props}>
      {children}
    </a>
  );
}
