import type { IAssignment } from '../models/Assignment';
import type { QuestionPaper } from '../types/assignment.types';
import { parseAndValidateQuestionPaper } from '../validators/questionPaper.schema';
import { generateJsonCompletion } from './openai.provider';

const SYSTEM_PROMPT = `You are an expert teacher creating exam question papers.
Return ONLY valid JSON (no markdown) matching this structure:
{
  "title": "string",
  "instructions": "string",
  "totalQuestions": number,
  "totalMarks": number,
  "sections": [
    {
      "sectionLabel": "A",
      "questionType": { "id": "string", "type": "MCQ|Short Answer|Essay|Fill in the Blank|Matching|True/False", "count": number, "marksPerQuestion": number },
      "questions": [
        {
          "number": 1,
          "text": "question text",
          "marks": number,
          "difficulty": "Easy|Moderate|Challenging",
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."]
        }
      ]
    }
  ]
}
Rules:
- Create exactly the requested number of questions per section.
- Each question's marks must equal marksPerQuestion for that section.
- For MCQ, include exactly 4 options starting with A., B., C., D.
- Questions must be relevant to the assignment title and instructions.
- Use varied difficulty (Easy, Moderate, Challenging).
- Do not include answer keys.`;

function buildUserPrompt(assignment: IAssignment): string {
  const sections = assignment.questionTypes
    .filter((qt) => qt.count > 0)
    .map((qt, index) => ({
      sectionLabel: String.fromCharCode(65 + index),
      questionType: qt,
      requiredQuestions: qt.count,
    }));

  return JSON.stringify(
    {
      assignmentTitle: assignment.title,
      instructions: assignment.instructions || 'Attempt all questions.',
      totalQuestions: assignment.totalQuestions,
      totalMarks: assignment.totalMarks,
      sections,
    },
    null,
    2
  );
}

export async function generateAiQuestionPaper(
  assignment: IAssignment
): Promise<QuestionPaper> {
  const userPrompt = buildUserPrompt(assignment);
  const rawJson = await generateJsonCompletion(SYSTEM_PROMPT, userPrompt);
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error('OpenAI returned invalid JSON');
  }

  return parseAndValidateQuestionPaper(parsed, assignment);
}
