import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { db } from "../db";

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  adminID: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export const auth = authHandler<AuthParams, AuthData>(
  async (data) => {
    const token = data.authorization?.replace("Bearer ", "") ?? data.session;
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }

    const result = await db.queryRow<{
      id: bigint;
      email: string;
      first_name: string | null;
      last_name: string | null;
      role: string;
    }>`
      SELECT id, email, first_name, last_name, role
      FROM admins
      WHERE id = (
        SELECT admin_id FROM admin_sessions WHERE token = ${token} AND expires_at > NOW()
      )
    `;

    if (!result) {
      throw APIError.unauthenticated("invalid token");
    }

    return {
      userID: result.id.toString(),
      adminID: result.id.toString(),
      email: result.email,
      firstName: result.first_name,
      lastName: result.last_name,
      role: result.role,
    };
  }
);

export const gw = new Gateway({ authHandler: auth });
