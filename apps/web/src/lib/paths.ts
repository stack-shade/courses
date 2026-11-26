export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/courses';

export function withBasePath(p: string): string {
  const clean = p.startsWith('/') ? p : `/${p}`;
  if (!BASE_PATH) return clean;
  if (clean.startsWith(`${BASE_PATH}/`) || clean === BASE_PATH) return clean;
  return `${BASE_PATH}${clean}`;
}
