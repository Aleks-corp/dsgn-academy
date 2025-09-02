export type Cursor = { createdAt: string; id: string };

export function encodeCursor(d: Date, id: string) {
  return Buffer.from(`${d.toISOString()}|${id}`).toString("base64url");
}

export function decodeCursor(cursor?: string): Cursor | null {
  if (!cursor) return null;
  try {
    const raw = Buffer.from(cursor, "base64url").toString("utf8");
    const [createdAt, id] = raw.split("|");
    if (!createdAt || !id) return null;
    return { createdAt, id };
  } catch {
    return null;
  }
}
