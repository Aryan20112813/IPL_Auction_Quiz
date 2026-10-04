import { QuestionDto } from "@/lib/types";

export interface DbQuestionRow {
  position: number;
  question: {
    id: string;
    text: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
  };
}

/**
 * Maps database questions to participant-facing DTO, strictly omitting correctOption
 */
export function toQuestionDto(row: DbQuestionRow): QuestionDto {
  return {
    position: row.position,
    text: row.question.text,
    options: {
      A: row.question.optionA,
      B: row.question.optionB,
      C: row.question.optionC,
      D: row.question.optionD,
    },
  };
}
