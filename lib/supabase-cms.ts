import { siteContentDefaults } from "@/app/cms-content";
import {
  originalMedia,
  programs as fallbackPrograms,
  type MediaItem,
  type Program,
  type ProjectMedia,
} from "@/app/site-data";
import {
  getSupabaseAdmin,
  getSupabaseConfig,
  isSupabaseConfigured,
} from "./supabase";

type ProgramRow = {
  id: string;
  slug: string;
  title: string;
  short_title: string;
  summary: string;
  image: string;
  image_alt: string;
  video: string;
  gallery_json: ProjectMedia[];
  label: string;
  eyebrow: string;
  lead: string;
  body: string;
  bullets_json: string[];
  sort_order: number;
  is_published: boolean;
  published_data: Program | null;
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
  public_url: string;
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
  gallery?: ProjectMedia[];
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
    gallery: program.gallery,
    label: program.label,
    eyebrow: program.eyebrow,
    lead: program.lead,
    body: program.body,
    bullets: program.bullets,
    sortOrder: program.sortOrder,
  };
}

function throwOnError(error: { message: string } | null): void {
  if (error) throw new Error(error.message);
}

export async function ensureCmsReady(): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured.");
  }

  if (!initializationPromise) {
    initializationPromise = initializeCms().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }
  await initializationPromise;
}

async function initializeCms(): Promise<void> {
  const client = getSupabaseAdmin();
  const programRows = fallbackPrograms.map((program) => ({
    id: program.id,
    slug: program.slug,
    title: program.title,
    short_title: program.shortTitle,
    summary: program.summary,
    image: program.image,
    image_alt: program.imageAlt,
    video: program.video,
    gallery_json: program.gallery,
    label: program.label,
    eyebrow: program.eyebrow,
    lead: program.lead,
    body: program.body,
    bullets_json: program.bullets,
    sort_order: program.sortOrder,
    is_published: true,
    published_data: publicProgramSnapshot(program),
    published_at: new Date().toISOString(),
  }));
  const contentRows = Object.entries(siteContentDefaults).map(([key, value]) => ({
    key,
    draft_value: value,
    published_value: value,
    published_at: new Date().toISOString(),
  }));

  const programResult = await client
    .from("programs")
    .upsert(programRows, { onConflict: "id", ignoreDuplicates: true });
  throwOnError(programResult.error);

  const contentResult = await client
    .from("site_content")
    .upsert(contentRows, { onConflict: "key", ignoreDuplicates: true });
  throwOnError(contentResult.error);
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
    video: row.video || "",
    gallery: Array.isArray(row.gallery_json) ? row.gallery_json : [],
    label: row.label,
    eyebrow: row.eyebrow,
    lead: row.lead,
    body: row.body,
    bullets: Array.isArray(row.bullets_json) ? row.bullets_json : [],
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
  program.hasUnpublishedChanges =
    !row.is_published ||
    JSON.stringify(publicProgramSnapshot(program)) !==
      JSON.stringify(row.published_data);
  return program;
}

export async function getPublishedPrograms(): Promise<Program[]> {
  if (!isSupabaseConfigured()) {
    return fallbackPrograms.map(publicProgramSnapshot);
  }

  try {
    await ensureCmsReady();
    const { data, error } = await getSupabaseAdmin()
      .from("programs")
      .select("*")
      .eq("is_published", true)
      .not("published_data", "is", null)
      .order("sort_order", { ascending: true });
    throwOnError(error);
    return ((data ?? []) as ProgramRow[])
      .map((row) => row.published_data)
      .filter((program): program is Program => Boolean(program));
  } catch {
    return fallbackPrograms.map(publicProgramSnapshot);
  }
}

export async function getAllPrograms(): Promise<Program[]> {
  await ensureCmsReady();
  const { data, error } = await getSupabaseAdmin()
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });
  throwOnError(error);
  return ((data ?? []) as ProgramRow[]).map(rowToDraftProgram);
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeSlug(value: unknown, title: string): string {
  const source = cleanText(value, 90).toLowerCase() || title.toLowerCase();
  return (
    source
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) || `project-${Date.now()}`
  );
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

