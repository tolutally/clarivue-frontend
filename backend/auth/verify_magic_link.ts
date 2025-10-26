import { api } from "encore.dev/api";
import { db } from "../db";
import { APIError } from "encore.dev/api";
import { randomBytes } from "crypto";

export interface VerifyMagicLinkRequest {
  token: string;
}

export interface VerifyMagicLinkResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
}

export const verifyMagicLink = api<VerifyMagicLinkRequest, VerifyMagicLinkResponse>(
  { expose: true, method: "POST", path: "/auth/magic-link/verify" },
  async (req) => {
    const magicLink = await db.queryRow<{
      email: string;
      used_at: Date | null;
      expires_at: Date;
    }>`
      SELECT email, used_at, expires_at
      FROM magic_links
      WHERE token = ${req.token}
    `;

    if (!magicLink) {
      throw APIError.unauthenticated("invalid token");
    }

    if (magicLink.used_at) {
      throw APIError.unauthenticated("token already used");
    }

    if (magicLink.expires_at < new Date()) {
      throw APIError.unauthenticated("token expired");
    }

    await db.exec`
      UPDATE magic_links
      SET used_at = NOW()
      WHERE token = ${req.token}
    `;

    const admin = await db.queryRow<{
      id: bigint;
      email: string;
      first_name: string | null;
      last_name: string | null;
      role: string;
    }>`
      SELECT id, email, first_name, last_name, role
      FROM admins
      WHERE email = ${magicLink.email}
    `;

    if (!admin) {
      throw APIError.notFound("admin not found");
    }

    const sessionToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.exec`
      INSERT INTO admin_sessions (admin_id, token, expires_at)
      VALUES (${admin.id}, ${sessionToken}, ${expiresAt})
    `;

    await db.exec`
      UPDATE admins
      SET last_login_at = NOW()
      WHERE id = ${admin.id}
    `;

    return {
      token: sessionToken,
      admin: {
        id: admin.id.toString(),
        email: admin.email,
        firstName: admin.first_name,
        lastName: admin.last_name,
        role: admin.role,
      },
    };
  }
);
