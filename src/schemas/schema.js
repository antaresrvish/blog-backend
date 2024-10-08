import { integer, pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const postSchema = pgTable('posts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({increment:1, minValue:1, maxValue:2147483647, startWith:1, cache:1}),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  tags: text('tags').array().notNull(),
  author: text('author').notNull(),
  imageBlobUrl: text('image_blob_url').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const commentSchema = pgTable('comments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity({increment:1, minValue:1, maxValue:2147483647, startWith:1, cache:1}),
    postId: integer('post_id').notNull().references(() => postSchema.id, {onDelete: 'cascade'}),
    text: text('text').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
});

export const userType = pgEnum('role', ['user', 'admin']);

export const userSchema = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({increment:1, minValue:1, maxValue:2147483647, startWith:1, cache:1}),
  username: text('username').notNull(),
  password: text('password').notNull(),
  role: userType('role').default('user').notNull(),
})
