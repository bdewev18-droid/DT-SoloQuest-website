export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBase(path: string): string {
  if (!path) return path;
  if (!basePath) return path;
  if (path.startsWith("/") && !path.startsWith(basePath)) {
    return `${basePath}${path}`;
  }
  return path;
}
