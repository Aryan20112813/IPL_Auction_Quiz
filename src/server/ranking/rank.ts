export interface RankableParticipant {
  participantId: string;
  score: number;
  timeTakenMs: bigint | number;
  joinedAt?: Date | string;
}

export interface RankedParticipant extends RankableParticipant {
  rank: number;
}

/**
 * Assigns standard competition ranking (1224) based on:
 * 1. Score DESC
 * 2. timeTakenMs ASC
 * Ties share the same rank.
 */
export function assignRanks<T extends RankableParticipant>(items: T[]): (T & { rank: number })[] {
  // Sort descending by score, ascending by timeTakenMs, then stable joinedAt/id
  const sorted = [...items].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const timeA = BigInt(a.timeTakenMs);
    const timeB = BigInt(b.timeTakenMs);
    if (timeA < timeB) return -1;
    if (timeA > timeB) return 1;

    // Stable tie-breaker for deterministic list display
    const joinA = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
    const joinB = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
    if (joinA !== joinB) return joinA - joinB;

    return a.participantId.localeCompare(b.participantId);
  });

  let currentRank = 1;
  const result: (T & { rank: number })[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      const sameScore = prev.score === curr.score;
      const sameTime = BigInt(prev.timeTakenMs) === BigInt(curr.timeTakenMs);

      if (!sameScore || !sameTime) {
        currentRank = i + 1;
      }
    }
    result.push({
      ...sorted[i],
      rank: currentRank,
    });
  }

  return result;
}
