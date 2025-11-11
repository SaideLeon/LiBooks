import { users, books, chapters, communityPosts, comments, follows, readingProgress, bookmarks, activities } from '../db/schema';

export type User = typeof users.$inferSelect;
export type Book = typeof books.$inferSelect & { chapters: Chapter[], author: User };
export type Chapter = typeof chapters.$inferSelect;
export type CommunityPost = typeof communityPosts.$inferSelect & { author: User, commentsCount: number, isLiked: boolean };
export type Comment = typeof comments.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type ReadingProgress = typeof readingProgress.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Activity = typeof activities.$inferSelect;
