
'use server';
import { PrismaClient, User, Comment, Book, CommunityPost, Activity, Follow, Chapter } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ReadingProgress, Bookmark } from '../lib/definitions';

export const prisma = new PrismaClient();

// Re-export types for client-side usage
export type { User, Comment, Book, CommunityPost, Activity, Chapter, Follow } from '@prisma/client';
export type { ReadingProgress, Bookmark } from '../lib/definitions';


export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const register = async (data: Pick<User, 'name' | 'email' | 'password'|'avatarUrl'>): Promise<User> => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new Error("User with this email already exists.");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
        ...data,
        password: hashedPassword,
        bio: 'Amante da leitura e da reflexão.',
        },
    });
    return user;
};


export const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const getCommentsForPost = async (postId: number) => {
    return prisma.comment.findMany({
        where: { communityPostId: postId },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
    });
};

export const addComment = async (postId: number, userId: number, text: string) => {
    return prisma.comment.create({
        data: {
        text,
        authorId: userId,
        communityPostId: postId,
        },
        include: {
        user: true,
        },
    });
};

export const getBooks = async (): Promise<Book[]> => {
  return prisma.book.findMany({
    include: {
        chapters: true,
    }
  });
};

export const getBookById = async (id: number) => {
    return prisma.book.findUnique({
        where: { id },
        include: { chapters: true },
    });
};

export const getCommunityPosts = async () => {
    const posts = await prisma.communityPost.findMany({
        include: { 
            author: true, 
            _count: {
                select: { comments: true }
            } 
        },
        orderBy: { createdAt: 'desc' },
    });
    // This is a workaround because Prisma can't directly include the count on the relation
    return posts.map(post => ({
        ...post,
        commentsCount: post._count.comments,
    }));
};

export const createPublication = async (data: { authorId: number, content: string, verses: string[], image?: string | null }) => {
    const publication = await prisma.communityPost.create({
        data: {
            authorId: data.authorId,
            comment: data.content,
            bookVerse: data.verses.join(', '),
            imageUrl: data.image,
            quote: '', // Quote might need to be fetched or added manually
            likes: 0,
        }
    });
    return publication;
}

export const getActivities = async () => {
    return prisma.activity.findMany({
        include: {
            author: true,
            book: true,
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 10,
    });
}

export const getFollowing = async (userId: number) => {
    const followingRelations = await prisma.follow.findMany({
        where: { followerId: userId },
        include: { following: true }
    });
    return followingRelations.map(rel => rel.following);
}

export const getFollowers = async (userId: number) => {
    const followerRelations = await prisma.follow.findMany({
        where: { followingId: userId },
        include: { follower: true }
    });
    return followerRelations.map(rel => rel.follower);
}

export const toggleFollow = async (currentUserId: number, targetUserId: number): Promise<boolean> => {
    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        },
    });

    if (existingFollow) {
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: targetUserId,
                },
            },
        });
        return false; // Now not following
    } else {
        await prisma.follow.create({
            data: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        });
        return true; // Now following
    }
};

export const getIsFollowing = async (currentUserId: number, targetUserId: number): Promise<boolean> => {
    if (currentUserId === targetUserId) return false;
    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        },
    });
    return !!existingFollow;
}


// These functions interact with localStorage and must be client-side.
// They will be handled in a client-side context or custom hooks.

const PROGRESS_STORAGE_KEY = 'litbook_reading_progress';

export const saveReadingProgressClient = (bookId: number, chapterId: number, paragraphIndex: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const allProgress = getAllReadingProgressClient();
    allProgress[bookId] = { chapterId, paragraphIndex, timestamp: Date.now() };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Failed to save reading progress:', error);
  }
};

export const getReadingProgressClient = (bookId: number): ReadingProgress | null => {
  if (typeof window === 'undefined') return null;
  try {
    const allProgress = getAllReadingProgressClient();
    return allProgress[bookId] || null;
  } catch (error) {
    console.error('Failed to get reading progress:', error);
    return null;
  }
};

export const getAllReadingProgressClient = (): Record<number, ReadingProgress> => {
  if (typeof window === 'undefined') return {};
  try {
    const progressJson = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return progressJson ? JSON.parse(progressJson) : {};
  } catch (error) {
    console.error('Failed to get all reading progress:', error);
    return {};
  }
};


const BOOKMARKS_STORAGE_KEY = 'litbook_bookmarks';

export const getAllBookmarksClient = (): Bookmark[] => {
  if (typeof window === 'undefined') return [];
  try {
    const bookmarksJson = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return bookmarksJson ? JSON.parse(bookmarksJson) : [];
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
};

export const addBookmarkClient = (bookmark: Omit<Bookmark, 'timestamp' | 'id'>): void => {
  if (typeof window === 'undefined') return;
  try {
    const bookmarks = getAllBookmarksClient();
    const newBookmark: Bookmark = { ...bookmark, id: Date.now(), timestamp: Date.now() };
    const updatedBookmarks = [newBookmark, ...bookmarks.filter(b => !(b.bookId === bookmark.bookId && b.chapterId === bookmark.chapterId && b.paragraphIndex === bookmark.paragraphIndex))];
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedBookmarks));
  } catch (error) {
    console.error('Failed to add bookmark:', error);
  }
};

export const removeBookmarkClient = (bookId: number, chapterId: number, paragraphIndex: number): void => {
  if (typeof window === 'undefined') return;
  try {
    const bookmarks = getAllBookmarksClient();
    const updatedBookmarks = bookmarks.filter(b => !(b.bookId === bookId && b.chapterId === chapterId && b.paragraphIndex === paragraphIndex));
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedBookmarks));
  } catch (error) {
    console.error('Failed to remove bookmark:', error);
  }
};

export const isBookmarkedClient = (bookId: number, chapterId: number, paragraphIndex: number): boolean => {
  if (typeof window === 'undefined') return false;
  const bookmarks = getAllBookmarksClient();
  return bookmarks.some(b => b.bookId === bookId && b.chapterId === chapterId && b.paragraphIndex === paragraphIndex);
};
