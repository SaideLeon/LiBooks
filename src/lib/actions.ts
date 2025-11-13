
'use server';

import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import type { User, Book, Chapter, CommunityPost, Comment, Follow, ReadingProgress, Bookmark, Activity } from '@prisma/client';

export type { User, Book, Chapter, CommunityPost, Comment, Follow, ReadingProgress, Bookmark, Activity };

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    
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

export const register = async (data: Pick<NewUser, 'name' | 'email' | 'password' | 'avatarUrl'>): Promise<User> => {
    const existingUser = await db.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new Error("User with this email already exists.");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await db.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            avatarUrl: data.avatarUrl,
            bio: 'Amante da leitura e da reflexão.',
        }
    });
     return newUser;
};

export const getUserById = async (id: number): Promise<(User & { authoredBooks: (Book & { chapters: Chapter[] })[], posts: CommunityPost[], comments: Comment[], followers: Follow[], following: Follow[] }) | null> => {
  const user = await db.user.findUnique({
      where: { id },
      include: {
          authoredBooks: {
            include: {
              chapters: true,
            }
          },
          posts: true,
          comments: true,
          followers: true,
          following: true
      }
  });
  return user as (User & { authoredBooks: (Book & { chapters: Chapter[] })[], posts: CommunityPost[], comments: Comment[], followers: Follow[], following: Follow[] }) | null;
};

export const getCommentsForPost = async (postId: number): Promise<(Comment & { author: User })[]> => {
    const comments = await db.comment.findMany({
        where: { communityPostId: postId },
        include: { author: true },
        orderBy: { createdAt: 'desc' }
    });
    return comments;
};

export const addComment = async (postId: number, userId: number, text: string): Promise<(Comment & { author: User })> => {
    const newComment = await db.comment.create({
        data: {
            text,
            authorId: userId,
            communityPostId: postId
        },
        include: { author: true }
    });
    return newComment;
};

export const getBooks = async (): Promise<(Book & { author: User, chapters: Chapter[] })[]> => {
    const books = await db.book.findMany({
        include: {
            author: true,
            chapters: true,
        }
    });
    return books;
};

export const getBookById = async (id: number): Promise<(Book & { author: User, chapters: Chapter[] }) | null> => {
    const book = await db.book.findUnique({
        where: { id },
        include: {
            author: true,
            chapters: true,
        }
    });
    return book;
};

export const createBook = async (bookData: {
  title: string;
  description: string;
  preface: string;
  coverUrl: string;
  authorName: string;
  authorId: number;
  chapters: { title: string; subtitle: string; content: string }[];
}): Promise<Book & { chapters: Chapter[] }> => {
  const { title, description, preface, coverUrl, authorName, authorId, chapters } = bookData;

  const newBook = await db.book.create({
      data: {
          title,
          description,
          preface,
          coverUrl,
          authorName,
          authorId,
          chapters: {
              create: chapters.map(ch => ({
                  title: ch.title,
                  subtitle: ch.subtitle,
                  content: ch.content.split('\n').filter(p => p.trim() !== '')
              }))
          }
      },
      include: {
        chapters: true
      }
  });

  const createdBook = await db.book.findUnique({
    where: { id: newBook.id },
    include: { chapters: true }
  });
  
  if (!createdBook) {
      throw new Error("Failed to retrieve the created book with chapters.");
  }

  return createdBook as Book & { chapters: Chapter[] };
};

