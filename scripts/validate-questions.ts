import fs from "fs";
import path from "path";
import { ParsedQuestion } from "./parse-questions";

export function validateQuestions(questions: ParsedQuestion[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (questions.length !== 100) {
    errors.push(`Expected exactly 100 questions, but found ${questions.length}.`);
  }

  const seenIds = new Set<string>();
  const seenTexts = new Set<string>();
  const distribution = { A: 0, B: 0, C: 0, D: 0 };
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };

  questions.forEach((q, index) => {
    const qNum = index + 1;
    const expectedId = `Q${String(qNum).padStart(3, "0")}`;

    if (q.id !== expectedId) {
      errors.push(`Question at index ${index} has id '${q.id}', expected '${expectedId}'.`);
    }

    if (seenIds.has(q.id)) {
      errors.push(`Duplicate question id: ${q.id}`);
    }
    seenIds.add(q.id);

    const normText = q.text.toLowerCase().trim();
    if (seenTexts.has(normText)) {
      errors.push(`Duplicate question text detected for ${q.id}: "${q.text}"`);
    }
    seenTexts.add(normText);

    // Validate options: exactly 4 distinct options
    const opts = [q.options.A, q.options.B, q.options.C, q.options.D];
    opts.forEach((opt, i) => {
      const label = ["A", "B", "C", "D"][i];
      if (!opt || opt.trim().length === 0) {
        errors.push(`${q.id}: Option ${label} is empty.`);
      }
    });

    const uniqueOpts = new Set(opts.map((o) => o?.trim().toLowerCase()));
    if (uniqueOpts.size !== 4) {
      errors.push(`${q.id}: Options are not all distinct.`);
    }

    // Validate correctOption
    if (!["A", "B", "C", "D"].includes(q.correctOption)) {
      errors.push(`${q.id}: Invalid correct option '${q.correctOption}'.`);
    } else {
      distribution[q.correctOption]++;
    }

    // Validate difficulty
    if (!["Easy", "Medium", "Hard"].includes(q.difficulty)) {
      errors.push(`${q.id}: Invalid difficulty '${q.difficulty}'.`);
    } else {
      difficultyCounts[q.difficulty]++;
    }
  });

  // Verify answer distribution (25 of each)
  if (distribution.A !== 25 || distribution.B !== 25 || distribution.C !== 25 || distribution.D !== 25) {
    errors.push(`Answer distribution mismatch (expected 25 each): ${JSON.stringify(distribution)}`);
  }

  // Verify difficulty counts (30 Easy, 40 Medium, 30 Hard)
  if (difficultyCounts.Easy !== 30 || difficultyCounts.Medium !== 40 || difficultyCounts.Hard !== 30) {
    errors.push(`Difficulty distribution mismatch (expected 30 Easy, 40 Medium, 30 Hard): ${JSON.stringify(difficultyCounts)}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function main() {
  const jsonPath = path.resolve(process.cwd(), "data/questions/questions.json");
  console.log(`Validating questions file: ${jsonPath}`);

  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: File ${jsonPath} does not exist. Run 'npm run questions:parse' first.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, "utf-8");
  const questions: ParsedQuestion[] = JSON.parse(raw);

  const result = validateQuestions(questions);
  if (!result.valid) {
    console.error(`Validation FAILED with ${result.errors.length} errors:`);
    result.errors.forEach((err) => console.error(` - ${err}`));
    process.exit(1);
  }

  console.log(`Validation PASSED! 100 valid questions loaded successfully.`);
}

if (require.main === module || !module.parent) {
  main();
}
