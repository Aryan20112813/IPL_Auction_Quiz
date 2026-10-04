import { z } from "zod";
import { CONFIG } from "../config";

const ALLOWED_REGEX = new RegExp(`^[${CONFIG.ROOM_CODE_ALPHABET}]{6}$`);

export function normalizeRoomCode(input: string): string {
  if (!input) return "";
  // Strip spaces, hyphens, and uppercase
  return input.toUpperCase().replace(/[\s-]+/g, "").trim();
}

export const roomCodeSchema = z
  .string()
  .transform(normalizeRoomCode)
  .pipe(
    z
      .string()
      .length(6, "Room code must be exactly 6 characters")
      .regex(
        ALLOWED_REGEX,
        "Room code can only contain characters: " + CONFIG.ROOM_CODE_ALPHABET
      )
  );
