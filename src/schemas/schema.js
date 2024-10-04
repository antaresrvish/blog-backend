import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const postSchema = pgTable('posts', {
  id: integer('id').notNull().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  imageBlobUrl: text('image_blob_url').notNull(),
  createdAt: timestamp('created_at', { mode: 'timestamptz' }).notNull()
});

export const commentSchema = pgTable('comments', {
    id: integer('id').notNull().primaryKey(),
    postId: integer('post_id').notNull().references(() => postSchema.id),
    text: text('text').notNull(),
    createdAt: timestamp('created_at', { mode: 'timestamptz'}).notNull()
});
