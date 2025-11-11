'use server';

import { PrismaClient } from '@prisma/client';
import type { User, Book as PrismaBook, ReadingProgress as PrismaReadingProgress, Bookmark as PrismaBookmark, Activity as PrismaActivity, Follow, CommunityPost as PrismaCommunityPost } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export type { User, Follow };
export type ReadingProgress = PrismaReadingProgress;
export type Bookmark = PrismaBookmark;
export type Book = PrismaBook;
export type CommunityPost = PrismaCommunityPost;
export type Activity = PrismaActivity;


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

export const getBooks = async () => {
  return prisma.book.findMany({
    include: {
        chapters: true,
        author: true,
    }
  });
};

export const getBookById = async (id: number) => {
    return prisma.book.findUnique({
        where: { id },
        include: { chapters: true, author: true },
    });
};

export const createBook = async (bookData: {
  title: string;
  description: string;
  preface: string;
  coverUrl: string;
  authorId: number;
  chapters: { title: string; subtitle: string; content: string }[];
}) => {
  const { title, description, preface, coverUrl, authorId, chapters } = bookData;

  return prisma.book.create({
    data: {
      title,
      description,
      preface,
      coverUrl,
      authorId,
      chapters: {
        create: chapters.map(chapter => ({
          title: chapter.title,
          subtitle: chapter.subtitle,
          content: chapter.content.split('\n').filter(p => p.trim() !== ''),
        })),
      },
    },
    include: {
      chapters: true,
    },
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


// --- Reading Progress Actions ---

export async function saveReadingProgress(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<PrismaReadingProgress> {
  return prisma.readingProgress.upsert({
    where: { userId_bookId: { userId, bookId } },
    update: { chapterId, paragraphIndex },
    create: { userId, bookId, chapterId, paragraphIndex },
  });
}

export async function getReadingProgress(userId: number, bookId: number): Promise<PrismaReadingProgress | null> {
  return prisma.readingProgress.findUnique({
    where: { userId_bookId: { userId, bookId } },
  });
}

export async function getAllReadingProgress(userId: number) {
  return prisma.readingProgress.findMany({
    where: { userId },
    include: { book: { include: { chapters: true, author: true } } },
    orderBy: { updatedAt: 'desc' },
  });
}


// --- Bookmark Actions ---

export async function getAllBookmarks(userId: number) {
  return prisma.bookmark.findMany({
    where: { userId },
    include: { 
        book: {
            include: { chapters: true, author: true }
        },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addBookmark(userId: number, bookId: number, chapterId: number, paragraphIndex: number, text: string): Promise<PrismaBookmark> {
  const bookmark = await prisma.bookmark.findFirst({
      where: {
          userId,
          bookId,
          chapterId,
          paragraphIndex
      }
  });

  if (bookmark) {
    return bookmark;
  }

  return prisma.bookmark.create({
    data: { userId, bookId, chapterId, paragraphIndex, text },
  });
}

export async function removeBookmark(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<PrismaBookmark> {
  // This needs a unique identifier to delete. Let's find it first.
  const bookmark = await prisma.bookmark.findFirst({
      where: {
          userId,
          bookId,
          chapterId,
          paragraphIndex
      }
  });

  if (!bookmark) {
      throw new Error("Bookmark not found");
  }

  return prisma.bookmark.delete({
    where: {
      id: bookmark.id
    },
  });
}

export async function isBookmarked(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<boolean> {
  const bookmark = await prisma.bookmark.findFirst({
    where: {
        userId,
        bookId,
        chapterId,
        paragraphIndex
      },
  });
  return !!bookmark;
}


// --- Activity Actions ---

export async function createActivity(userId: number, type: string, bookId?: number, comment?: string) {
    return prisma.activity.create({
        data: {
            userId,
            type,
            bookId,
            comment,
        }
    });
}

export async function getActivitiesForUser(userId: number) {
    // This could be expanded to get activities for followed users
    return prisma.activity.findMany({
        where: { userId },
        include: { user: true, book: true },
        orderBy: { createdAt: 'desc' },
        take: 20
    });
}
