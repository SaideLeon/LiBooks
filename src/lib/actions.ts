'use server';

import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;
export type Book = typeof schema.books.$inferSelect;
export type NewBook = typeof schema.books.$inferInsert;
export type Chapter = typeof schema.chapters.$inferSelect;
export type NewChapter = typeof schema.chapters.$inferInsert;
export type CommunityPost = typeof schema.communityPosts.$inferSelect;
export type NewCommunityPost = typeof schema.communityPosts.$inferInsert;
export type Comment = typeof schema.comments.$inferSelect;
export type NewComment = typeof schema.comments.$inferInsert;
export type Follow = typeof schema.follows.$inferSelect;
export type NewFollow = typeof schema.follows.$inferInsert;
export type ReadingProgress = typeof schema.readingProgress.$inferSelect;
export type NewReadingProgress = typeof schema.readingProgress.$inferInsert;
export type Bookmark = typeof schema.bookmarks.$inferSelect;
export type NewBookmark = typeof schema.bookmarks.$inferInsert;
export type Activity = typeof schema.activities.$inferSelect;
export type NewActivity = typeof schema.activities.$inferInsert;


export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
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
    const existingUser = await db.query.users.findFirst({ where: eq(schema.users.email, data.email) });
    if (existingUser) {
        throw new Error("User with this email already exists.");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await db.insert(schema.users).values({
        ...data,
        password: hashedPassword,
        bio: 'Amante da leitura e da reflexão.',
    }).returning();
    return result[0];
};


export const getUserById = async (id: number): Promise<(User & { authoredBooks: Book[], posts: CommunityPost[], comments: Comment[], followers: Follow[], following: Follow[] }) | null> => {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, id),
    with: {
      authoredBooks: true,
      posts: true,
      comments: true,
      followers: true,
      following: true,
    },
  });
  return user || null;
};

export const getCommentsForPost = async (postId: number) => {
    return db.query.comments.findMany({
        where: eq(schema.comments.communityPostId, postId),
        with: { author: true },
        orderBy: desc(schema.comments.createdAt),
    });
};

export const addComment = async (postId: number, userId: number, text: string) => {
    const newComment = await db.insert(schema.comments).values({
        text,
        authorId: userId,
        communityPostId: postId,
    }).returning({ id: schema.comments.id });

    return db.query.comments.findFirst({
        where: eq(schema.comments.id, newComment[0].id),
        with: { author: true },
    });
};

export const getBooks = async () => {
  return db.query.books.findMany({
    with: {
        chapters: true,
        author: true,
    }
  });
};

export const getBookById = async (id: number) => {
    return db.query.books.findFirst({
        where: eq(schema.books.id, id),
        with: { chapters: true, author: true },
    });
};

export const createBook = async (bookData: {
  title: string;
  description: string;
  preface: string;
  coverUrl: string;
  authorName: string;
  authorId: number;
  chapters: { title: string; subtitle: string; content: string }[];
}) => {
  const { title, description, preface, coverUrl, authorName, authorId, chapters } = bookData;

  const newBookId = await db.transaction(async (tx) => {
    const bookResult = await tx.insert(schema.books).values({
      title,
      description,
      preface,
      coverUrl,
      authorName,
      authorId,
    }).returning({ id: schema.books.id });

    const bookId = bookResult[0].id;

    if (chapters.length > 0) {
        await tx.insert(schema.chapters).values(chapters.map(chapter => ({
            ...chapter,
            content: chapter.content.split('\n').filter(p => p.trim() !== ''),
            bookId,
        })));
    }

    return bookId;
  });

  const newBook = await db.query.books.findFirst({
      where: eq(schema.books.id, newBookId),
      with: {
          chapters: true,
      }
  });

  if (!newBook) {
      throw new Error("Could not find the newly created book");
  }
  
  return newBook;
};

export const getCommunityPosts = async () => {
    const posts = await db.query.communityPosts.findMany({
        with: { 
            author: true,
            comments: {
                columns: {
                    id: true
                }
            }
        },
        orderBy: desc(schema.communityPosts.createdAt),
    });

    return posts.map(post => ({
        ...post,
        commentsCount: post.comments.length,
    }));
};

export const createPublication = async (data: { authorId: number, content: string, verses: string[], image?: string | null }) => {
    const result = await db.insert(schema.communityPosts).values({
        authorId: data.authorId,
        comment: data.content,
        bookVerse: data.verses.join(', '),
        imageUrl: data.image,
        quote: '', // Quote might need to be fetched or added manually
        likes: 0,
    }).returning();
    return result[0];
}


export const getFollowing = async (userId: number) => {
    const followingRelations = await db.query.follows.findMany({
        where: eq(schema.follows.followerId, userId),
        with: { following: true }
    });
    return followingRelations.map(rel => rel.following);
}

