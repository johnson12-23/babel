import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const adminPassword = process.env.ADMIN_PASSWORD || "babel123";
const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "dev-secret-key-for-testing-only");

export async function POST(request: Request) {
  const payload = await request.json() as { password?: string };

  if (payload.password !== adminPassword) {
    return NextResponse.json({ message: "Invalid admin password" }, { status: 401 });
  }

  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 86400,
  });

  return NextResponse.json({ message: "Authenticated successfully" });
}
