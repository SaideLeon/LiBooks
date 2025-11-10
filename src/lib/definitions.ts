
// This file can be used to share types between server and client.

// Example from a previous migration step, will be replaced by Prisma generated types
// but is kept for reference during transition.
export interface Book_DEPRECATED {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  preface: string;
  chapters: Chapter_DEPRECATED[];
}

export interface Chapter_DEPRECATED {
  id: number;
  title: string;
  subtitle: string;
  content: string[];
}

export interface ReadingProgress {
  chapterId: number;
  paragraphIndex: number;
  timestamp: number;
}

export interface Bookmark {
  id: number;
  bookId: number;
  chapterId: number;
  paragraphIndex: number;
  text: string;
  timestamp: number;
}
