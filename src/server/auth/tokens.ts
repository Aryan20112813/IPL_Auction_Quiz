import crypto from "crypto";
import { CONFIG } from "@/lib/config";

/**
 * Generate a 32-byte cryptographically secure random token (base64url format, 43 chars)
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * Generate a 6-character recovery code from the unambiguous alphabet
 */
export function generateRecoveryCode(): string {
  const chars = CONFIG.ROOM_CODE_ALPHABET;
  let code = "";
  for (let i = 0; i < 6; i++) {
    const idx = crypto.randomInt(0, chars.length);
    code += chars[idx];
  }
  return code;
}

/**
 * Hash token using SHA-256 with server pepper
 */
export function hashToken(token: string): string {
  return crypto
    .createHmac("sha256", CONFIG.TOKEN_PEPPER)
    .update(token)
    .digest("hex");
}

/**
 * Timing-safe string comparison
 */
export function timingSafeMatch(knownHash: string, suppliedHash: string): boolean {
  const bufA = Buffer.from(knownHash, "utf-8");
  const bufB = Buffer.from(suppliedHash, "utf-8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}
