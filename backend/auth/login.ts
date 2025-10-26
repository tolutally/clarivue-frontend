import { api } from "encore.dev/api";
import { db } from "../db";
import { APIError } from "encore.dev/api";
import { randomBytes, pbkdf2 } from "crypto";
import { promisify } from "util";

const pbkdf2Async = promisify(pbkdf2);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
}

export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/auth/login" },
  async (req) => {
    const admin = await db.queryRow<{
      id: bigint;
      email: string;
      password_hash: string | null;
      first_name: string | null;
      last_name: string | null;
      role: string;
    }>`
      SELECT id, email, password_hash, first_name, last_name, role
      FROM admins
      WHERE email = ${req.email}
    `;

    if (!admin || !admin.password_hash) {
      throw APIError.unauthenticated("invalid credentials");
    }

    const isValid = await verifyPassword(req.password, admin.password_hash);
    if (!isValid) {
      throw APIError.unauthenticated("invalid credentials");
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.exec`
      INSERT INTO admin_sessions (admin_id, token, expires_at)
      VALUES (${admin.id}, ${token}, ${expiresAt})
    `;

    await db.exec`
      UPDATE admins
      SET last_login_at = NOW()
      WHERE id = ${admin.id}
    `;

    return {
      token,
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

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, storedHash] = hash.split(":");
  const derivedHash = await pbkdf2Async(password, salt, 100000, 64, "sha512");
  return storedHash === derivedHash.toString("hex");
}
