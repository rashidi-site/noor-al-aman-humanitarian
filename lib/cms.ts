import { env } from "cloudflare:workers";
import { siteContentDefaults } from "@/app/cms-content";
import {
  originalMedia,
  programs as fallbackPrograms,
  type MediaItem,
  type Program,
} from "@/app/site-data";

type RuntimeEnv = {
  DB?: D1Database;
  BUCKET?: R2Bucket;
};

type ProgramRow = {
  id: string;
  slug: string;
  title: string;
  short_title: string;
  summary: string;
  image: string;
  image_alt: string;
  video: string;
  label: string;
  eyebrow: string;
  lead: string;
  body: string;
  bullets_json: string;
  sort_order: number;
  is_published: number;
  published_data: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type ContentRow = {
  key: string;
  draft_value: string;
  published_value: string;
  updated_at: string;
  published_at: string | null;
};

type MediaRow = {
  id: string;
  object_key: string;
  name: string;
  content_type: string;
  size: number;
  alt_text: string;
  created_at: string;
};

export type ProgramInput = {
  id?: string;
  slug?: string;
  title?: string;
  shortTitle?: string;
  summary?: string;
  image?: string;
  imageAlt?: string;
  video?: string;
  label?: string;
  eyebrow?: string;
  lead?: string;
  body?: string;
  bullets?: string[] | string;
  sortOrder?: number;
};

export type ProgramSaveAction = "draft" | "publish" | "unpublish";

export type AdminDashboardData = {
  programs: Program[];
  media: MediaItem[];
  draftContent: Record<string, string>;
  publishedContent: Record<string, string>;
  contentHasChanges: boolean;
};

let initializationPromise: Promise<void> | null = null;

function runtimeEnv(): RuntimeEnv {
  return env as unknown as RuntimeEnv;
}

export function getCmsDatabase(): D1Database {
  const database = runtimeEnv().DB;
  if (!database) {
    throw new Error("The website database is not available.");
  }
  return database;
}

export function getMediaBucket(): R2Bucket {
  const bucket = runtimeEnv().BUCKET;
  if (!bucket) {
    throw new Error("The website media storage is not available.");
  }
  return bucket;
}

export async function ensureCmsReady(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise = initializeCms().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }

  await initializationPromise;
}

