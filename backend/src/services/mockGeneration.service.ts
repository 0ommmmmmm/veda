import { randomUUID } from 'crypto';
import type { IAssignment } from '../models/Assignment';
import type {
  Difficulty,
  GeneratedSection,
  QuestionPaper,
  QuestionTypeEnum,
} from '../types/assignment.types';

const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenging'];

type TopicKey =
  | 'electricity'
  | 'photosynthesis'
  | 'python'
  | 'networking'
  | 'database'
  | 'general';

type TopicQuestionBank = Record<QuestionTypeEnum, string[]>;

const TOPIC_KEYWORDS: Record<TopicKey, string[]> = {
  electricity: ['electricity', 'current', 'voltage', 'resistance', 'ohm', 'circuit'],
  photosynthesis: ['photosynthesis', 'chlorophyll', 'sunlight', 'plants'],
  python: ['python', 'programming', 'loops', 'functions', 'lists'],
  networking: ['networking', 'ip', 'dns', 'router', 'tcp'],
  database: ['database', 'sql', 'mongodb', 'query'],
  general: [],
};

const TOPIC_QUESTION_BANKS: Record<TopicKey, TopicQuestionBank> = {
  electricity: {
    MCQ: [
      'Which quantity is measured in amperes?',
      'Ohm\'s law relates voltage, current, and which third quantity?',
      'A parallel circuit is best described by which statement?',
      'Which component primarily limits current in a circuit?',
      'What happens to current if resistance increases at fixed voltage?',
    ],
    'Short Answer': [
      'Explain the relationship between voltage, current, and resistance using Ohm\'s law.',
      'Differentiate between series and parallel circuits with one practical example.',
      'Why is a fuse important in household electrical circuits?',
      'How does resistance affect current flow in a conductor?',
      'Describe the role of a battery in a simple electric circuit.',
    ],
    Essay: [
      'Discuss how electrical safety practices prevent accidents at home and school.',
      'Analyze the advantages and disadvantages of series and parallel wiring in buildings.',
      'Explain how electrical energy is generated, transmitted, and distributed to consumers.',
      'Evaluate the impact of energy-efficient electrical devices on power consumption.',
      'Discuss the importance of grounding and insulation in electrical systems.',
    ],
    'Fill in the Blank': [
      'The SI unit of resistance is _____.',
      'The flow of electric charge is called _____.',
      'In a parallel circuit, voltage across branches is generally _____.',
      'A device used to break a circuit automatically during overload is a _____.',
      'The symbol V usually denotes _____.',
    ],
    Matching: [
      'Match electrical quantities with their SI units.',
      'Match circuit components with their primary functions.',
      'Match circuit symbols with the corresponding components.',
      'Match safety devices with where they are commonly used.',
      'Match electrical laws with their mathematical expressions.',
    ],
    'True/False': [
      'Current is the rate of flow of electric charge.',
      'In a series circuit, current is the same through all components.',
      'Ohm\'s law is expressed as V = IR.',
      'Resistance has no effect on current in a fixed-voltage circuit.',
      'A short circuit can cause excessive current flow.',
    ],
  },
  photosynthesis: {
    MCQ: [
      'Which pigment is most directly responsible for capturing sunlight in plants?',
      'Where does photosynthesis primarily occur in plant cells?',
      'Which gas is absorbed by plants during photosynthesis?',
      'Which of the following is a product of photosynthesis?',
      'Light-dependent reactions occur in which part of the chloroplast?',
    ],
    'Short Answer': [
      'Write the word equation for photosynthesis.',
      'Why is chlorophyll essential for photosynthesis?',
      'How does sunlight intensity influence the rate of photosynthesis?',
      'Explain the role of stomata in photosynthesis.',
      'Differentiate between light-dependent and light-independent reactions.',
    ],
    Essay: [
      'Discuss the importance of photosynthesis for life on Earth.',
      'Analyze environmental factors that affect photosynthesis in plants.',
      'Explain how photosynthesis and respiration are interconnected in ecosystems.',
      'Evaluate how deforestation can impact the global carbon cycle through photosynthesis.',
      'Discuss adaptations in plants that improve photosynthetic efficiency.',
    ],
    'Fill in the Blank': [
      'Photosynthesis converts light energy into _____ energy.',
      'The green pigment in plants is called _____.',
      'Plants absorb _____ from the atmosphere for photosynthesis.',
      'The main sugar produced during photosynthesis is _____.',
      'Tiny leaf pores used for gas exchange are called _____.',
    ],
    Matching: [
      'Match photosynthesis terms with their definitions.',
      'Match chloroplast structures with their functions.',
      'Match photosynthesis reactants with products.',
      'Match environmental factors with their effects on photosynthesis rate.',
      'Match plant tissues with their role in photosynthesis.',
    ],
    'True/False': [
      'Photosynthesis occurs only in roots of plants.',
      'Oxygen is released as a by-product of photosynthesis.',
      'Chlorophyll absorbs light energy.',
      'Carbon dioxide is a raw material for photosynthesis.',
      'Photosynthesis contributes to the food chain base.',
    ],
  },
  python: {
    MCQ: [
      'Which keyword is used to define a function in Python?',
      'Which data type stores ordered, mutable collections in Python?',
      'What does the range(5) function generate?',
      'Which statement correctly starts a for-loop in Python?',
      'Which method adds one element to the end of a list?',
    ],
    'Short Answer': [
      'Explain the difference between a list and a tuple in Python.',
      'What is the purpose of indentation in Python code?',
      'How do you define and call a function in Python?',
      'What is the role of a loop in programming?',
      'Write a short explanation of list slicing in Python.',
    ],
    Essay: [
      'Discuss why Python is widely used for beginner programming education.',
      'Analyze the advantages of using functions for reusable code.',
      'Explain with examples how loops improve problem-solving in Python.',
      'Evaluate best practices for writing readable and maintainable Python code.',
      'Discuss common mistakes beginners make in Python and how to avoid them.',
    ],
    'Fill in the Blank': [
      'A Python function is defined using the keyword _____.',
      'A loop that iterates over a sequence is usually written with _____.',
      'The built-in type for key-value pairs is _____.',
      'The index of the first element in a Python list is _____.',
      'To print output in Python, we use the _____ function.',
    ],
    Matching: [
      'Match Python data structures with their characteristics.',
      'Match loop types with their common use-cases.',
      'Match function concepts with definitions.',
      'Match built-in list methods with behavior.',
      'Match Python errors with likely causes.',
    ],
    'True/False': [
      'Python uses indentation to define code blocks.',
      'A list in Python is immutable.',
      'Functions can return values in Python.',
      'The while loop repeats while its condition is true.',
      'Python is a statically typed language only.',
    ],
  },
  networking: {
    MCQ: [
      'Which protocol translates domain names into IP addresses?',
      'What is the main purpose of a router in a network?',
      'Which layer of TCP/IP includes HTTP and DNS?',
      'Which protocol ensures reliable, connection-oriented transport?',
      'An IPv4 address contains how many bits?',
    ],
    'Short Answer': [
      'Differentiate between TCP and UDP.',
      'What is the role of DNS in internet communication?',
      'Explain the difference between a switch and a router.',
      'Why is an IP address necessary in networking?',
      'What is a subnet and why is it used?',
    ],
    Essay: [
      'Discuss how data travels from a client device to a web server and back.',
      'Analyze the importance of DNS and IP addressing in internet scalability.',
      'Explain network security basics at home and enterprise levels.',
      'Evaluate pros and cons of wired versus wireless networking.',
      'Discuss how routers and routing protocols support large networks.',
    ],
    'Fill in the Blank': [
      'The protocol used for translating names to IP addresses is _____.',
      'TCP stands for Transmission Control _____.',
      'A device that forwards packets between networks is a _____.',
      'An IPv4 address is written as four _____ numbers.',
      'The process of dividing a network into smaller networks is called _____.',
    ],
    Matching: [
      'Match network devices with their primary functions.',
      'Match protocols with their common ports or use-cases.',
      'Match networking terms with definitions.',
      'Match OSI layers with example protocols.',
      'Match address types with examples.',
    ],
    'True/False': [
      'DNS converts domain names to IP addresses.',
      'TCP provides guaranteed delivery and ordering.',
      'A router operates only within one LAN segment like a switch.',
      'IP addresses uniquely identify devices on a network.',
      'UDP is always slower than TCP.',
    ],
  },
  database: {
    MCQ: [
      'Which SQL clause is used to filter rows in a query?',
      'What does CRUD stand for in database operations?',
      'Which command is used to retrieve data in SQL?',
      'In MongoDB, what is the equivalent of a table?',
      'Which SQL keyword combines rows from related tables?',
    ],
    'Short Answer': [
      'Differentiate between SQL and NoSQL databases.',
      'What is an index and why is it used in databases?',
      'Explain the purpose of a primary key.',
      'How does a WHERE clause work in SQL?',
      'What is a MongoDB query filter?',
    ],
    Essay: [
      'Discuss how database design affects query performance and scalability.',
      'Analyze differences between relational and document databases with examples.',
      'Explain the role of normalization in relational databases.',
      'Evaluate trade-offs between consistency and availability in distributed databases.',
      'Discuss best practices for writing efficient SQL queries.',
    ],
    'Fill in the Blank': [
      'The SQL command used to fetch records is _____.',
      'A unique identifier for each row is called a _____.',
      'MongoDB stores data in _____ rather than rows.',
      'The SQL clause used to sort results is _____.',
      'A database operation that modifies existing data is called _____.',
    ],
    Matching: [
      'Match SQL keywords with their functions.',
      'Match database concepts with definitions.',
      'Match MongoDB terms with relational equivalents.',
      'Match query operations with outcomes.',
      'Match constraints with their purposes.',
    ],
    'True/False': [
      'SQL databases generally use fixed schemas.',
      'MongoDB stores data as BSON documents.',
      'A primary key can have duplicate values.',
      'Indexes can speed up read queries.',
      'JOIN is used to combine data from multiple tables.',
    ],
  },
  general: {
    MCQ: [],
    'Short Answer': [],
    Essay: [],
    'Fill in the Blank': [],
    Matching: [],
    'True/False': [],
  },
};

