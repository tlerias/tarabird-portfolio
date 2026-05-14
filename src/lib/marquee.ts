export function interleaveSeparator(items: string[], sep: string): string[] {
  const out: string[] = [];
  for (const item of items) {
    out.push(item, sep);
  }
  return out;
}

export function doubleForLoop<T>(items: T[]): T[] {
  return [...items, ...items];
}
