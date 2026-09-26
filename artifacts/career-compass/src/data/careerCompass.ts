export const DIRECTIONS = [
  {
    id: 'business',
    name: 'Business & Entrepreneurship',
    description: 'You may enjoy spotting opportunities, making plans, and turning ideas into something useful.',
  },
  {
    id: 'technology',
    name: 'Technology & Engineering',
    description: 'You may be energized by building, improving, and understanding how systems and tools work.',
  },
  {
    id: 'science',
    name: 'Science & Research',
    description: 'You may enjoy asking thoughtful questions, testing ideas, and discovering how the world works.',
  },
  {
    id: 'creative',
    name: 'Creative & Design',
    description: 'You may like shaping ideas into visual, expressive, or memorable experiences for other people.',
  },
  {
    id: 'people',
    name: 'People & Communication',
    description: 'You may get energy from listening, explaining, teaching, and helping people move forward together.',
  },
  {
    id: 'health',
    name: 'Health & Wellbeing',
    description: 'You may care about how people feel and enjoy learning ways to support healthier lives.',
  },
  {
    id: 'law',
    name: 'Law, Government & Society',
    description: 'You may be interested in fairness, public decisions, and how communities can work better.',
  },
  {
    id: 'environment',
    name: 'Environment & Sustainability',
    description: 'You may care about the natural world and enjoy finding practical ways to protect its future.',
  },
] as const;

export type DirectionId = (typeof DIRECTIONS)[number]['id'];

export type QuizAnswer = {
  text: string;
  directionId: DirectionId;
};

export type QuizQuestion = {
  question: string;
  answers: QuizAnswer[];
};

export const QUESTIONS: QuizQuestion[] = [
  {
    question: 'Which project sounds most interesting?',
    answers: [
      { text: 'Start a small business', directionId: 'business' },
      { text: 'Build an app', directionId: 'technology' },
      { text: 'Research how something works', directionId: 'science' },
      { text: 'Create a design or video', directionId: 'creative' },
    ],
  },
  {
    question: 'Which activity would you enjoy most?',
    answers: [
      { text: 'Help someone improve their health', directionId: 'health' },
      { text: 'Debate an important issue', directionId: 'law' },
      { text: 'Build or fix something', directionId: 'technology' },
      { text: 'Teach or talk with people', directionId: 'people' },
    ],
  },
  {
    question: 'What would you choose for a free afternoon?',
    answers: [
      { text: 'Run an experiment', directionId: 'science' },
      { text: 'Plan a business idea', directionId: 'business' },
      { text: 'Create something', directionId: 'creative' },
      { text: 'Learn about nature or climate', directionId: 'environment' },
    ],
  },
  {
    question: 'Which problem would you like to solve?',
    answers: [
      { text: 'Make technology better', directionId: 'technology' },
      { text: "Improve people's health", directionId: 'health' },
      { text: 'Help a business grow', directionId: 'business' },
      { text: 'Improve society or government', directionId: 'law' },
    ],
  },
  {
    question: 'Which activity sounds most interesting?',
    answers: [
      { text: 'Design a brand or website', directionId: 'creative' },
      { text: 'Study science or mathematics', directionId: 'science' },
      { text: 'Organize people for a project', directionId: 'people' },
      { text: 'Solve an environmental problem', directionId: 'environment' },
    ],
  },
  {
    question: 'Which future sounds most exciting?',
    answers: [
      { text: 'Discover something new', directionId: 'science' },
      { text: 'Build a company', directionId: 'business' },
      { text: 'Create products or media', directionId: 'creative' },
      { text: 'Teach or communicate with people', directionId: 'people' },
    ],
  },
  {
    question: 'Which skill would you like to learn?',
    answers: [
      { text: 'Programming or robotics', directionId: 'technology' },
      { text: 'Law or public policy', directionId: 'law' },
      { text: 'Health or psychology', directionId: 'health' },
      { text: 'Environmental technology', directionId: 'environment' },
    ],
  },
  {
    question: 'What kind of impact would you like to make?',
    answers: [
      { text: 'Create things people enjoy', directionId: 'creative' },
      { text: 'Discover new knowledge', directionId: 'science' },
      { text: 'Solve real-world problems with technology', directionId: 'technology' },
      { text: 'Help people or communities', directionId: 'people' },
    ],
  },
];

export type DirectionResult = (typeof DIRECTIONS)[number] & {
  points: number;
  opportunities: number;
  normalized: number;
};

export function calculateResults(answerIds: Array<DirectionId | null>): DirectionResult[] {
  return DIRECTIONS.map((direction) => {
    const opportunities = QUESTIONS.reduce(
      (total, question) =>
        total + (question.answers.some((answer) => answer.directionId === direction.id) ? 1 : 0),
      0,
    );
    const points = answerIds.filter((answerId) => answerId === direction.id).length;

    return {
      ...direction,
      points,
      opportunities,
      normalized: opportunities ? points / opportunities : 0,
    };
  }).sort((a, b) => b.normalized - a.normalized || b.points - a.points);
}