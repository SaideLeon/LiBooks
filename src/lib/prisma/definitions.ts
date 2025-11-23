import type { User, Book, Chapter, CommunityPost, Comment, Like, Follow, ReadingProgress, Bookmark, Activity } from '@prisma/client';

export type { User, Book, Chapter, CommunityPost, Comment, Follow, ReadingProgress, Bookmark, Activity, Like };

export type CommunityPostWithDetails = CommunityPost & {
    author: User,
    _count: {
        comments: number,
        likes: number
    },
    likes: { authorId: number }[]
};


export type ChapterWithContent = Chapter & {
    content: string[];
};
