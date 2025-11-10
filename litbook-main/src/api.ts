import { PrismaClient, User, Comment, Book, CommunityPost, Activity } from '@prisma/client';
import bcrypt from 'bcrypt';

export const prisma = new PrismaClient();

export const login = async (email: string, password: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return null;
  }
  return user;
};

export const register = async (data: Pick<User, 'name' | 'email' | 'password'>): Promise<User> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return user;
};

export const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } });
};

export const getCommentsForPost = async (postId: number): Promise<Comment[]> => {
  return prisma.comment.findMany({
    where: { communityPostId: postId },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
};

export const addComment = async (postId: number, userId: number, text: string): Promise<Comment> => {
  return prisma.comment.create({
    data: {
      text,
      userId,
      communityPostId: postId,
    },
    include: {
      user: true,
    },
  });
};

export const getBooks = async (): Promise<Book[]> => {
  return prisma.book.findMany();
};

export const getBookById = async (id: number): Promise<Book | null> => {
  return prisma.book.findUnique({
    where: { id },
    include: { chapters: true },
  });
};

export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  return prisma.communityPost.findMany({
    include: { author: true, comments: true },
    orderBy: { createdAt: 'desc' },
  });
};
