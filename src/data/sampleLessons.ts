import { Lesson, Quiz } from '../lib/indexedDB';

export const sampleLessons: Lesson[] = [
  {
    id: '1',
    title: 'Basic Mathematics - Addition',
    description: 'Learn the fundamentals of addition with interactive examples',
    type: 'video',
    content: 'https://example.com/math-addition.mp4', // Placeholder - would be actual video
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
    content: 'https://example.com/alphabet-sounds.mp3',
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
    content: 'https://example.com/hindi-varnamala.mp3',
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
    content: 'https://example.com/computer-basics.mp4',
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
        question: 'What is 5 + 3?',
        options: ['6', '7', '8', '9'],
        correctAnswer: 2,
        explanation: '5 + 3 = 8. When we add 5 and 3 together, we get 8.'
      },
      {
        id: 'q2', 
        question: 'What is 10 - 4?',
        options: ['5', '6', '7', '8'],
        correctAnswer: 1,
        explanation: '10 - 4 = 6. When we subtract 4 from 10, we get 6.'
      },
      {
        id: 'q3',
        question: 'What is 2 × 3?',
        options: ['4', '5', '6', '7'],
        correctAnswer: 2,
        explanation: '2 × 3 = 6. When we multiply 2 by 3, we get 6.'
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