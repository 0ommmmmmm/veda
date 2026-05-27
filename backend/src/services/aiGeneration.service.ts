import type { IAssignment } from '../models/Assignment';
import type { QuestionPaper } from '../types/assignment.types';
import { parseAndValidateQuestionPaper } from '../validators/questionPaper.schema';
import { generateJsonCompletion } from './groq.provider';
import { randomUUID } from 'crypto';
import { generateMockQuestionPaper } from './mockGeneration.service';

const SYSTEM_PROMPT = `You are an expert teacher creating exam question papers.
Return ONLY valid JSON (no markdown) matching this structure:
{
  "assignmentId": "string",
  "title": "string",
  "instructions": "string",
  "totalQuestions": number,
  "totalMarks": number,
  "generatedAt": "ISO date string",
  "sections": [
    {
      "sectionLabel": "A",
      "questionType": { "id": "string", "type": "MCQ|Short Answer|Essay|Fill in the Blank|Matching|True/False", "count": number, "marksPerQuestion": number },
      "questions": [
        {
          "id": "unique string",
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
- For MCQ, include exactly 4 options as an ARRAY OF STRINGS only. Never return option objects like {"text": "...", "isCorrect": true}.
- Options must be exactly: ["A. ...", "B. ...", "C. ...", "D. ..."] (strings only).
- Questions must be relevant to the assignment title and instructions.
- Use varied difficulty (Easy, Moderate, Challenging).
- Questions must be unique and avoid generic repetition unless asked by topic.
- Return JSON only with no explanation or markdown fences.`;

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

type Difficulty = 'Easy' | 'Moderate' | 'Challenging';
const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenging'];

function coerceOptionToString(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>;
    const text =
      typeof v.text === 'string'
        ? v.text
        : typeof v.label === 'string'
          ? v.label
          : typeof v.value === 'string'
            ? v.value
            : null;
    return text;
  }
  if (value === null || value === undefined) return null;
  return String(value);
}

function normalizeGroqOutput(raw: unknown, assignment: IAssignment): unknown {
  const expectedTypes = assignment.questionTypes.filter((qt) => qt.count > 0);
  const mock = generateMockQuestionPaper(assignment);

  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const rawSections = Array.isArray(obj.sections) ? (obj.sections as unknown[]) : [];

  const sections = expectedTypes.map((qt, sectionIndex) => {
    const rawSection =
      rawSections[sectionIndex] && typeof rawSections[sectionIndex] === 'object'
        ? (rawSections[sectionIndex] as Record<string, unknown>)
        : {};

    const rawQuestions = Array.isArray(rawSection.questions)
      ? (rawSection.questions as unknown[])
      : [];

    const fallbackSection = mock.sections[sectionIndex];
    const fallbackQuestions = fallbackSection?.questions ?? [];

    const questions = Array.from({ length: qt.count }, (_, i) => {
      const rq =
        rawQuestions[i] && typeof rawQuestions[i] === 'object'
          ? (rawQuestions[i] as Record<string, unknown>)
          : {};
      const fq = fallbackQuestions[i];

      const text =
        typeof rq.text === 'string' && rq.text.trim().length > 0
          ? rq.text.trim()
          : fq?.text ?? `${assignment.title}: ${qt.type} question ${i + 1}`;

      const diff =
        rq.difficulty === 'Easy' || rq.difficulty === 'Moderate' || rq.difficulty === 'Challenging'
          ? (rq.difficulty as Difficulty)
          : DIFFICULTIES[i % DIFFICULTIES.length]!;

      const baseQuestion: Record<string, unknown> = {
        id: typeof rq.id === 'string' && rq.id.trim() ? rq.id : randomUUID(),
        number: i + 1,
        text,
        marks: qt.marksPerQuestion,
        difficulty: diff,
      };

      if (qt.type === 'MCQ') {
        const rawOpts = Array.isArray(rq.options) ? rq.options : [];
        const coerced = (rawOpts as unknown[])
          .map(coerceOptionToString)
          .filter((x): x is string => !!x)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        const fallbackOpts =
          fq && Array.isArray((fq as any).options) ? (((fq as any).options as unknown[]) as string[]) : [];

        const filled = [...coerced];
        while (filled.length < 4) {
          const next = fallbackOpts[filled.length] ?? `${String.fromCharCode(65 + filled.length)}. Option ${filled.length + 1}`;
          filled.push(next);
        }

        const sliced = filled.slice(0, 4);
        const prefixed = sliced.map((opt, idx) => {
          const prefix = `${String.fromCharCode(65 + idx)}.`;
          const trimmed = opt.trim();
          if (trimmed.startsWith(prefix)) return trimmed;
          // If already starts with "A)" or "A -" etc, normalize to "A."
          const stripped = trimmed.replace(/^[A-D][\)\.\-\:]\s*/i, '');
          return `${prefix} ${stripped}`.trim();
        });

        baseQuestion.options = prefixed;
      }

      // For non-MCQ, ensure we don't carry options
      return baseQuestion;
    });

    return {
      sectionLabel:
        (typeof rawSection.sectionLabel === 'string' && rawSection.sectionLabel.trim()) ||
        String.fromCharCode(65 + sectionIndex),
      questionType: {
        id: qt.id,
        type: qt.type,
        count: qt.count,
        marksPerQuestion: qt.marksPerQuestion,
      },
      questions,
    };
  });

  return {
    title: typeof obj.title === 'string' ? obj.title : assignment.title,
    instructions:
      typeof obj.instructions === 'string' ? obj.instructions : assignment.instructions || 'Attempt all questions.',
    totalQuestions: assignment.totalQuestions,
    totalMarks: assignment.totalMarks,
    sections,
  };
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
    throw new Error('Groq returned invalid JSON');
  }

  const normalized = normalizeGroqOutput(parsed, assignment);
  return parseAndValidateQuestionPaper(normalized, assignment);
}
