import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.resolve(process.cwd(), "data/questions/questions.json");
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: ${jsonPath} does not exist. Run 'npm run questions:parse' first.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, "utf-8");
  const questions = JSON.parse(raw);

  console.log(`Seeding ${questions.length} questions into database...`);

  let seededCount = 0;
  for (const q of questions) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {
        text: q.text,
        optionA: q.options.A,
        optionB: q.options.B,
        optionC: q.options.C,
        optionD: q.options.D,
        correctOption: q.correctOption,
        difficulty: q.difficulty,
        isActive: true,
      },
      create: {
        id: q.id,
        text: q.text,
        optionA: q.options.A,
        optionB: q.options.B,
        optionC: q.options.C,
        optionD: q.options.D,
        correctOption: q.correctOption,
        difficulty: q.difficulty,
        isActive: true,
      },
    });
    seededCount++;
  }

  console.log(`Successfully seeded ${seededCount} questions.`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
