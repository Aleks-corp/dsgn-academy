import { Types } from "mongoose";

export type Cursor = { createdAt: string; id: string };

export function encodeCursor(d: Date, id: string): string {
  return Buffer.from(`${d.toISOString()}|${id}`).toString("base64url");
}

export function decodeCursor(cursor?: string): Cursor | null {
  if (!cursor) return null;
  try {
    const raw: string = Buffer.from(cursor, "base64url").toString("utf8");
    const [createdAt, id] = raw.split("|");
    if (!createdAt || !id) return null;
    return { createdAt, id };
  } catch {
    return null;
  }
}

function b64urlEncode(s: string): string {
  return Buffer.from(s, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
function b64urlDecode(s: string): string {
  const pad = "===".slice((s.length + 3) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf8");
}

// cursor = base64url(JSON.stringify({ t: ISOString, id: string, d: "next"|"prev" }))
export function encodeCur(
  doc: { publishedAt: Date; _id: Types.ObjectId },
  dir: "next" | "prev"
): string {
  return b64urlEncode(
    JSON.stringify({
      t: doc.publishedAt.toISOString(),
      id: String(doc._id),
      d: dir,
    })
  );
}

export function decodeCur(cursor: string): {
  t: Date;
  id: Types.ObjectId;
  d: "next" | "prev";
} {
  const raw = JSON.parse(b64urlDecode(cursor)) as {
    t: string;
    id: string;
    d: "next" | "prev";
  };
  return {
    t: new Date(raw.t),
    id: new Types.ObjectId(raw.id),
    d: raw.d === "prev" ? "prev" : "next",
  };
}
