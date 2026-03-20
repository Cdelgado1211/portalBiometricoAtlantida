export function getQueryParam(name: string, search: string): string | null {
  const params = new URLSearchParams(search);
  const value = params.get(name);
  return value && value.trim().length > 0 ? value : null;
}

