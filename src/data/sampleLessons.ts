import { Lesson, Quiz } from '../lib/indexedDB';

export const sampleLessons: Lesson[] = [
  {
    id: '1',
    title: 'Basic Mathematics - Addition',
    description: 'Learn the fundamentals of addition with interactive examples',
    type: 'video',
  content: '/Basic Mathematics additon.mp4',
    duration: 15,
    subject: 'Mathematics',
    level: 'beginner',
    language: 'English',
    thumbnail: '/placeholder-math.jpg'
  },
  {
    id: '2', 
    title: 'English Alphabet Sounds',
    description: 'Practice pronunciation of English alphabet letters',
    type: 'audio',
  content: '/(Audio) videoplayback.m4a',
    duration: 10,
    subject: 'English',
    level: 'beginner',
    language: 'English',
    thumbnail: '/placeholder-english.jpg'
  },
  {
    id: '3',
    title: 'Introduction to Science',
    description: 'Discover the world of science through simple experiments',
    type: 'video',
    content: 'https://example.com/intro-science.mp4',
    duration: 20,
    subject: 'Science',
    level: 'beginner',
    language: 'English',
    thumbnail: '/placeholder-science.jpg'
  },
  {
    id: '4',
    title: 'Mathematical Quiz - Basic Operations',
    description: 'Test your knowledge of basic mathematical operations',
    type: 'quiz',
    content: 'quiz-4',
    duration: 10,
    subject: 'Mathematics',
    level: 'beginner',
    language: 'English',
    thumbnail: '/placeholder-quiz.jpg'
  },
  {
    id: '5',
    title: 'Hindi Varnamala (हिंदी वर्णमाला)',
    description: 'Hindi alphabet learning with pronunciation guide',
    type: 'audio',
  content: '/Varnmala.m4a',
    duration: 12,
    subject: 'Hindi',
    level: 'beginner',
    language: 'Hindi',
    thumbnail: '/placeholder-hindi.jpg'
  },
  {
    id: '6',
    title: 'Digital Literacy - Using a Computer',
    description: 'Learn basic computer operations and digital skills',
    type: 'video',
  content: '/Digital Literacy.mp4',
    duration: 25,
    subject: 'Digital Literacy',
    level: 'beginner',
    language: 'English',
    thumbnail: '/placeholder-computer.jpg'
  }
];

export const sampleQuizzes: Quiz[] = [
  {
    id: 'quiz-4',
    lessonId: '4',
    questions: [
      {
        id: 'q1',
        question: 'What is 25 × 4?',
        options: ['50', '75', '100', '125'],
        correctAnswer: 2,
        explanation: '25 × 4 = 100.'
      },
      {
        id: 'q2',
        question: 'Solve: (15 ÷ 3) + 7 = ?',
        options: ['10', '12', '15', '18'],
        correctAnswer: 1,
        explanation: '(15 ÷ 3) + 7 = 5 + 7 = 12.'
      },
      {
        id: 'q3',
        question: 'The perimeter of a square is 36 cm. What is the length of one side?',
        options: ['6 cm', '8 cm', '9 cm', '12 cm'],
        correctAnswer: 2,
        explanation: 'Perimeter = 4 × side, so side = 36 ÷ 4 = 9 cm.'
      },
      {
        id: 'q4',
        question: 'What is the value of 3² + 4²?',
        options: ['12', '16', '25', '32'],
        correctAnswer: 2,
        explanation: '3² + 4² = 9 + 16 = 25.'
      },
      {
        id: 'q5',
        question: 'If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?',
        options: ['100 km', '120 km', '150 km', '180 km'],
        correctAnswer: 2,
        explanation: '60 × 2.5 = 150 km.'
      },
      {
        id: 'q6',
        question: 'Simplify: 2(3 + 5) – 4',
        options: ['10', '12', '14', '16'],
        correctAnswer: 0,
        explanation: '2 × 8 – 4 = 16 – 4 = 12.'
      },
      {
        id: 'q7',
        question: 'Which of the following is a prime number?',
        options: ['15', '21', '29', '35'],
        correctAnswer: 2,
        explanation: '29 is a prime number.'
      },
      {
        id: 'q8',
        question: 'The average of 6, 8, 10, 12 is:',
        options: ['8', '9', '10', '11'],
        correctAnswer: 1,
        explanation: '(6 + 8 + 10 + 12) ÷ 4 = 36 ÷ 4 = 9.'
      },
      {
        id: 'q9',
        question: 'Solve for x: 2x + 5 = 15',
        options: ['4', '5', '6', '7'],
        correctAnswer: 0,
        explanation: '2x = 10, so x = 5.'
      },
      {
        id: 'q10',
        question: 'What is the square root of 144?',
        options: ['10', '11', '12', '14'],
        correctAnswer: 2,
        explanation: '√144 = 12.'
      }
    ]
  }
];

export const subjects = [
  { id: 'Mathematics', name: 'Mathematics', icon: '🔢', color: 'lesson-text' },
  { id: 'English', name: 'English', icon: '📚', color: 'lesson-video' },
  { id: 'Science', name: 'Science', icon: '🔬', color: 'success' },
  { id: 'Hindi', name: 'हिंदी', icon: '🇮🇳', color: 'warning' },
  { id: 'Digital Literacy', name: 'Digital Literacy', icon: '💻', color: 'lesson-audio' }
];