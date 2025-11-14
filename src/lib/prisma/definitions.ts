import type { User, Book, Chapter, CommunityPost, Comment, Follow, ReadingProgress, Bookmark, Activity } from '@prisma/client';

export type { User, Book, Chapter, CommunityPost, Comment, Follow, ReadingProgress, Bookmark, Activity };

export type CommunityPostWithAuthor = CommunityPost & { author: User, _count: { comments: number } };

export type ChapterWithContent = Chapter & {
    content: string[];
};
