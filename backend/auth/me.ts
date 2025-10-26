import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export interface AdminInfo {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export const me = api<void, AdminInfo>(
  { auth: true, expose: true, method: "GET", path: "/auth/me" },
  async () => {
    const auth = getAuthData()!;
    return {
      id: auth.adminID,
      email: auth.email,
      firstName: auth.firstName,
      lastName: auth.lastName,
      role: auth.role,
    };
  }
);