function normalizeGallery(value: ProgramInput["gallery"]): ProjectMedia[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value
    .filter((item) => {
      if (!item?.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    })
    .slice(0, 24)
    .map((item) => ({
      url: cleanText(item.url, 500),
      type: item.type === "video" ? "video" : "image",
      altText: cleanText(item.altText, 250) || "Project field media",
    }));
}

function normalizeProgramInput(input: ProgramInput, existingId?: string): Program {
  const title = cleanText(input.title, 120);
  const image = cleanText(input.image, 500);
  if (!title) throw new Error("Project title is required.");
  if (!image) throw new Error("Please choose a project image.");

  const numericSort = Number(input.sortOrder);
  return {
    id: existingId || cleanText(input.id, 100) || crypto.randomUUID(),
    slug: normalizeSlug(input.slug, title),
    title,
    shortTitle: cleanText(input.shortTitle, 70) || title,
    summary: cleanText(input.summary, 500),
    image,
    imageAlt: cleanText(input.imageAlt, 250) || title,
    video: cleanText(input.video, 500),
    gallery: normalizeGallery(input.gallery),
    label: cleanText(input.label, 70) || title,
    eyebrow: cleanText(input.eyebrow, 100) || title,
    lead: cleanText(input.lead, 700),
    body: cleanText(input.body, 1800),
    bullets: normalizeBullets(input.bullets),
    sortOrder: Number.isFinite(numericSort)
      ? Math.max(0, Math.min(999, Math.round(numericSort)))
      : 0,
  };
}

function programToRow(
  program: Program,
  action: ProgramSaveAction,
  existing: ProgramRow | null,
) {
  const publish = action === "publish";
  const unpublish = action === "unpublish";
  return {
    id: program.id,
    slug: program.slug,
    title: program.title,
    short_title: program.shortTitle,
    summary: program.summary,
    image: program.image,
    image_alt: program.imageAlt,
    video: program.video,
    gallery_json: program.gallery,
    label: program.label,
    eyebrow: program.eyebrow,
    lead: program.lead,
    body: program.body,
    bullets_json: program.bullets,
    sort_order: program.sortOrder,
    is_published: publish ? true : unpublish ? false : existing?.is_published ?? false,
    published_data: publish
      ? publicProgramSnapshot(program)
      : existing?.published_data ?? null,
    published_at: publish
      ? new Date().toISOString()
      : existing?.published_at ?? null,
    updated_at: new Date().toISOString(),
  };
}

export async function saveProgram(
  input: ProgramInput,
  action: ProgramSaveAction,
): Promise<Program> {
  await ensureCmsReady();
  const client = getSupabaseAdmin();
  const requestedId = cleanText(input.id, 100);
  let existing: ProgramRow | null = null;
  if (requestedId) {
    const result = await client
      .from("programs")
      .select("*")
      .eq("id", requestedId)
      .maybeSingle();
    throwOnError(result.error);
    existing = result.data as ProgramRow | null;
  }

  const program = normalizeProgramInput(input, existing?.id);
  const result = await client
    .from("programs")
    .upsert(programToRow(program, action, existing), { onConflict: "id" })
    .select("*")
    .single();
  throwOnError(result.error);
  return rowToDraftProgram(result.data as ProgramRow);
}

export async function deleteProgram(id: string): Promise<void> {
  await ensureCmsReady();
  const { error } = await getSupabaseAdmin().from("programs").delete().eq("id", id);
  throwOnError(error);
}

async function getContentRows(): Promise<ContentRow[]> {
  await ensureCmsReady();
  const { data, error } = await getSupabaseAdmin()
    .from("site_content")
    .select("*")
    .order("key");
  throwOnError(error);
  return (data ?? []) as ContentRow[];
}

export async function getPublishedSiteContent(): Promise<Record<string, string>> {
  if (!isSupabaseConfigured()) return { ...siteContentDefaults };
  try {
    const rows = await getContentRows();
    const values = { ...siteContentDefaults };
    for (const row of rows) values[row.key] = row.published_value;
    return values;
  } catch {
    return { ...siteContentDefaults };
  }
}

export async function getAdminContent() {
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
) {
  await ensureCmsReady();
  const now = new Date().toISOString();
  const existing = await getAdminContent();
  const rows = Object.keys(siteContentDefaults).map((key) => {
    const value =
      typeof values[key] === "string"
        ? values[key].trim().slice(0, 5000)
        : siteContentDefaults[key];
    return {
      key,
      draft_value: value,
      published_value: publish ? value : existing.publishedContent[key],
      updated_at: now,
      published_at: publish ? now : null,
    };
  });
  const { error } = await getSupabaseAdmin()
    .from("site_content")
    .upsert(rows, { onConflict: "key" });
  throwOnError(error);
  return getAdminContent();
}

function rowToMedia(row: MediaRow): MediaItem {
  return {
    id: row.id,
    name: row.name,
    url: row.public_url,
    contentType: row.content_type,
    size: row.size,
    altText: row.alt_text,
    createdAt: row.created_at,
  };
}

export async function getUploadedMedia(): Promise<MediaItem[]> {
  await ensureCmsReady();
  const { data, error } = await getSupabaseAdmin()
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  throwOnError(error);
  return ((data ?? []) as MediaRow[]).map(rowToMedia);
}

export async function getAllMedia(): Promise<MediaItem[]> {
  if (!isSupabaseConfigured()) return originalMedia;
  return [...(await getUploadedMedia()), ...originalMedia];
}

export async function uploadMediaFile(input: {
  file: File;
  altText: string;
}): Promise<MediaItem> {
  await ensureCmsReady();
  const client = getSupabaseAdmin();
  const config = getSupabaseConfig();
  const id = crypto.randomUUID();
  const safeName =
    input.file.name
      .normalize("NFKD")
      .replace(/[^\w.-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(-120) || "upload";
  const objectKey = `uploads/${id}/${safeName}`;
  const bytes = await input.file.arrayBuffer();
  const upload = await client.storage
    .from(config.mediaBucket)
    .upload(objectKey, bytes, {
      contentType: input.file.type,
      upsert: false,
    });
  throwOnError(upload.error);

  const publicUrl = client.storage
    .from(config.mediaBucket)
    .getPublicUrl(objectKey).data.publicUrl;
  const record = {
    id,
    object_key: objectKey,
    name: input.file.name.slice(0, 250),
    content_type: input.file.type,
    size: input.file.size,
    alt_text:
      input.altText.trim().slice(0, 250) ||
      input.file.name.replace(/\.[^.]+$/, ""),
    public_url: publicUrl,
  };
  const result = await client.from("media").insert(record).select("*").single();
  if (result.error) {
    await client.storage.from(config.mediaBucket).remove([objectKey]);
    throwOnError(result.error);
  }
  return rowToMedia(result.data as MediaRow);
}

export async function getMediaRecord(id: string): Promise<MediaRow | null> {
  await ensureCmsReady();
  const result = await getSupabaseAdmin()
    .from("media")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  throwOnError(result.error);
  return result.data as MediaRow | null;
}

export async function deleteMediaRecord(id: string): Promise<void> {
  await ensureCmsReady();
  const client = getSupabaseAdmin();
  const row = await getMediaRecord(id);
  if (!row) throw new Error("Media file not found.");

  const [programResult, contentResult] = await Promise.all([
    client
      .from("programs")
      .select("image,video,gallery_json,published_data"),
    client.from("site_content").select("draft_value,published_value"),
  ]);
  throwOnError(programResult.error);
  throwOnError(contentResult.error);
  const referenced = [...(programResult.data ?? []), ...(contentResult.data ?? [])]
    .some((item) => JSON.stringify(item).includes(row.public_url));
  if (referenced) {
    throw new Error(
      "This file is currently used on the website. Choose different media before deleting it.",
    );
  }

  const storageResult = await client.storage
    .from(getSupabaseConfig().mediaBucket)
    .remove([row.object_key]);
  throwOnError(storageResult.error);
  const deleteResult = await client.from("media").delete().eq("id", id);
  throwOnError(deleteResult.error);
}

export async function saveContactSubmission(input: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("The contact form is not configured yet.");
  }
  const { error } = await getSupabaseAdmin().from("contact_submissions").insert({
    name: input.name.trim().slice(0, 120),
    email: input.email.trim().toLowerCase().slice(0, 180),
    phone: input.phone.trim().slice(0, 60),
    subject: input.subject.trim().slice(0, 160),
    message: input.message.trim().slice(0, 5000),
  });
  throwOnError(error);
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [programs, media, content] = await Promise.all([
    getAllPrograms(),
    getAllMedia(),
    getAdminContent(),
  ]);
  return { programs, media, ...content };
}
