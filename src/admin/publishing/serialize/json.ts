export function prettyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function parseJson<T>(content: string): T {
  return JSON.parse(content) as T;
}
