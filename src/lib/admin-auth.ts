import "server-only";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode((process.env.ADMIN_JWT_SECRET || "dev-secret-key-for-testing-only").trim());

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as { admin: boolean; iat: number };
  } catch {
    return null;
  }
}