function detectTopic(assignment: IAssignment): TopicKey {
  const text = `${assignment.title} ${assignment.instructions}`.toLowerCase();
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS) as [
    TopicKey,
    string[],
  ][]) {
    if (topic === 'general') continue;
    if (keywords.some((k) => text.includes(k))) {
      return topic;
    }
  }
  return 'general';
}

function titleKeywordQuestions(assignment: IAssignment, type: QuestionTypeEnum): string[] {
  const words = assignment.title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 6);
  const focus = words.length > 0 ? words.join(', ') : assignment.title;
  return [
    `Create a ${type} question focused on: ${focus}.`,
    `Design a ${type} question for "${assignment.title}" using key ideas: ${focus}.`,
    `Write a curriculum-aligned ${type} item connected to: ${focus}.`,
    `Generate an application-based ${type} prompt from: ${focus}.`,
    `Draft a conceptual ${type} question covering: ${focus}.`,
  ];
}

function sectionLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

export function generateMockQuestionPaper(assignment: IAssignment): QuestionPaper {
  const topic = detectTopic(assignment);
  const topicBank = TOPIC_QUESTION_BANKS[topic];
  const sections: GeneratedSection[] = assignment.questionTypes
    .filter((qt) => qt.count > 0)
    .map((questionType, sectionIndex) => {
      const pool =
        topicBank[questionType.type].length > 0
          ? topicBank[questionType.type]
          : titleKeywordQuestions(assignment, questionType.type);
      const questions = Array.from({ length: questionType.count }, (_, i) => {
        const text =
          pool.length > 0
            ? pool[i % pool.length]!
            : `${assignment.title}: ${questionType.type} question ${i + 1}`;
        const difficulty = DIFFICULTIES[i % DIFFICULTIES.length]!;
        const question: GeneratedSection['questions'][number] = {
          id: randomUUID(),
          number: i + 1,
          text,
          marks: questionType.marksPerQuestion,
          difficulty,
        };

        if (questionType.type === 'MCQ') {
          question.options = [
            `A. ${assignment.title} concept ${i + 1} option A`,
            `B. ${assignment.title} concept ${i + 1} option B`,
            `C. ${assignment.title} concept ${i + 1} option C`,
            `D. ${assignment.title} concept ${i + 1} option D`,
          ];
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
