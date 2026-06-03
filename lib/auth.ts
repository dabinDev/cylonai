import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

let _jwtSecret: Uint8Array | null = null;
function getJwtSecret(): Uint8Array {
  if (!_jwtSecret) {
    const raw = process.env.JWT_SECRET;
    if (!raw) {
      throw new Error("JWT_SECRET environment variable is required");
    }
    _jwtSecret = new TextEncoder().encode(raw);
  }
  return _jwtSecret;
}

export interface JwtPayload extends JWTPayload {
  adminId: string;
  username: string;
}

export interface UserJwtPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function signToken(payload: Omit<JwtPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(getJwtSecret());
}

export async function signUserToken(payload: Omit<UserJwtPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export async function verifyUserToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.userId || !payload.email) return null;
    return payload as unknown as UserJwtPayload;
  } catch {
    return null;
  }
}

export async function getAuthFromCookies(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getUserAuthFromCookies(): Promise<UserJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_token")?.value;
  if (!token) return null;
  return verifyUserToken(token);
}
