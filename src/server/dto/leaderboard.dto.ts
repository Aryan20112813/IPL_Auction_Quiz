import { LeaderboardRowDto } from "@/lib/types";

export interface DbLeaderboardRow {
  rank: number | null;
  score: number;
  timeTakenMs: bigint | number;
  participantId: string;
  participant: {
    displayName: string;
  };
}

export function toLeaderboardRowDto(
  row: DbLeaderboardRow,
  currentParticipantId?: string
): LeaderboardRowDto {
  return {
    rank: row.rank,
    name: row.participant.displayName,
    score: row.score,
    timeTakenMs: Number(row.timeTakenMs),
    isYou: currentParticipantId ? row.participantId === currentParticipantId : undefined,
  };
}
