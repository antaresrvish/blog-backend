CREATE TABLE IF NOT EXISTS "posts" (
	"id" integer PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"image_blob_url" text NOT NULL,
	"created_at" timestamp NOT NULL
);
