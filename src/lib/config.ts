export const CONFIG = {
  QUESTION_COUNT: parseInt(process.env.QUESTION_COUNT || "25", 10),
  QUIZ_DURATION_SECONDS: parseInt(process.env.QUIZ_DURATION_SECONDS || "7200", 10),
  MAX_PARTICIPANTS: parseInt(process.env.MAX_PARTICIPANTS || "500", 10),
  
  // Room code configuration (31 unambiguous symbols, no 0/O/1/I/L)
  ROOM_CODE_ALPHABET: "ABCDEFGHJKMNPQRSTUVWXYZ23456789",
  ROOM_CODE_LENGTH: 6,
  
  // Polling intervals in milliseconds
  POLL_LOBBY_MS: 8000,
  POLL_LOBBY_JITTER_MS: 2000,
  POLL_ACTIVE_MS: 30000,
  POLL_SUBMITTED_MS: 15000,
  POLL_CLOSED_MS: 3000,
  POLL_HOST_MS: 5000,
  HIDDEN_TAB_MULTIPLIER: 3,

  // Debounce for answer auto-save
  AUTOSAVE_DEBOUNCE_MS: 300,

  // App URL
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  TOKEN_PEPPER: process.env.TOKEN_PEPPER || "ipl-quiz-token-salt-pepper-2025",
} as const;