export const getFollowers = async (userId: number) => {
    const followerRelations = await db.query.follows.findMany({
        where: eq(schema.follows.followingId, userId),
        with: { follower: true }
    });
    return followerRelations.map(rel => rel.follower);
}

export const toggleFollow = async (currentUserId: number, targetUserId: number): Promise<boolean> => {
    const existingFollow = await db.query.follows.findFirst({
        where: and(
            eq(schema.follows.followerId, currentUserId),
            eq(schema.follows.followingId, targetUserId)
        ),
    });

    if (existingFollow) {
        await db.delete(schema.follows).where(
            and(
                eq(schema.follows.followerId, currentUserId),
                eq(schema.follows.followingId, targetUserId)
            )
        );
        return false; // Now not following
    } else {
        await db.insert(schema.follows).values({
            followerId: currentUserId,
            followingId: targetUserId,
        });
        return true; // Now following
    }
};

export const getIsFollowing = async (currentUserId: number, targetUserId: number): Promise<boolean> => {
    if (currentUserId === targetUserId) return false;
    const existingFollow = await db.query.follows.findFirst({
        where: and(
            eq(schema.follows.followerId, currentUserId),
            eq(schema.follows.followingId, targetUserId)
        ),
    });
    return !!existingFollow;
}


// --- Reading Progress Actions ---

export async function saveReadingProgress(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<ReadingProgress> {
  const result = await db.insert(schema.readingProgress)
    .values({ userId, bookId, chapterId, paragraphIndex })
    .onConflictDoUpdate({
      target: [schema.readingProgress.userId, schema.readingProgress.bookId],
      set: { chapterId, paragraphIndex, updatedAt: new Date() },
    })
    .returning();
  return result[0];
}

export async function getReadingProgress(userId: number, bookId: number): Promise<ReadingProgress | null> {
  const progress = await db.query.readingProgress.findFirst({
    where: and(
        eq(schema.readingProgress.userId, userId),
        eq(schema.readingProgress.bookId, bookId)
    ),
  });
  return progress || null;
}

export async function getAllReadingProgress(userId: number) {
  return db.query.readingProgress.findMany({
    where: eq(schema.readingProgress.userId, userId),
    with: { book: { with: { chapters: true, author: true } } },
    orderBy: desc(schema.readingProgress.updatedAt),
  });
}


// --- Bookmark Actions ---

export async function getAllBookmarks(userId: number) {
  return db.query.bookmarks.findMany({
    where: eq(schema.bookmarks.userId, userId),
    with: { 
        book: {
            with: { chapters: true, author: true }
        },
    },
    orderBy: desc(schema.bookmarks.createdAt),
  });
}

export async function addBookmark(userId: number, bookId: number, chapterId: number, paragraphIndex: number, text: string): Promise<Bookmark> {
  const bookmark = await db.query.bookmarks.findFirst({
      where: and(
          eq(schema.bookmarks.userId, userId),
          eq(schema.bookmarks.bookId, bookId),
          eq(schema.bookmarks.chapterId, chapterId),
          eq(schema.bookmarks.paragraphIndex, paragraphIndex)
      )
  });

  if (bookmark) {
    return bookmark;
  }

  const result = await db.insert(schema.bookmarks).values({ userId, bookId, chapterId, paragraphIndex, text }).returning();
  return result[0];
}

export async function removeBookmark(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<Bookmark | undefined> {
  const bookmark = await db.query.bookmarks.findFirst({
      where: and(
          eq(schema.bookmarks.userId, userId),
          eq(schema.bookmarks.bookId, bookId),
          eq(schema.bookmarks.chapterId, chapterId),
          eq(schema.bookmarks.paragraphIndex, paragraphIndex)
      )
  });

  if (!bookmark) {
      throw new Error("Bookmark not found");
  }

  const result = await db.delete(schema.bookmarks).where(eq(schema.bookmarks.id, bookmark.id)).returning();
  return result[0];
}

export async function isBookmarked(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<boolean> {
  const bookmark = await db.query.bookmarks.findFirst({
    where: and(
        eq(schema.bookmarks.userId, userId),
        eq(schema.bookmarks.bookId, bookId),
        eq(schema.bookmarks.chapterId, chapterId),
        eq(schema.bookmarks.paragraphIndex, paragraphIndex)
      ),
  });
  return !!bookmark;
}


// --- Activity Actions ---

export async function createActivity(userId: number, type: string, bookId?: number, comment?: string) {
    const result = await db.insert(schema.activities).values({
        userId,
        type,
        bookId,
        comment,
    }).returning();
    return result[0];
}

export async function getActivitiesForUser(userId: number) {
    // This could be expanded to get activities for followed users
    return db.query.activities.findMany({
        where: eq(schema.activities.userId, userId),
        with: { user: true, book: true },
        orderBy: desc(schema.activities.createdAt),
        limit: 20
    });
}
