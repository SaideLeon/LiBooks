export interface Book {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  preface: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  content: string[];
}

export interface User {
  id: number;
  email?: string;
  password?: string; // Note: In a real app, never store plain text passwords.
  name: string;
  avatarUrl: string;
  bio?: string;
  publications?: Publication[];
  followers?: number;
  following?: number;
}

export interface Comment {
  id: number;
  user: User;
  timestamp: string;
  text: string;
  likes: number;
}

export interface FollowUser extends User {
    isFollowing: boolean;
}

export interface Activity {
  id: number;
  user: User;
  action: string;
  book?: Book;
  comment?: string;
  likes: number;
  comments: number;
}

export interface Publication {
    id: number;
    verse: string;
    title: string;
    content: string;
    quote: string;
    imageUrl?: string;
    likes: number;
    comments: number;
    shares: number;
}

export interface CommunityPost {
  id: number;
  user: User;
  timestamp: string;
  quote: string;
  comment: string;
  bookVerse: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isFollowing: boolean;
  imageUrl?: string;
}

export interface ReadingProgress {
  chapterId: number;
  paragraphIndex: number;
  timestamp: number;
}

const PROGRESS_STORAGE_KEY = 'litbook_reading_progress';

export const saveReadingProgress = (
  bookId: number,
  chapterId: number,
  paragraphIndex: number
): void => {
  try {
    const allProgress = getAllReadingProgress();
    allProgress[bookId] = { chapterId, paragraphIndex, timestamp: Date.now() };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Failed to save reading progress:', error);
  }
};

export const getReadingProgress = (bookId: number): ReadingProgress | null => {
  try {
    const allProgress = getAllReadingProgress();
    return allProgress[bookId] || null;
  } catch (error) {
    console.error('Failed to get reading progress:', error);
    return null;
  }
};

export const getAllReadingProgress = (): Record<number, ReadingProgress> => {
  try {
    const progressJson = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return progressJson ? JSON.parse(progressJson) : {};
  } catch (error) {
    console.error('Failed to get all reading progress:', error);
    return {};
  }
};

export interface Bookmark {
  bookId: number;
  chapterId: number;
  paragraphIndex: number;
  text: string;
  timestamp: number;
}

const BOOKMARKS_STORAGE_KEY = 'litbook_bookmarks';

export const getAllBookmarks = (): Bookmark[] => {
  try {
    const bookmarksJson = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return bookmarksJson ? JSON.parse(bookmarksJson) : [];
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
};

export const addBookmark = (bookmark: Omit<Bookmark, 'timestamp'>): void => {
  try {
    const bookmarks = getAllBookmarks();
    const newBookmark: Bookmark = { ...bookmark, timestamp: Date.now() };
    const updatedBookmarks = [newBookmark, ...bookmarks.filter(b => !(b.bookId === bookmark.bookId && b.chapterId === bookmark.chapterId && b.paragraphIndex === bookmark.paragraphIndex))];
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedBookmarks));
  } catch (error) {
    console.error('Failed to add bookmark:', error);
  }
};

export const removeBookmark = (bookId: number, chapterId: number, paragraphIndex: number): void => {
  try {
    const bookmarks = getAllBookmarks();
    const updatedBookmarks = bookmarks.filter(b => !(b.bookId === bookId && b.chapterId === chapterId && b.paragraphIndex === paragraphIndex));
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedBookmarks));
  } catch (error) {
    console.error('Failed to remove bookmark:', error);
  }
};

export const isBookmarked = (bookId: number, chapterId: number, paragraphIndex: number): boolean => {
  const bookmarks = getAllBookmarks();
  return bookmarks.some(b => b.bookId === bookId && b.chapterId === chapterId && b.paragraphIndex === paragraphIndex);
};
