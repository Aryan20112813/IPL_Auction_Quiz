import crypto from "crypto";
import { CONFIG } from "@/lib/config";

/**
 * Generate a 6-character room code using cryptographically secure random integers
 */
export function generateRoomCode(length: number = CONFIG.ROOM_CODE_LENGTH): string {
  const chars = CONFIG.ROOM_CODE_ALPHABET;
  let result = "";
  for (let i = 0; i < length; i++) {
    const idx = crypto.randomInt(0, chars.length);
    result += chars[idx];
  }
  return result;
}
