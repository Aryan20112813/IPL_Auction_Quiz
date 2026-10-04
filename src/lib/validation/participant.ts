import { z } from "zod";

export function normalizeDisplayName(name: string): string {
  if (!name) return "";
  return name
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// Allowed: Unicode letters, numbers, spaces, and punctuation: . - _ ' &
const NAME_CHARSET_REGEX = /^[\p{L}\p{N}\s.\-_'&]+$/u;

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(30, "Name must not exceed 30 characters")
  .regex(NAME_CHARSET_REGEX, "Name contains unsupported characters");

export const joinQuizSchema = z.object({
  displayName: displayNameSchema,
});

export const rejoinQuizSchema = z.object({
  displayName: z.string().trim().min(1, "Name is required"),
  recoveryCode: z
    .string()
    .trim()
    .length(6, "Recovery code must be exactly 6 characters")
    .toUpperCase(),
});