async function initializeCms(): Promise<void> {
  const database = getCmsDatabase();

  await database.batch([
    database.prepare(`
      CREATE TABLE IF NOT EXISTS programs (
        id TEXT PRIMARY KEY NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        short_title TEXT NOT NULL,
        summary TEXT NOT NULL,
        image TEXT NOT NULL,
        image_alt TEXT NOT NULL,
        video TEXT NOT NULL DEFAULT '',
        label TEXT NOT NULL,
        eyebrow TEXT NOT NULL,
        lead TEXT NOT NULL,
        body TEXT NOT NULL,
        bullets_json TEXT NOT NULL DEFAULT '[]',
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_published INTEGER NOT NULL DEFAULT 0,
        published_data TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        published_at TEXT
      )
    `),
    database.prepare(`
      CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY NOT NULL,
        draft_value TEXT NOT NULL DEFAULT '',
        published_value TEXT NOT NULL DEFAULT '',
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        published_at TEXT
      )
    `),
    database.prepare(`
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY NOT NULL,
        object_key TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        content_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        alt_text TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
    database.prepare(
      "CREATE INDEX IF NOT EXISTS programs_public_order_idx ON programs (is_published, sort_order)",
    ),
    database.prepare(
      "CREATE INDEX IF NOT EXISTS media_created_at_idx ON media (created_at)",
    ),
  ]);

  const programSeeds = fallbackPrograms.map((program) => {
    const snapshot = publicProgramSnapshot(program);
    return database
      .prepare(
        `INSERT OR IGNORE INTO programs (
          id, slug, title, short_title, summary, image, image_alt, video, label,
          eyebrow, lead, body, bullets_json, sort_order, is_published,
          published_data, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, CURRENT_TIMESTAMP)`,
      )
      .bind(
        program.id,
        program.slug,
        program.title,
        program.shortTitle,
        program.summary,
        program.image,
        program.imageAlt,
        program.video,
        program.label,
        program.eyebrow,
        program.lead,
        program.body,
        JSON.stringify(program.bullets),
        program.sortOrder,
        JSON.stringify(snapshot),
      );
  });

  const contentSeeds = Object.entries(siteContentDefaults).map(([key, value]) =>
    database
      .prepare(
        `INSERT OR IGNORE INTO site_content (
          key, draft_value, published_value, published_at
        ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
      )
      .bind(key, value, value),
  );

  if (programSeeds.length > 0) {
    await database.batch(programSeeds);
  }
  if (contentSeeds.length > 0) {
    await database.batch(contentSeeds);
  }
}

function parseBullets(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function publicProgramSnapshot(program: Program): Program {
  return {
    id: program.id,
    slug: program.slug,
    title: program.title,
    shortTitle: program.shortTitle,
    summary: program.summary,
    image: program.image,
    imageAlt: program.imageAlt,
    video: program.video,
    label: program.label,
    eyebrow: program.eyebrow,
    lead: program.lead,
    body: program.body,
    bullets: program.bullets,
    sortOrder: program.sortOrder,
  };
}

function rowToDraftProgram(row: ProgramRow): Program {
  const program: Program = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortTitle: row.short_title,
    summary: row.summary,
    image: row.image,
    imageAlt: row.image_alt,
    video: row.video ?? "",
    label: row.label,
    eyebrow: row.eyebrow,
    lead: row.lead,
    body: row.body,
    bullets: parseBullets(row.bullets_json),
    sortOrder: row.sort_order,
    isPublished: Boolean(row.is_published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };

  const draftSnapshot = JSON.stringify(publicProgramSnapshot(program));
  program.hasUnpublishedChanges =
    row.is_published === 0 || draftSnapshot !== row.published_data;

  return program;
}

function rowToPublishedProgram(row: ProgramRow): Program | null {
  if (!row.is_published || !row.published_data) return null;

  try {
    const snapshot = JSON.parse(row.published_data) as Program;
    if (!snapshot.id || !snapshot.slug || !snapshot.title) return null;
    return {
      ...snapshot,
      video: typeof snapshot.video === "string" ? snapshot.video : "",
    };
  } catch {
    return null;
  }
}

export async function getPublishedPrograms(): Promise<Program[]> {
  try {
    await ensureCmsReady();
    const result = await getCmsDatabase()
      .prepare(
        "SELECT * FROM programs WHERE is_published = 1 AND published_data IS NOT NULL",
      )
      .all<ProgramRow>();

    return result.results
      .map(rowToPublishedProgram)
      .filter((program): program is Program => program !== null)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return fallbackPrograms.map(publicProgramSnapshot);
  }
}

export async function getAllPrograms(): Promise<Program[]> {
  await ensureCmsReady();
  const result = await getCmsDatabase()
    .prepare("SELECT * FROM programs ORDER BY sort_order ASC, created_at ASC")
    .all<ProgramRow>();

  return result.results.map(rowToDraftProgram);
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeSlug(value: unknown, title: string): string {
  const supplied = cleanText(value, 90).toLowerCase();
  const source = supplied || title.toLowerCase();
  const normalized = source
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

  return normalized || `project-${Date.now()}`;
}

function normalizeBullets(value: ProgramInput["bullets"]): string[] {
  const items = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split("\n")
      : [];

  return items
    .map((item) => cleanText(item, 180))
    .filter(Boolean)
    .slice(0, 8);
}

function normalizeProgramInput(input: ProgramInput, existingId?: string): Program {
  const title = cleanText(input.title, 120);
  const shortTitle = cleanText(input.shortTitle, 70) || title;
  const image = cleanText(input.image, 500);

  if (!title) throw new Error("Project title is required.");
  if (!image) throw new Error("Please choose a project image.");

  const numericSort = Number(input.sortOrder);
  const sortOrder = Number.isFinite(numericSort)
    ? Math.max(0, Math.min(999, Math.round(numericSort)))
    : 0;

  return {
    id: existingId || cleanText(input.id, 100) || crypto.randomUUID(),
    slug: normalizeSlug(input.slug, title),
    title,
    shortTitle,
    summary: cleanText(input.summary, 500),
    image,
    imageAlt: cleanText(input.imageAlt, 250) || title,
    video: cleanText(input.video, 500),
    label: cleanText(input.label, 70) || shortTitle,
    eyebrow: cleanText(input.eyebrow, 100) || shortTitle,
    lead: cleanText(input.lead, 700),
    body: cleanText(input.body, 1800),
    bullets: normalizeBullets(input.bullets),
    sortOrder,
  };
}

export async function saveProgram(
  input: ProgramInput,
  action: ProgramSaveAction,
): Promise<Program> {
  await ensureCmsReady();
  const database = getCmsDatabase();
  const requestedId = cleanText(input.id, 100);
  const existing = requestedId
    ? await database
        .prepare("SELECT * FROM programs WHERE id = ?")
        .bind(requestedId)
        .first<ProgramRow>()
    : null;
  const program = normalizeProgramInput(input, existing?.id);
  const snapshot = JSON.stringify(publicProgramSnapshot(program));

  if (existing) {
    if (action === "publish") {
      await database
        .prepare(
          `UPDATE programs SET
            slug = ?, title = ?, short_title = ?, summary = ?, image = ?,
            image_alt = ?, video = ?, label = ?, eyebrow = ?, lead = ?, body = ?,
            bullets_json = ?, sort_order = ?, is_published = 1,
            published_data = ?, published_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
        )
        .bind(
          program.slug,
          program.title,
          program.shortTitle,
          program.summary,
          program.image,
          program.imageAlt,
          program.video,
          program.label,
          program.eyebrow,
          program.lead,
          program.body,
          JSON.stringify(program.bullets),
          program.sortOrder,
          snapshot,
          program.id,
        )
        .run();
    } else if (action === "unpublish") {
      await database
        .prepare(
          `UPDATE programs SET
            slug = ?, title = ?, short_title = ?, summary = ?, image = ?,
            image_alt = ?, video = ?, label = ?, eyebrow = ?, lead = ?, body = ?,
            bullets_json = ?, sort_order = ?, is_published = 0,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
        )
        .bind(
          program.slug,
          program.title,
          program.shortTitle,
          program.summary,
          program.image,
          program.imageAlt,
          program.video,
          program.label,
          program.eyebrow,
          program.lead,
          program.body,
          JSON.stringify(program.bullets),
          program.sortOrder,
          program.id,
        )
        .run();
    } else {
      await database
        .prepare(
          `UPDATE programs SET
            slug = ?, title = ?, short_title = ?, summary = ?, image = ?,
            image_alt = ?, video = ?, label = ?, eyebrow = ?, lead = ?, body = ?,
            bullets_json = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
        )
        .bind(
          program.slug,
          program.title,
          program.shortTitle,
          program.summary,
          program.image,
          program.imageAlt,
          program.video,
          program.label,
          program.eyebrow,
          program.lead,
          program.body,
          JSON.stringify(program.bullets),
          program.sortOrder,
          program.id,
        )
        .run();
    }
  } else {
    await database
      .prepare(
        `INSERT INTO programs (
          id, slug, title, short_title, summary, image, image_alt, video, label,
          eyebrow, lead, body, bullets_json, sort_order, is_published,
          published_data, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        program.id,
        program.slug,
        program.title,
        program.shortTitle,
        program.summary,
        program.image,
        program.imageAlt,
        program.video,
        program.label,
        program.eyebrow,
        program.lead,
        program.body,
        JSON.stringify(program.bullets),
        program.sortOrder,
        action === "publish" ? 1 : 0,
        action === "publish" ? snapshot : null,
        action === "publish" ? new Date().toISOString() : null,
      )
      .run();
  }

  const saved = await database
    .prepare("SELECT * FROM programs WHERE id = ?")
    .bind(program.id)
    .first<ProgramRow>();
  if (!saved) throw new Error("The project could not be saved.");
  return rowToDraftProgram(saved);
}

export async function deleteProgram(id: string): Promise<void> {
  await ensureCmsReady();
  const result = await getCmsDatabase()
    .prepare("DELETE FROM programs WHERE id = ?")
    .bind(id)
    .run();

  if (!result.meta.changes) {
    throw new Error("Project not found.");
  }
}

async function getContentRows(): Promise<ContentRow[]> {
  await ensureCmsReady();
  const result = await getCmsDatabase()
    .prepare("SELECT * FROM site_content ORDER BY key ASC")
    .all<ContentRow>();
  return result.results;
}

export async function getPublishedSiteContent(): Promise<Record<string, string>> {
  try {
    const rows = await getContentRows();
    const values = { ...siteContentDefaults };
    for (const row of rows) {
      values[row.key] = row.published_value;
    }
    return values;
  } catch {
    return { ...siteContentDefaults };
  }
}

export async function getAdminContent(): Promise<{
  draftContent: Record<string, string>;
  publishedContent: Record<string, string>;
  contentHasChanges: boolean;
}> {
  const rows = await getContentRows();
  const draftContent = { ...siteContentDefaults };
  const publishedContent = { ...siteContentDefaults };

  for (const row of rows) {
    draftContent[row.key] = row.draft_value;
    publishedContent[row.key] = row.published_value;
  }

  return {
    draftContent,
    publishedContent,
    contentHasChanges: Object.keys(siteContentDefaults).some(
      (key) => draftContent[key] !== publishedContent[key],
    ),
  };
}

export async function saveSiteContent(
  values: Record<string, unknown>,
  publish: boolean,
): Promise<Awaited<ReturnType<typeof getAdminContent>>> {
  await ensureCmsReady();
  const database = getCmsDatabase();
  const statements = Object.keys(siteContentDefaults).map((key) => {
    const value =
      typeof values[key] === "string"
        ? values[key].trim().slice(0, 5000)
        : siteContentDefaults[key];

    return publish
      ? database
          .prepare(
            `INSERT INTO site_content (
              key, draft_value, published_value, updated_at, published_at
            ) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET
              draft_value = excluded.draft_value,
              published_value = excluded.published_value,
              updated_at = CURRENT_TIMESTAMP,
              published_at = CURRENT_TIMESTAMP`,
          )
          .bind(key, value, value)
      : database
          .prepare(
            `INSERT INTO site_content (
              key, draft_value, published_value, updated_at
            ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET
              draft_value = excluded.draft_value,
              updated_at = CURRENT_TIMESTAMP`,
          )
          .bind(key, value, siteContentDefaults[key]);
  });

  if (statements.length > 0) {
    await database.batch(statements);
  }
  return getAdminContent();
}

function rowToMedia(row: MediaRow): MediaItem {
  return {
    id: row.id,
    name: row.name,
    url: `/api/media/${row.id}`,
    contentType: row.content_type,
    size: row.size,
    altText: row.alt_text,
    createdAt: row.created_at,
  };
}

export async function getUploadedMedia(): Promise<MediaItem[]> {
  await ensureCmsReady();
  const result = await getCmsDatabase()
    .prepare("SELECT * FROM media ORDER BY created_at DESC")
    .all<MediaRow>();
  return result.results.map(rowToMedia);
}

export async function getAllMedia(): Promise<MediaItem[]> {
  const uploaded = await getUploadedMedia();
  return [...uploaded, ...originalMedia];
}

export async function createMediaRecord(input: {
  id: string;
  objectKey: string;
  name: string;
  contentType: string;
  size: number;
  altText: string;
}): Promise<MediaItem> {
  await ensureCmsReady();
  const database = getCmsDatabase();
  await database
    .prepare(
      `INSERT INTO media (
        id, object_key, name, content_type, size, alt_text
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      input.id,
      input.objectKey,
      input.name,
      input.contentType,
      input.size,
      input.altText,
    )
    .run();

  const row = await database
    .prepare("SELECT * FROM media WHERE id = ?")
    .bind(input.id)
    .first<MediaRow>();
  if (!row) throw new Error("Media metadata could not be saved.");
  return rowToMedia(row);
}

export async function getMediaRecord(id: string): Promise<MediaRow | null> {
  await ensureCmsReady();
  return getCmsDatabase()
    .prepare("SELECT * FROM media WHERE id = ?")
    .bind(id)
    .first<MediaRow>();
}

export async function deleteMediaRecord(id: string): Promise<void> {
  await ensureCmsReady();
  const database = getCmsDatabase();
  const row = await getMediaRecord(id);
  if (!row) throw new Error("Media file not found.");

  const url = `/api/media/${id}`;
  const programReference = await database
    .prepare(
      `SELECT id FROM programs
       WHERE image = ? OR video = ? OR published_data LIKE ? OR published_data LIKE ?
       LIMIT 1`,
    )
    .bind(
      url,
      url,
      `%"image":"${url}"%`,
      `%"video":"${url}"%`,
    )
    .first<{ id: string }>();
  const contentReference = await database
    .prepare(
      `SELECT key FROM site_content
       WHERE draft_value = ? OR published_value = ?
       LIMIT 1`,
    )
    .bind(url, url)
    .first<{ key: string }>();

  if (programReference || contentReference) {
    throw new Error(
      "This file is currently used on the website. Choose a different image or video there before deleting it.",
    );
  }

  await getMediaBucket().delete(row.object_key);
  await database.prepare("DELETE FROM media WHERE id = ?").bind(id).run();
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [programs, media, content] = await Promise.all([
    getAllPrograms(),
    getAllMedia(),
    getAdminContent(),
  ]);

  return {
    programs,
    media,
    ...content,
  };
}
