import { Assignment, StudentInfo } from './types'

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Mathematics Final Exam',
    createdDate: new Date('2026-05-15'),
    dueDate: new Date('2026-06-15'),
    totalQuestions: 15,
    totalMarks: 100,
    status: 'published',
    questionTypes: [
      { id: 'q1', type: 'MCQ', count: 5, marksPerQuestion: 4 },
      { id: 'q2', type: 'Short Answer', count: 5, marksPerQuestion: 8 },
      { id: 'q3', type: 'Essay', count: 5, marksPerQuestion: 12 },
    ],
    instructions: 'Attempt all questions. Show your working for calculations.',
  },
  {
    id: '2',
    title: 'English Comprehension Test',
    createdDate: new Date('2026-05-16'),
    dueDate: new Date('2026-05-28'),
    totalQuestions: 20,
    totalMarks: 50,
    status: 'published',
    questionTypes: [
      { id: 'q1', type: 'MCQ', count: 10, marksPerQuestion: 2 },
      { id: 'q2', type: 'Short Answer', count: 10, marksPerQuestion: 3 },
    ],
    instructions: 'Read the passage carefully and answer all questions.',
  },
  {
    id: '3',
    title: 'History Project Submission',
    createdDate: new Date('2026-05-18'),
    dueDate: new Date('2026-06-20'),
    totalQuestions: 8,
    totalMarks: 80,
    status: 'draft',
    questionTypes: [
      { id: 'q1', type: 'Essay', count: 4, marksPerQuestion: 20 },
    ],
    instructions: 'Submit a well-researched project on the topic assigned.',
  },
]

export const mockStudentInfo: StudentInfo = {
  name: 'John Doe',
  rollNumber: 'A-2024-001',
  className: 'Grade 10 - Section A',
  date: new Date(),
  duration: '2 hours',
}

export const mockQuestions = {
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
    'The process by which water changes into vapor is called _____.',
  ],
  Matching: [
    'Match the following scientists with their discoveries:',
  ],
  'True/False': [
    'The Earth revolves around the Sun.',
    'Water boils at 100 degrees Celsius at sea level.',
    'Mammals lay eggs.',
  ],
}
