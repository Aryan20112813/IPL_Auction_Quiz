import { z } from "zod";

export const singleAnswerSchema = z.object({
  position: z.number().int().min(1).max(25),
  option: z.enum(["A", "B", "C", "D"]).nullable(),
});

export const saveAnswersSchema = z.object({
  answers: z
    .array(singleAnswerSchema)
    .min(1, "At least one answer must be provided")
    .max(25, "Maximum 25 answers can be submitted at once")
    .refine((items) => {
      const positions = items.map((i) => i.position);
      return new Set(positions).size === positions.length;
    }, "Duplicate positions are not allowed in the same submission"),
});

export const submitQuizSchema = z.object({
  answers: z
    .array(singleAnswerSchema)
    .max(25)
    .optional()
    .refine((items) => {
      if (!items) return true;
      const positions = items.map((i) => i.position);
      return new Set(positions).size === positions.length;
    }, "Duplicate positions are not allowed in the submission snapshot"),
});
