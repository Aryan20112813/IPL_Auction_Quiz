import fs from "fs";
import path from "path";

export interface ParsedQuestion {
  id: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: "A" | "B" | "C" | "D";
  difficulty: "Easy" | "Medium" | "Hard";
}

export function parseQuestionsMarkdown(content: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  
  // Split on "## Q" followed by number and dot
  const regex = /##\s*Q(\d+)\.\s*([^\n\r]+)([\s\S]*?)(?=(?:##\s*Q\d+\.|$))/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const qNum = parseInt(match[1], 10);
    const qText = match[2].trim();
    const body = match[3];

    // Options A, B, C, D
    const optAMatch = body.match(/\*\*A\.\*\*\s*([^\n\r]+)/);
    const optBMatch = body.match(/\*\*B\.\*\*\s*([^\n\r]+)/);
    const optCMatch = body.match(/\*\*C\.\*\*\s*([^\n\r]+)/);
    const optDMatch = body.match(/\*\*D\.\*\*\s*([^\n\r]+)/);

    // Answer and Difficulty
    const ansMatch = body.match(/\*\*Answer:\*\*\s*([A-D])/i);
    const diffMatch = body.match(/\*\*Difficulty:\*\*\s*(Easy|Medium|Hard)/i);

    if (!optAMatch || !optBMatch || !optCMatch || !optDMatch || !ansMatch || !diffMatch) {
      console.warn(`Warning: Could not parse question Q${qNum} completely.`);
      continue;
    }

    const id = `Q${String(qNum).padStart(3, "0")}`;
    const correctOption = ansMatch[1].toUpperCase() as "A" | "B" | "C" | "D";
    const difficulty = (diffMatch[1].charAt(0).toUpperCase() + diffMatch[1].slice(1).toLowerCase()) as "Easy" | "Medium" | "Hard";

    questions.push({
      id,
      text: qText,
      options: {
        A: optAMatch[1].trim(),
        B: optBMatch[1].trim(),
        C: optCMatch[1].trim(),
        D: optDMatch[1].trim(),
      },
      correctOption,
      difficulty,
    });
  }

  return questions;
}

function main() {
  const mdPath = path.resolve(process.cwd(), "data/questions/IPL_Quiz_Questions.md");
  const jsonPath = path.resolve(process.cwd(), "data/questions/questions.json");

  console.log(`Reading questions markdown from: ${mdPath}`);
  if (!fs.existsSync(mdPath)) {
    console.error(`Error: File not found at ${mdPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(mdPath, "utf-8");
  const parsed = parseQuestionsMarkdown(content);

  console.log(`Successfully parsed ${parsed.length} questions.`);
  fs.writeFileSync(jsonPath, JSON.stringify(parsed, null, 2), "utf-8");
  console.log(`Wrote JSON output to: ${jsonPath}`);
}

if (require.main === module || !module.parent) {
  main();
}
