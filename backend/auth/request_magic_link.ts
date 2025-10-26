import { api } from "encore.dev/api";
import { db } from "../db";
import { randomBytes } from "crypto";

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkResponse {
  success: boolean;
}

export const requestMagicLink = api<MagicLinkRequest, MagicLinkResponse>(
  { expose: true, method: "POST", path: "/auth/magic-link" },
  async (req) => {
    const admin = await db.queryRow<{ id: bigint }>`
      SELECT id FROM admins WHERE email = ${req.email}
    `;

    if (!admin) {
      return { success: true };
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.exec`
      INSERT INTO magic_links (email, token, expires_at)
      VALUES (${req.email}, ${token}, ${expiresAt})
    `;

    return { success: true };
  }
);
