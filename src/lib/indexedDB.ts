/**
 * IndexedDB utilities for offline data storage in Eguru
 * Stores lessons, user progress, and quiz results locally
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'text' | 'quiz';
  content: string; // URL for video/audio, text content, or quiz JSON
  duration: number; // in minutes
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  thumbnail?: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  progress: number; // 0-100
  timeSpent: number; // in minutes
  lastAccessed: string;
  quizScore?: number;
}

export interface User {
  id: string;
  name?: string;
  role?: 'student' | 'teacher';
  email?: string;
  language?: string;
  grade?: string;
  avatar?: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const DB_NAME = 'EguruDB';
const DB_VERSION = 1;
const STORES = {
  lessons: 'lessons',
  progress: 'progress',
  users: 'users',
  quizzes: 'quizzes'
};

class EguruDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = () => {
        const db = request.result;

        // Lessons store
        if (!db.objectStoreNames.contains(STORES.lessons)) {
          const lessonsStore = db.createObjectStore(STORES.lessons, { keyPath: 'id' });
          lessonsStore.createIndex('subject', 'subject');
          lessonsStore.createIndex('type', 'type');
          lessonsStore.createIndex('level', 'level');
        }

        // Progress store
        if (!db.objectStoreNames.contains(STORES.progress)) {
          const progressStore = db.createObjectStore(STORES.progress, { keyPath: 'id' });
          progressStore.createIndex('userId', 'userId');
          progressStore.createIndex('lessonId', 'lessonId');
          progressStore.createIndex('userId_lessonId', ['userId', 'lessonId'], { unique: true });
        }

        // Users store
        if (!db.objectStoreNames.contains(STORES.users)) {
          db.createObjectStore(STORES.users, { keyPath: 'id' });
        }

        // Quizzes store
        if (!db.objectStoreNames.contains(STORES.quizzes)) {
          const quizzesStore = db.createObjectStore(STORES.quizzes, { keyPath: 'id' });
          quizzesStore.createIndex('lessonId', 'lessonId');
        }
      };
    });
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized');
    const transaction = this.db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // Lesson operations
  async addLesson(lesson: Lesson): Promise<void> {
    const store = this.getStore(STORES.lessons, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(lesson);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllLessons(): Promise<Lesson[]> {
    const store = this.getStore(STORES.lessons);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getLessonsBySubject(subject: string): Promise<Lesson[]> {
    const store = this.getStore(STORES.lessons);
    const index = store.index('subject');
    return new Promise((resolve, reject) => {
      const request = index.getAll(subject);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Progress operations
  async updateProgress(progress: UserProgress): Promise<void> {
    const store = this.getStore(STORES.progress, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(progress);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProgressByUser(userId: string): Promise<UserProgress[]> {
    const store = this.getStore(STORES.progress);
    const index = store.index('userId');
    return new Promise((resolve, reject) => {
      const request = index.getAll(userId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getProgressByLesson(lessonId: string, userId: string): Promise<UserProgress | null> {
    const store = this.getStore(STORES.progress);
    const index = store.index('userId_lessonId');
    return new Promise((resolve, reject) => {
      const request = index.get([userId, lessonId]);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // User operations
  async saveUser(user: User): Promise<void> {
    const store = this.getStore(STORES.users, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.put(user);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUser(userId: string): Promise<User | null> {
    const store = this.getStore(STORES.users);
    return new Promise((resolve, reject) => {
      const request = store.get(userId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Quiz operations
  async addQuiz(quiz: Quiz): Promise<void> {
    const store = this.getStore(STORES.quizzes, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(quiz);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getQuizByLesson(lessonId: string): Promise<Quiz | null> {
    const store = this.getStore(STORES.quizzes);
    const index = store.index('lessonId');
    return new Promise((resolve, reject) => {
      const request = index.get(lessonId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }
}

export const database = new EguruDB();