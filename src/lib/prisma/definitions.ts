

import type { User as PrismaUser, Book as PrismaBook, Chapter as PrismaChapter, CommunityPost as PrismaCommunityPost, Comment as PrismaComment, Follow as PrismaFollow } from '@prisma/client';

// We extend the Prisma types to include relations that we expand in our queries

export type User = PrismaUser;

export interface Chapter extends PrismaChapter {};

export interface Book extends PrismaBook {
    chapters?: Chapter[];
    author: User;
}

export interface Comment extends PrismaComment {
    user: User;
}

export interface CommunityPost extends PrismaCommunityPost {
    author: User;
    comments?: Comment[];
    commentsCount?: number;
}

export interface Follow extends PrismaFollow {
    follower: User,
    following: User
}