export const getCommunityPosts = async (): Promise<(CommunityPost & { author: User, commentsCount: number })[]> => {
    const posts = await db.communityPost.findMany({
        include: {
            author: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Manually add commentsCount for now
    const postsWithCounts = await Promise.all(
        posts.map(async (post) => {
            const commentsCount = await db.comment.count({ where: { communityPostId: post.id } });
            return { ...post, commentsCount };
        })
    );
    
    return postsWithCounts;
};

export const createPublication = async (data: { authorId: number, content: string, verses: string[], image?: string | null }): Promise<CommunityPost> => {
    const publication = await db.communityPost.create({
        data: {
            authorId: data.authorId,
            comment: data.content,
            bookVerse: data.verses.join(', '),
            imageUrl: data.image,
            quote: '',
            likes: 0
        }
    });
    return publication;
}

export const getFollowing = async (userId: number): Promise<User[]> => {
    const follows = await db.follow.findMany({
        where: { followerId: userId },
        include: { following: true }
    });
    return follows.map(f => f.following);
}

export const getFollowers = async (userId: number): Promise<User[]> => {
    const follows = await db.follow.findMany({
        where: { followingId: userId },
        include: { follower: true }
    });
    return follows.map(f => f.follower);
}

export const toggleFollow = async (currentUserId: number, targetUserId: number): Promise<boolean> => {
    const existingFollow = await db.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId
            }
        }
    });

    if (existingFollow) {
        await db.follow.delete({ where: { id: existingFollow.id } });
        return false; // Now not following
    } else {
        await db.follow.create({ data: { followerId: currentUserId, followingId: targetUserId } });
        return true; // Now following
    }
};

export const getIsFollowing = async (currentUserId: number, targetUserId: number): Promise<boolean> => {
    if (currentUserId === targetUserId) return false;
    const existingFollow = await db.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId
            }
        }
    });
    return !!existingFollow;
}

export async function saveReadingProgress(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<ReadingProgress> {
  const progress = await db.readingProgress.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: { chapterId, paragraphIndex },
      create: { userId, bookId, chapterId, paragraphIndex }
  });
  return progress;
}

export async function getReadingProgress(userId: number, bookId: number): Promise<(ReadingProgress & { book: Book & { chapters: Chapter[] } }) | null> {
    const progress = await db.readingProgress.findUnique({
        where: { userId_bookId: { userId, bookId } },
        include: {
            book: {
                include: {
                    chapters: true,
                },
            },
        },
    });
    return progress;
}

export async function getAllReadingProgress(userId: number): Promise<(ReadingProgress & { book: Book & { chapters: Chapter[]} })[]> {
    const progressRecords = await db.readingProgress.findMany({
        where: { userId },
        include: { 
            book: {
                include: {
                    chapters: true
                }
            } 
        },
        orderBy: { updatedAt: 'desc' }
    });
    return progressRecords;
}

export async function getAllBookmarks(userId: number): Promise<(Bookmark & { book: Book & { chapters: Chapter[]} })[]> {
    const bookmarks = await db.bookmark.findMany({
        where: { userId },
        include: { 
            book: {
                include: {
                    chapters: true
                }
            } 
        },
        orderBy: { createdAt: 'desc' }
    });
    return bookmarks;
}

export async function addBookmark(userId: number, bookId: number, chapterId: number, paragraphIndex: number, text: string): Promise<Bookmark> {
  const existing = await db.bookmark.findFirst({
      where: { userId, bookId, chapterId, paragraphIndex }
  });
  if (existing) return existing;

  const bookmark = await db.bookmark.create({
      data: { userId, bookId, chapterId, paragraphIndex, text }
  });
  return bookmark;
}

export async function removeBookmark(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<Bookmark | null> {
    const bookmarkToDelete = await db.bookmark.findFirst({
        where: { userId, bookId, chapterId, paragraphIndex }
    });
    if (bookmarkToDelete) {
        return await db.bookmark.delete({ where: { id: bookmarkToDelete.id } });
    }
    return null;
}

export async function isBookmarked(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<boolean> {
    const bookmark = await db.bookmark.findFirst({
        where: { userId, bookId, chapterId, paragraphIndex }
    });
    return !!bookmark;
}

export async function createActivity(userId: number, type: string, bookId?: number, comment?: string): Promise<Activity> {
    const activity = await db.activity.create({
        data: { userId, type, bookId, comment }
    });
    return activity;
}

export async function getActivitiesForUser(userId: number): Promise<Activity[]> {
    const activities = await db.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
    });
    return activities;
}
