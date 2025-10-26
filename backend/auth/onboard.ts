import { api } from "encore.dev/api";
import { db } from "../db";
import { APIError } from "encore.dev/api";
import { randomBytes, pbkdf2 } from "crypto";
import { promisify } from "util";

const pbkdf2Async = promisify(pbkdf2);

export interface VerifyInviteRequest {
  token: string;
}

export interface VerifyInviteResponse {
  email: string;
  valid: boolean;
}

export const verifyInvite = api<VerifyInviteRequest, VerifyInviteResponse>(
  { expose: true, method: "POST", path: "/auth/onboard/verify" },
  async (req) => {
    const invite = await db.queryRow<{
      email: string;
      accepted_at: Date | null;
      expires_at: Date;
    }>`
      SELECT email, accepted_at, expires_at
      FROM admin_invites
      WHERE token = ${req.token}
    `;

    if (!invite) {
      throw APIError.notFound("invite not found");
    }

    if (invite.accepted_at) {
      throw APIError.invalidArgument("invite already accepted");
    }

    if (invite.expires_at < new Date()) {
      throw APIError.invalidArgument("invite expired");
    }

    const existingAdmin = await db.queryRow<{ id: bigint }>`
      SELECT id FROM admins WHERE email = ${invite.email}
    `;

    if (existingAdmin) {
      throw APIError.alreadyExists("account already exists");
    }

    return {
      email: invite.email,
      valid: true,
    };
  }
);

export interface CompleteOnboardingRequest {
  token: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CompleteOnboardingResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const completeOnboarding = api<CompleteOnboardingRequest, CompleteOnboardingResponse>(
  { expose: true, method: "POST", path: "/auth/onboard/complete" },
  async (req) => {
    const invite = await db.queryRow<{
      email: string;
      accepted_at: Date | null;
      expires_at: Date;
    }>`
      SELECT email, accepted_at, expires_at
      FROM admin_invites
      WHERE token = ${req.token}
    `;

    if (!invite) {
      throw APIError.notFound("invite not found");
    }

    if (invite.accepted_at) {
      throw APIError.invalidArgument("invite already accepted");
    }

    if (invite.expires_at < new Date()) {
      throw APIError.invalidArgument("invite expired");
    }

    const passwordHash = await hashPassword(req.password);

    const admin = await db.queryRow<{
      id: bigint;
      email: string;
      first_name: string;
      last_name: string;
      role: string;
    }>`
      INSERT INTO admins (email, password_hash, first_name, last_name, role)
      VALUES (${invite.email}, ${passwordHash}, ${req.firstName}, ${req.lastName}, 'admin')
      RETURNING id, email, first_name, last_name, role
    `;

    if (!admin) {
      throw APIError.internal("failed to create admin");
    }

    await db.exec`
      UPDATE admin_invites
      SET accepted_at = NOW()
      WHERE token = ${req.token}
    `;

    const sessionToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.exec`
      INSERT INTO admin_sessions (admin_id, token, expires_at)
      VALUES (${admin.id}, ${sessionToken}, ${expiresAt})
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

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(32).toString("hex");
  const hash = await pbkdf2Async(password, salt, 100000, 64, "sha512");
  return `${salt}:${hash.toString("hex")}`;
}
