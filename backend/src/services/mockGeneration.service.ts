import { randomUUID } from 'crypto';
import type { IAssignment } from '../models/Assignment';
import type {
  Difficulty,
  GeneratedSection,
  QuestionPaper,
  QuestionTypeEnum,
} from '../types/assignment.types';

const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenging'];

const MOCK_QUESTIONS: Record<QuestionTypeEnum, string[]> = {
  MCQ: [
    'What is the capital of France?',
    'Which planet is known as the Red Planet?',
    'Who wrote Romeo and Juliet?',
    'What is the chemical formula for salt?',
    'In which year did World War II end?',
  ],
  'Short Answer': [
    'Explain the concept of photosynthesis.',
    'What are the three states of matter?',
    'Define democracy in your own words.',
    'What is the significance of the French Revolution?',
    'Describe the water cycle.',
  ],
  Essay: [
    'Discuss the impact of technology on modern society.',
    'Analyze the major causes of climate change.',
    'Evaluate the role of education in nation-building.',
    'Critically examine the concept of globalization.',
    'Discuss the importance of environmental conservation.',
  ],
  'Fill in the Blank': [
    'The _____ is the largest planet in our solar system.',
    'Photosynthesis occurs in the _____ of the plant cell.',
    'The process of water turning into vapor is called _____.',
    'Newton\'s first law is also known as the law of _____.',
    'The chemical symbol for gold is _____.',
  ],
  Matching: [
    'Match the countries with their capitals.',
    'Match the scientists with their discoveries.',
    'Match the literary works with their authors.',
    'Match the elements with their symbols.',
    'Match the historical events with their dates.',
  ],
  'True/False': [
    'The Earth revolves around the Sun.',
    'Water boils at 100°C at sea level.',
    'Shakespeare was born in the 16th century.',
    'Diamonds are made of carbon.',
    'The Pacific Ocean is the largest ocean on Earth.',
  ],
};

function sectionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export function generateMockQuestionPaper(assignment: IAssignment): QuestionPaper {
  const sections: GeneratedSection[] = assignment.questionTypes
    .filter((qt) => qt.count > 0)
    .map((questionType, sectionIndex) => {
      const pool = MOCK_QUESTIONS[questionType.type] ?? [];
      const questions = Array.from({ length: questionType.count }, (_, i) => {
        const text =
          pool.length > 0
            ? pool[i % pool.length]!
            : `Question ${i + 1} for ${questionType.type}`;
        const difficulty = DIFFICULTIES[i % DIFFICULTIES.length]!;
        const question: GeneratedSection['questions'][number] = {
          id: randomUUID(),
          number: i + 1,
          text,
          marks: questionType.marksPerQuestion,
          difficulty,
        };

        if (questionType.type === 'MCQ') {
          question.options = ['A', 'B', 'C', 'D'].map(
            (opt) => `${opt}. Option ${opt} for question ${i + 1}`
          );
        }

        return question;
      });

      return {
        sectionLabel: sectionLabel(sectionIndex),
        questionType,
        questions,
      };
    });

  return {
    assignmentId: assignment._id.toString(),
    title: assignment.title,
    instructions: assignment.instructions,
    totalQuestions: assignment.totalQuestions,
    totalMarks: assignment.totalMarks,
    generatedAt: new Date().toISOString(),
    sections,
  };
}
