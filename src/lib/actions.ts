'use server';

import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import type { User, Book, Chapter, CommunityPost, Comment, Follow, ReadingProgress, Bookmark, Activity } from '@/lib/prisma/definitions';

// These types are now just interfaces, data will be shaped manually from DB results
export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const res = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = res.rows[0];
    
    if (!user) {
      return null;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return null;
    }
    // Drizzle's relation mapping is gone, so we have to manually conform to the type
    return { ...user, authoredBooks: [], posts: [], comments: [], followers: [], following: [] };
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const register = async (data: Pick<NewUser, 'name' | 'email' | 'password' | 'avatarUrl'>): Promise<User> => {
    const existingUserRes = await db.query('SELECT id FROM users WHERE email = $1', [data.email]);
    if (existingUserRes.rows.length > 0) {
        throw new Error("User with this email already exists.");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await db.query(
        'INSERT INTO users(name, email, password, avatar_url, bio) VALUES($1, $2, $3, $4, $5) RETURNING *',
        [data.name, data.email, hashedPassword, data.avatarUrl, 'Amante da leitura e da reflexão.']
    );
     const newUser = result.rows[0];
     return { ...newUser, authoredBooks: [], posts: [], comments: [], followers: [], following: [] };
};

export const getUserById = async (id: number): Promise<(User & { authoredBooks: Book[], posts: CommunityPost[], comments: Comment[], followers: Follow[], following: Follow[] }) | null> => {
  const userRes = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  if (userRes.rows.length === 0) return null;
  
  const user = userRes.rows[0];
  // Manual fetching of relations
  const booksRes = await db.query('SELECT * FROM books WHERE author_id = $1', [id]);
  const postsRes = await db.query('SELECT * FROM community_posts WHERE author_id = $1', [id]);
  const commentsRes = await db.query('SELECT * FROM comments WHERE author_id = $1', [id]);
  const followersRes = await db.query('SELECT * FROM follows WHERE following_id = $1', [id]);
  const followingRes = await db.query('SELECT * FROM follows WHERE follower_id = $1', [id]);

  return {
      ...user,
      authoredBooks: booksRes.rows,
      posts: postsRes.rows,
      comments: commentsRes.rows,
      followers: followersRes.rows,
      following: followingRes.rows
  };
};

export const getCommentsForPost = async (postId: number): Promise<(Comment & { author: User })[]> => {
    const res = await db.query(`
        SELECT c.*, u.id as author_id, u.name as author_name, u.email as author_email, u.avatar_url as author_avatar_url
        FROM comments c
        JOIN users u ON c.author_id = u.id
        WHERE c.community_post_id = $1
        ORDER BY c.created_at DESC
    `, [postId]);

    return res.rows.map(row => ({
        id: row.id,
        text: row.text,
        authorId: row.author_id,
        communityPostId: row.community_post_id,
        createdAt: row.created_at,
        author: {
            id: row.author_id,
            name: row.author_name,
            email: row.author_email,
            avatarUrl: row.author_avatar_url
        } as User
    }));
};

export const addComment = async (postId: number, userId: number, text: string): Promise<(Comment & { author: User }) | null> => {
    const res = await db.query(
        'INSERT INTO comments(text, author_id, community_post_id) VALUES($1, $2, $3) RETURNING id',
        [text, userId, postId]
    );
    const newCommentId = res.rows[0].id;
    
    const newCommentRes = await db.query(`
        SELECT c.*, u.id as author_id, u.name as author_name, u.email as author_email, u.avatar_url as author_avatar_url
        FROM comments c
        JOIN users u ON c.author_id = u.id
        WHERE c.id = $1
    `, [newCommentId]);

    const row = newCommentRes.rows[0];
     return {
        id: row.id,
        text: row.text,
        authorId: row.author_id,
        communityPostId: row.community_post_id,
        createdAt: row.created_at,
        author: {
            id: row.author_id,
            name: row.author_name,
            email: row.author_email,
            avatarUrl: row.author_avatar_url
        } as User
    };
};

export const getBooks = async (): Promise<Book[]> => {
  const res = await db.query(`
    SELECT b.*, u.name as author_name
    FROM books b
    JOIN users u ON b.author_id = u.id
  `, []);
  
  const books = await Promise.all(res.rows.map(async book => {
      const chaptersRes = await db.query('SELECT * FROM chapters WHERE book_id = $1', [book.id]);
      return {...book, chapters: chaptersRes.rows, author: { name: book.author_name }};
  }));

  return books as Book[];
};

export const getBookById = async (id: number): Promise<Book | null> => {
    const bookRes = await db.query(`
        SELECT b.*, u.id as author_id, u.name as author_name, u.email as author_email, u.avatar_url as author_avatar_url
        FROM books b
        JOIN users u on b.author_id = u.id
        WHERE b.id = $1
    `, [id]);
    if (bookRes.rows.length === 0) return null;

    const bookData = bookRes.rows[0];
    const chaptersRes = await db.query('SELECT * FROM chapters WHERE book_id = $1', [id]);
    
    const author: User = {
        id: bookData.author_id,
        name: bookData.author_name,
        email: bookData.author_email,
        avatarUrl: bookData.author_avatar_url,
    } as User;

    return {
        ...bookData,
        author,
        chapters: chaptersRes.rows,
    } as Book;
};

export const createBook = async (bookData: {
  title: string;
  description: string;
  preface: string;
  coverUrl: string;
  authorName: string;
  authorId: number;
  chapters: { title: string; subtitle: string; content: string }[];
}): Promise<Book> => {
  const { title, description, preface, coverUrl, authorName, authorId, chapters } = bookData;

  const client = await db.query('BEGIN', []);

  try {
    const bookResult = await db.query(
      `INSERT INTO books(title, description, preface, cover_url, author_name, author_id)
       VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
      [title, description, preface, coverUrl, authorName, authorId]
    );
    const bookId = bookResult.rows[0].id;

    if (chapters.length > 0) {
      for (const chapter of chapters) {
        const contentArray = chapter.content.split('\n').filter(p => p.trim() !== '');
        await db.query(
          'INSERT INTO chapters(book_id, title, subtitle, content) VALUES($1, $2, $3, $4)',
          [bookId, chapter.title, chapter.subtitle, JSON.stringify(contentArray)]
        );
      }
    }
    await db.query('COMMIT', []);
    
    const newBook = await getBookById(bookId);
    if (!newBook) {
      throw new Error("Could not find the newly created book");
    }
    return newBook;
  } catch (e) {
    await db.query('ROLLBACK', []);
    throw e;
  }
};

export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
    const res = await db.query(`
        SELECT p.*, u.id as author_id, u.name as author_name, u.email as author_email, u.avatar_url as author_avatar_url,
        (SELECT COUNT(*) FROM comments WHERE community_post_id = p.id) as comments_count
        FROM community_posts p
        JOIN users u ON p.author_id = u.id
        ORDER BY p.created_at DESC
    `, []);
    
    return res.rows.map(row => ({
        ...row,
        author: {
            id: row.author_id,
            name: row.author_name,
            email: row.author_email,
            avatarUrl: row.author_avatar_url,
        },
        commentsCount: parseInt(row.comments_count, 10),
    })) as CommunityPost[];
};

export const createPublication = async (data: { authorId: number, content: string, verses: string[], image?: string | null }): Promise<CommunityPost> => {
    const res = await db.query(
        `INSERT INTO community_posts(author_id, comment, book_verse, image_url, quote, likes)
         VALUES($1, $2, $3, $4, '', 0) RETURNING *`,
        [data.authorId, data.content, data.verses.join(', '), data.image]
    );
    return res.rows[0];
}


export const getFollowing = async (userId: number): Promise<User[]> => {
    const res = await db.query(`
        SELECT u.* FROM users u
        JOIN follows f ON u.id = f.following_id
        WHERE f.follower_id = $1
    `, [userId]);
    return res.rows;
}

export const getFollowers = async (userId: number): Promise<User[]> => {
    const res = await db.query(`
        SELECT u.* FROM users u
        JOIN follows f ON u.id = f.follower_id
        WHERE f.following_id = $1
    `, [userId]);
    return res.rows;
}

export const toggleFollow = async (currentUserId: number, targetUserId: number): Promise<boolean> => {
    const res = await db.query(
        'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
        [currentUserId, targetUserId]
    );
    const existingFollow = res.rows[0];

    if (existingFollow) {
        await db.query('DELETE FROM follows WHERE id = $1', [existingFollow.id]);
        return false; // Now not following
    } else {
        await db.query('INSERT INTO follows(follower_id, following_id) VALUES($1, $2)', [currentUserId, targetUserId]);
        return true; // Now following
    }
};

export const getIsFollowing = async (currentUserId: number, targetUserId: number): Promise<boolean> => {
    if (currentUserId === targetUserId) return false;
    const res = await db.query(
        'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
        [currentUserId, targetUserId]
    );
    return res.rows.length > 0;
}

export async function saveReadingProgress(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<ReadingProgress> {
  const res = await db.query(
    `INSERT INTO reading_progress (user_id, book_id, chapter_id, paragraph_index)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, book_id)
     DO UPDATE SET chapter_id = $3, paragraph_index = $4, updated_at = NOW()
     RETURNING *`,
    [userId, bookId, chapterId, paragraphIndex]
  );
  return res.rows[0];
}

export async function getReadingProgress(userId: number, bookId: number): Promise<ReadingProgress | null> {
  const res = await db.query(
      'SELECT * FROM reading_progress WHERE user_id = $1 AND book_id = $2',
      [userId, bookId]
  );
  return res.rows[0] || null;
}

export async function getAllReadingProgress(userId: number): Promise<(ReadingProgress & { book: Book })[]> {
  const res = await db.query(`
    SELECT rp.*, b.id as book_id, b.title, b.cover_url, b.author_name
    FROM reading_progress rp
    JOIN books b ON rp.book_id = b.id
    WHERE rp.user_id = $1
    ORDER BY rp.updated_at DESC
  `, [userId]);
  
  return res.rows.map(row => ({
      ...row,
      book: {
          id: row.book_id,
          title: row.title,
          coverUrl: row.cover_url,
          authorName: row.author_name
      }
  })) as (ReadingProgress & { book: Book })[];
}

export async function getAllBookmarks(userId: number): Promise<(Bookmark & { book: Book })[]> {
  const res = await db.query(`
    SELECT bm.*, b.id as book_id, b.title, b.cover_url, b.author_name
    FROM bookmarks bm
    JOIN books b ON bm.book_id = b.id
    WHERE bm.user_id = $1
    ORDER BY bm.created_at DESC
  `, [userId]);
  
  const bookmarks = await Promise.all(res.rows.map(async row => {
      const chaptersRes = await db.query('SELECT * FROM chapters WHERE book_id = $1', [row.book_id]);
      return {
          ...row,
          book: {
              id: row.book_id,
              title: row.title,
              coverUrl: row.cover_url,
              authorName: row.author_name,
              chapters: chaptersRes.rows
          }
      };
  }));

  return bookmarks as (Bookmark & { book: Book })[];
}

export async function addBookmark(userId: number, bookId: number, chapterId: number, paragraphIndex: number, text: string): Promise<Bookmark> {
  const existingRes = await db.query(
      'SELECT * FROM bookmarks WHERE user_id=$1 AND book_id=$2 AND chapter_id=$3 AND paragraph_index=$4',
      [userId, bookId, chapterId, paragraphIndex]
  );
  if (existingRes.rows.length > 0) return existingRes.rows[0];

  const res = await db.query(
    'INSERT INTO bookmarks(user_id, book_id, chapter_id, paragraph_index, text) VALUES($1, $2, $3, $4, $5) RETURNING *',
    [userId, bookId, chapterId, paragraphIndex, text]
  );
  return res.rows[0];
}

export async function removeBookmark(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<Bookmark | undefined> {
  const res = await db.query(
    'DELETE FROM bookmarks WHERE user_id=$1 AND book_id=$2 AND chapter_id=$3 AND paragraph_index=$4 RETURNING *',
    [userId, bookId, chapterId, paragraphIndex]
  );
  return res.rows[0];
}

export async function isBookmarked(userId: number, bookId: number, chapterId: number, paragraphIndex: number): Promise<boolean> {
  const res = await db.query(
    'SELECT id FROM bookmarks WHERE user_id=$1 AND book_id=$2 AND chapter_id=$3 AND paragraph_index=$4',
    [userId, bookId, chapterId, paragraphIndex]
  );
  return res.rows.length > 0;
}

export async function createActivity(userId: number, type: string, bookId?: number, comment?: string): Promise<Activity> {
    const res = await db.query(
        'INSERT INTO activities(user_id, type, book_id, comment) VALUES($1, $2, $3, $4) RETURNING *',
        [userId, type, bookId, comment]
    );
    return res.rows[0];
}

export async function getActivitiesForUser(userId: number): Promise<Activity[]> {
    const res = await db.query(
        'SELECT * FROM activities WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
        [userId]
    );
    return res.rows;
}
