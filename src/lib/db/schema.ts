import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  json,
  jsonb
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  bio: text("bio"),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  coverUrl: varchar("cover_url", { length: 255 }).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  preface: text("preface"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").references(() => books.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  content: jsonb("content").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityPosts = pgTable("community_posts", {
    id: serial("id").primaryKey(),
    authorId: integer("author_id").references(() => users.id).notNull(),
    comment: text("comment").notNull(),
    bookVerse: varchar("book_verse", { length: 255 }),
    quote: text("quote"),
    likes: integer("likes").default(0).notNull(),
    imageUrl: varchar("image_url", { length: 255 }),
    isLiked: boolean("is_liked").default(false).notNull(),
    commentsCount: integer("comments_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  communityPostId: integer("community_post_id").references(() => communityPosts.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  followingId: integer("following_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
});

export const readingProgress = pgTable("reading_progress", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    bookId: integer("book_id").references(() => books.id).notNull(),
    chapterId: integer("chapter_id").notNull(),
    paragraphIndex: integer("paragraph_index").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bookmarks = pgTable("bookmarks", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    bookId: integer("book_id").references(() => books.id).notNull(),
    chapterId: integer("chapter_id").notNull(),
    paragraphIndex: integer("paragraph_index").notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    type: varchar("type", { length: 255 }).notNull(), // e.g., 'ADDED_BOOKMARK', 'STARTED_READING'
    bookId: integer("book_id").references(() => books.id),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});


// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
  authoredBooks: many(books, { relationName: "AuthoredBooks" }),
  posts: many(communityPosts),
  comments: many(comments),
  followers: many(follows, { relationName: 'user_followers' }),
  following: many(follows, { relationName: 'user_following' }),
  readingProgress: many(readingProgress),
  bookmarks: many(bookmarks),
  activities: many(activities),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  author: one(users, {
    fields: [books.authorId],
    references: [users.id],
    relationName: "AuthoredBooks"
  }),
  chapters: many(chapters),
  readingProgress: many(readingProgress),
  bookmarks: many(bookmarks),
}));

export const chaptersRelations = relations(chapters, ({ one }) => ({
  book: one(books, {
    fields: [chapters.bookId],
    references: [books.id],
  }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
    author: one(users, {
        fields: [communityPosts.authorId],
        references: [users.id]
    }),
    comments: many(comments)
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    author: one(users, {
        fields: [comments.authorId],
        references: [users.id]
    }),
    post: one(communityPosts, {
        fields: [comments.communityPostId],
        references: [communityPosts.id]
    })
}));

export const followsRelations = relations(follows, ({ one }) => ({
    follower: one(users, {
        fields: [follows.followerId],
        references: [users.id],
        relationName: 'user_followers'
    }),
    following: one(users, {
        fields: [follows.followingId],
        references: [users.id],
        relationName: 'user_following'
    })
}));

export const readingProgressRelations = relations(readingProgress, ({ one }) => ({
  user: one(users, {
    fields: [readingProgress.userId],
    references: [users.id],
  }),
  book: one(books, {
    fields: [readingProgress.bookId],
    references: [books.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
    user: one(users, {
        fields: [bookmarks.userId],
        references: [users.id],
    }),
    book: one(books, {
        fields: [bookmarks.bookId],
        references: [books.id],
    }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
    user: one(users, {
        fields: [activities.userId],
        references: [users.id],
    }),
    book: one(books, {
        fields: [activities.bookId],
        references: [books.id],
    }),
}));
