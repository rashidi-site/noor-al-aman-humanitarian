import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const programs = sqliteTable("programs", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  shortTitle: text("short_title").notNull(),
  summary: text("summary").notNull(),
  image: text("image").notNull(),
  imageAlt: text("image_alt").notNull(),
  video: text("video").notNull().default(""),
  galleryJson: text("gallery_json").notNull().default("[]"),
  label: text("label").notNull(),
  eyebrow: text("eyebrow").notNull(),
  lead: text("lead").notNull(),
  body: text("body").notNull(),
  bulletsJson: text("bullets_json").notNull().default("[]"),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(false),
  publishedData: text("published_data"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  publishedAt: text("published_at"),
});

export const siteContent = sqliteTable("site_content", {
  key: text("key").primaryKey(),
  draftValue: text("draft_value").notNull().default(""),
  publishedValue: text("published_value").notNull().default(""),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  publishedAt: text("published_at"),
});

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  objectKey: text("object_key").notNull().unique(),
  name: text("name").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  altText: text("alt_text").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
