import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const postSchema = pgTable('posts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({increment:1, minValue:1, maxValue:2147483647, startWith:1, cache:1}),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  imageBlobUrl: text('image_blob_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const commentSchema = pgTable('comments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity({increment:1, minValue:1, maxValue:2147483647, startWith:1, cache:1}),
    postId: integer('post_id').notNull().references(() => postSchema.id, {onDelete: 'cascade'}),
    text: text('text').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
});
