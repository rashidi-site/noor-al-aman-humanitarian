"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import type { ContentField, ContentPage } from "../cms-content";
import type { AdminDashboardData } from "@/lib/cms";
import type { MediaItem, Program } from "../site-data";

type AdminTab = "overview" | "programs" | "content" | "media";

type Notice = {
  type: "success" | "error";
  message: string;
};

type DashboardProps = {
  initialData: AdminDashboardData;
  contentPages: ContentPage[];
  userName: string;
  userEmail: string;
  signOutPath: string;
};

const navigation: Array<{
  id: AdminTab;
  label: string;
  hint: string;
  icon: string;
}> = [
  { id: "overview", label: "جائزہ", hint: "Overview", icon: "⌂" },
  { id: "programs", label: "منصوبے", hint: "Projects", icon: "▦" },
  { id: "content", label: "ویب صفحات", hint: "Pages", icon: "✎" },
  { id: "media", label: "میڈیا", hint: "Images & videos", icon: "▣" },
];

function newProgramTemplate(programs: Program[], media: MediaItem[]): Program {
  const firstImage = media.find((item) => item.contentType.startsWith("image/"));
  const highestOrder = programs.reduce(
    (highest, program) => Math.max(highest, program.sortOrder),
    0,
  );

  return {
    id: "",
    slug: "",
    title: "",
    shortTitle: "",
    summary: "",
    image: firstImage?.url ?? "",
    imageAlt: "",
    label: "",
    eyebrow: "",
    lead: "",
    body: "",
    bullets: [],
    sortOrder: highestOrder + 1,
    isPublished: false,
    hasUnpublishedChanges: true,
  };
}

function humanFileSize(bytes: number): string {
  if (!bytes) return "اصل فائل";
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || "درخواست مکمل نہیں ہو سکی۔");
  }
  return data;
}

export default function AdminDashboard({
  initialData,
  contentPages,
  userName,
  userEmail,
  signOutPath,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [programs, setPrograms] = useState(initialData.programs);
  const [media, setMedia] = useState(initialData.media);
  const [draftContent, setDraftContent] = useState(initialData.draftContent);
  const [publishedContent, setPublishedContent] = useState(
    initialData.publishedContent,
  );
  const [selectedPageId, setSelectedPageId] = useState(
    contentPages[0]?.id ?? "home",
  );
  const [programDraft, setProgramDraft] = useState<Program | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadKey, setUploadKey] = useState(0);

  const selectedPage =
    contentPages.find((page) => page.id === selectedPageId) ?? contentPages[0];
  const contentHasChanges = useMemo(
    () =>
      Object.keys(draftContent).some(
        (key) => draftContent[key] !== publishedContent[key],
      ),
    [draftContent, publishedContent],
  );
  const publishedCount = programs.filter(
    (program) => program.isPublished,
  ).length;
  const draftCount = programs.filter(
    (program) => !program.isPublished || program.hasUnpublishedChanges,
  ).length;
  const uploadedCount = media.filter((item) => !item.isProtected).length;

  function chooseTab(tab: AdminTab) {
    setActiveTab(tab);
    setSidebarOpen(false);
    setNotice(null);
  }

  function showNotice(type: Notice["type"], message: string) {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 6000);
  }

  function startNewProgram() {
    setProgramDraft(newProgramTemplate(programs, media));
    setActiveTab("programs");
    setNotice(null);
  }

  function editProgram(program: Program) {
    setProgramDraft({ ...program, bullets: [...program.bullets] });
    setNotice(null);
  }

  function updateProgram<K extends keyof Program>(key: K, value: Program[K]) {
    setProgramDraft((current) =>
      current ? { ...current, [key]: value } : current,
    );
  }

  async function saveProgram(action: "draft" | "publish" | "unpublish") {
    if (!programDraft) return;
    const actionLabel =
      action === "publish"
        ? "publish"
        : action === "unpublish"
          ? "unpublish"
          : "draft";
    setBusyAction(`program-${actionLabel}`);
    setNotice(null);

    try {
      const isNew = !programDraft.id;
      const response = await fetch(
        isNew
          ? "/api/admin/programs"
          : `/api/admin/programs/${encodeURIComponent(programDraft.id)}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ program: programDraft, action }),
        },
      );
      const data = await readJsonResponse<{ program: Program }>(response);
      setPrograms((current) => {
        const exists = current.some((item) => item.id === data.program.id);
        const next = exists
          ? current.map((item) =>
              item.id === data.program.id ? data.program : item,
            )
          : [...current, data.program];
        return next.sort((a, b) => a.sortOrder - b.sortOrder);
      });
      setProgramDraft(data.program);
      showNotice(
        "success",
        action === "publish"
          ? "منصوبہ شائع ہو گیا ہے اور اب لائیو ویب سائٹ پر موجود ہے۔"
          : action === "unpublish"
            ? "منصوبہ لائیو ویب سائٹ سے ہٹا دیا گیا ہے؛ Draft محفوظ ہے۔"
            : "Draft محفوظ ہو گیا ہے۔ لائیو ویب سائٹ ابھی تبدیل نہیں ہوئی۔",
      );
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "منصوبہ محفوظ نہیں ہو سکا۔",
      );
    } finally {
      setBusyAction(null);
    }
  }

  async function removeProgram() {
    if (!programDraft?.id) return;
    const confirmed = window.confirm(
      `کیا آپ واقعی “${programDraft.title}” کو مکمل طور پر حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں ہوگا۔`,
    );
    if (!confirmed) return;

    setBusyAction("program-delete");
    try {
      const response = await fetch(
        `/api/admin/programs/${encodeURIComponent(programDraft.id)}`,
        { method: "DELETE" },
      );
      await readJsonResponse<{ deleted: boolean }>(response);
      setPrograms((current) =>
        current.filter((item) => item.id !== programDraft.id),
      );
      setProgramDraft(null);
      showNotice("success", "منصوبہ حذف کر دیا گیا ہے۔");
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "منصوبہ حذف نہیں ہو سکا۔",
      );
    } finally {
      setBusyAction(null);
    }
  }

  function updateContent(key: string, value: string) {
    setDraftContent((current) => ({ ...current, [key]: value }));
  }

  async function saveContent(publish: boolean) {
    setBusyAction(publish ? "content-publish" : "content-draft");
    setNotice(null);
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: draftContent, publish }),
      });
      const data = await readJsonResponse<{
        draftContent: Record<string, string>;
        publishedContent: Record<string, string>;
        contentHasChanges: boolean;
      }>(response);
      setDraftContent(data.draftContent);
      setPublishedContent(data.publishedContent);
      showNotice(
        "success",
        publish
          ? "تمام صفحاتی تبدیلیاں شائع ہو گئی ہیں۔"
          : "صفحے کا Draft محفوظ ہو گیا ہے؛ لائیو ویب سائٹ ابھی تبدیل نہیں ہوئی۔",
      );
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "مواد محفوظ نہیں ہو سکا۔",
      );
    } finally {
      setBusyAction(null);
    }
  }

  function onFileChosen(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setUploadFile(file);
    if (file && !uploadAlt) {
      setUploadAlt(file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
    }
  }

  async function uploadMedia() {
    if (!uploadFile) {
      showNotice("error", "پہلے تصویر یا ویڈیو منتخب کریں۔");
      return;
    }

    setBusyAction("media-upload");
    setNotice(null);
    try {
      const form = new FormData();
      form.append("file", uploadFile);
      form.append("altText", uploadAlt);
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: form,
      });
      const data = await readJsonResponse<{ media: MediaItem }>(response);
      setMedia((current) => [data.media, ...current]);
      setUploadFile(null);
      setUploadAlt("");
      setUploadKey((current) => current + 1);
      showNotice(
        "success",
        "میڈیا اپلوڈ ہو گیا ہے۔ اب اسے کسی منصوبے یا صفحے میں منتخب کریں۔",
      );
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "فائل اپلوڈ نہیں ہو سکی۔",
      );
    } finally {
      setBusyAction(null);
    }
  }

  async function removeMedia(item: MediaItem) {
    if (item.isProtected) return;
    const confirmed = window.confirm(
      `کیا آپ واقعی “${item.name}” کو مستقل حذف کرنا چاہتے ہیں؟`,
    );
    if (!confirmed) return;

    setBusyAction(`media-delete-${item.id}`);
    try {
      const response = await fetch(
        `/api/admin/media/${encodeURIComponent(item.id)}`,
        { method: "DELETE" },
      );
      await readJsonResponse<{ deleted: boolean }>(response);
      setMedia((current) => current.filter((mediaItem) => mediaItem.id !== item.id));
      showNotice("success", "فائل حذف کر دی گئی ہے۔");
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "فائل حذف نہیں ہو سکی۔",
      );
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="admin-shell" dir="rtl">
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-brand">
          <img src="/media/noor-al-aman-mark.webp" alt="" />
          <span>
            <strong>Noor Al-Aman</strong>
            <small>Admin Dashboard</small>
          </span>
        </div>
        <nav aria-label="Admin navigation">
          {navigation.map((item) => (
            <button
              className={activeTab === item.id ? "is-active" : ""}
              key={item.id}
              onClick={() => chooseTab(item.id)}
              type="button"
            >
              <span className="admin-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.hint}</small>
              </span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__bottom">
          <a href="/" target="_blank" rel="noreferrer">
            لائیو ویب سائٹ دیکھیں ↗
          </a>
          <a href={signOutPath}>Sign out</a>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="admin-backdrop"
          type="button"
          aria-label="مینو بند کریں"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-button"
            type="button"
            aria-label="مینو کھولیں"
            onClick={() => setSidebarOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="admin-topbar__user">
            <span className="admin-avatar">
              {(userName || userEmail).charAt(0).toUpperCase()}
            </span>
            <span>
              <strong>{userName}</strong>
              <small>{userEmail}</small>
            </span>
          </div>
          <div className="admin-security">
            <span aria-hidden="true">●</span> صرف آپ
          </div>
        </header>

        {notice && (
          <div
            className={`admin-notice admin-notice--${notice.type}`}
            role="status"
          >
            <span>{notice.type === "success" ? "✓" : "!"}</span>
            <p>{notice.message}</p>
            <button type="button" onClick={() => setNotice(null)}>
              ×
            </button>
          </div>
        )}

        <main className="admin-content">
          {activeTab === "overview" && (
            <section>
              <PageHeading
                kicker="Admin Dashboard"
                title="خوش آمدید"
                description="یہاں سے آپ بغیر کوڈنگ کے پوری ویب سائٹ، منصوبے، تصاویر اور ویڈیوز سنبھال سکتے ہیں۔"
              />

              <div className="admin-stats">
                <article>
                  <span className="admin-stat-icon admin-stat-icon--green">✓</span>
                  <div>
                    <strong>{publishedCount}</strong>
                    <p>لائیو منصوبے</p>
                  </div>
                </article>
                <article>
                  <span className="admin-stat-icon admin-stat-icon--gold">✎</span>
                  <div>
                    <strong>{draftCount}</strong>
                    <p>Draft یا نئی تبدیلی</p>
                  </div>
                </article>
                <article>
                  <span className="admin-stat-icon admin-stat-icon--blue">▣</span>
                  <div>
                    <strong>{uploadedCount}</strong>
                    <p>آپ کی اپلوڈ فائلیں</p>
                  </div>
                </article>
              </div>

              <div className="admin-overview-grid">
                <article className="admin-panel admin-quick-panel">
                  <div className="admin-panel__heading">
                    <div>
                      <p className="admin-kicker">فوری کام</p>
                      <h2>آپ کیا کرنا چاہتے ہیں؟</h2>
                    </div>
                  </div>
                  <div className="admin-quick-actions">
                    <button type="button" onClick={startNewProgram}>
                      <span>＋</span>
                      <strong>نیا منصوبہ شامل کریں</strong>
                      <small>پہلے Draft بنے گا</small>
                    </button>
                    <button type="button" onClick={() => chooseTab("media")}>
                      <span>⇧</span>
                      <strong>تصویر یا ویڈیو اپلوڈ کریں</strong>
                      <small>فون سے بھی آسانی سے</small>
                    </button>
                    <button type="button" onClick={() => chooseTab("content")}>
                      <span>✎</span>
                      <strong>صفحے کی عبارت بدلیں</strong>
                      <small>Home, About, Contact وغیرہ</small>
                    </button>
                  </div>
                </article>

                <article className="admin-panel admin-publish-panel">
                  <span className="admin-publish-panel__mark">✓</span>
                  <p className="admin-kicker">محفوظ اشاعت</p>
                  <h2>Draft پہلے، Publish بعد میں</h2>
                  <p>
                    آپ کی محفوظ کی گئی Draft تبدیلیاں عوام کو نظر نہیں آئیں
                    گی۔ جب سب کچھ درست ہو تو Publish دبائیں۔
                  </p>
                  <div className="admin-status-line">
                    <span
                      className={
                        contentHasChanges ? "status-dot status-dot--gold" : "status-dot"
                      }
                    />
                    {contentHasChanges
                      ? "صفحاتی Draft اشاعت کے لیے تیار ہے"
                      : "تمام صفحاتی تبدیلیاں شائع شدہ ہیں"}
                  </div>
                </article>
              </div>

              <article className="admin-panel admin-safety-panel">
                <div className="admin-safety-panel__icon">⌾</div>
                <div>
                  <h2>تصاویر کے انتخاب میں وقار اور رازداری</h2>
                  <p>
                    حقیقی فیلڈ تصاویر استعمال کریں، مگر شناخت، بچوں کی رازداری
                    اور طبی یا قربانی کی گرافک تصاویر سے متعلق احتیاط جاری رکھیں۔
                    موجودہ منتخب Qurbani تصویر تقسیم کے لیے تیار پیکٹس دکھاتی ہے۔
                  </p>
                </div>
              </article>
            </section>
          )}

          {activeTab === "programs" && (
            <section>
              <PageHeading
                kicker="Projects"
                title="منصوبے سنبھالیں"
                description="منصوبہ شامل کریں، ترمیم کریں، Draft محفوظ کریں اور تیار ہونے پر Publish کریں۔"
                action={
                  <button
                    type="button"
                    className="admin-button admin-button--primary"
                    onClick={startNewProgram}
                  >
                    ＋ نیا منصوبہ
                  </button>
                }
              />

              <div className="admin-program-layout">
                <div className="admin-program-list">
                  {programs.map((program) => (
                    <button
                      type="button"
                      key={program.id}
                      className={
                        programDraft?.id === program.id ? "is-selected" : ""
                      }
                      onClick={() => editProgram(program)}
                    >
                      <img src={program.image} alt="" />
                      <span>
                        <strong>{program.title}</strong>
                        <small>
                          <StatusBadge program={program} />
                        </small>
                      </span>
                      <b aria-hidden="true">‹</b>
                    </button>
                  ))}
                  {programs.length === 0 && (
                    <div className="admin-empty">
                      <span>▦</span>
                      <p>ابھی کوئی منصوبہ موجود نہیں۔</p>
                    </div>
                  )}
                </div>

                <div className="admin-program-editor">
                  {programDraft ? (
                    <ProgramEditor
                      program={programDraft}
                      media={media}
                      busyAction={busyAction}
                      onChange={updateProgram}
                      onSave={saveProgram}
                      onDelete={removeProgram}
                      onClose={() => setProgramDraft(null)}
                    />
                  ) : (
                    <div className="admin-editor-placeholder">
                      <span>✎</span>
                      <h2>ترمیم کے لیے منصوبہ منتخب کریں</h2>
                      <p>
                        بائیں فہرست سے منصوبہ منتخب کریں یا نیا منصوبہ شامل کریں۔
                      </p>
                      <button
                        type="button"
                        className="admin-button admin-button--primary"
                        onClick={startNewProgram}
                      >
                        نیا منصوبہ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === "content" && selectedPage && (
            <section>
              <PageHeading
                kicker="Website pages"
                title="ویب صفحات کی ترمیم"
                description="تمام عبارت اور نمایاں تصاویر یہاں سے بدلیں۔ Draft محفوظ ہونے کے بعد الگ سے Publish کریں۔"
                action={
                  <div className="admin-heading-actions">
                    <button
                      type="button"
                      className="admin-button admin-button--secondary"
                      disabled={busyAction !== null}
                      onClick={() => saveContent(false)}
                    >
                      {busyAction === "content-draft"
                        ? "محفوظ ہو رہا ہے…"
                        : "Draft محفوظ کریں"}
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button--publish"
                      disabled={busyAction !== null}
                      onClick={() => saveContent(true)}
                    >
                      {busyAction === "content-publish"
                        ? "شائع ہو رہا ہے…"
                        : "Publish کریں"}
                    </button>
                  </div>
                }
              />

              <div className="admin-content-status">
                <span
                  className={
                    contentHasChanges ? "status-dot status-dot--gold" : "status-dot"
                  }
                />
                {contentHasChanges
                  ? "Draft میں ایسی تبدیلیاں ہیں جو ابھی شائع نہیں ہوئیں۔"
                  : "Draft اور لائیو ویب سائٹ ایک جیسی ہیں۔"}
              </div>

              <div className="admin-page-tabs" role="tablist">
                {contentPages.map((page) => (
                  <button
                    role="tab"
                    aria-selected={selectedPageId === page.id}
                    className={selectedPageId === page.id ? "is-active" : ""}
                    key={page.id}
                    type="button"
                    onClick={() => setSelectedPageId(page.id)}
                  >
                    {page.title}
                  </button>
                ))}
              </div>

              <div className="admin-page-intro">
                <div>
                  <p className="admin-kicker">موجودہ صفحہ</p>
                  <h2>{selectedPage.title}</h2>
                </div>
                <p>{selectedPage.description}</p>
              </div>

              <div className="admin-content-groups">
                {selectedPage.groups.map((group) => (
                  <article className="admin-panel admin-form-panel" key={group.title}>
                    <div className="admin-panel__heading">
                      <div>
                        <h2>{group.title}</h2>
                        <p>{group.description}</p>
                      </div>
                    </div>
                    <div className="admin-form-grid">
                      {group.fields.map((field) => (
                        <ContentEditorField
                          key={field.key}
                          field={field}
                          value={draftContent[field.key] ?? ""}
                          media={media}
                          onChange={(value) => updateContent(field.key, value)}
                        />
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="admin-sticky-actions">
                <span>
                  {contentHasChanges
                    ? "غیر شائع شدہ تبدیلیاں موجود ہیں"
                    : "تمام تبدیلیاں شائع شدہ ہیں"}
                </span>
                <button
                  type="button"
                  className="admin-button admin-button--secondary"
                  disabled={busyAction !== null}
                  onClick={() => saveContent(false)}
                >
                  Draft محفوظ کریں
                </button>
                <button
                  type="button"
                  className="admin-button admin-button--publish"
                  disabled={busyAction !== null}
                  onClick={() => saveContent(true)}
                >
                  Publish کریں
                </button>
              </div>
            </section>
          )}

          {activeTab === "media" && (
            <section>
              <PageHeading
                kicker="Media library"
                title="تصاویر اور ویڈیوز"
                description="فون یا کمپیوٹر سے اصل فائل اپلوڈ کریں، پھر اسے کسی منصوبے یا ویب صفحے میں منتخب کریں۔"
              />

              <article className="admin-panel admin-upload-panel">
                <div className="admin-upload-icon">⇧</div>
                <div className="admin-upload-copy">
                  <h2>نئی فائل اپلوڈ کریں</h2>
                  <p>
                    تصاویر: JPG, PNG, WebP, AVIF یا GIF (25 MB تک) — ویڈیو:
                    MP4 یا WebM (80 MB تک)
                  </p>
                  <div className="admin-upload-fields">
                    <label className="admin-file-input">
                      <input
                        key={uploadKey}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm"
                        onChange={onFileChosen}
                      />
                      <span>
                        {uploadFile ? uploadFile.name : "فائل منتخب کریں"}
                      </span>
                    </label>
                    <label className="admin-field">
                      <span>تصویر/ویڈیو کی وضاحت</span>
                      <input
                        dir="auto"
                        value={uploadAlt}
                        onChange={(event) => setUploadAlt(event.target.value)}
                        placeholder="مثلاً: Family receiving food assistance"
                      />
                    </label>
                    <button
                      type="button"
                      className="admin-button admin-button--primary"
                      disabled={!uploadFile || busyAction !== null}
                      onClick={uploadMedia}
                    >
                      {busyAction === "media-upload"
                        ? "اپلوڈ ہو رہا ہے…"
                        : "اپلوڈ کریں"}
                    </button>
                  </div>
                </div>
              </article>

              <div className="admin-media-heading">
                <div>
                  <p className="admin-kicker">Media library</p>
                  <h2>{media.length} فائلیں</h2>
                </div>
                <p>
                  اصل منتخب فائلیں محفوظ ہیں؛ آپ کی نئی اپلوڈ فائلیں حذف کی جا
                  سکتی ہیں۔
                </p>
              </div>

              <div className="admin-media-grid">
                {media.map((item) => (
                  <article className="admin-media-card" key={item.id}>
                    <div className="admin-media-card__preview">
                      {item.contentType.startsWith("image/") ? (
                        <img src={item.url} alt={item.altText} loading="lazy" />
                      ) : (
                        <video src={item.url} muted playsInline preload="metadata" />
                      )}
                      <span>
                        {item.contentType.startsWith("image/")
                          ? "تصویر"
                          : "ویڈیو"}
                      </span>
                    </div>
                    <div className="admin-media-card__body">
                      <strong title={item.name}>{item.name}</strong>
                      <p title={item.altText}>{item.altText || "کوئی وضاحت نہیں"}</p>
                      <div>
                        <small>{humanFileSize(item.size)}</small>
                        {item.isProtected ? (
                          <span className="admin-protected">محفوظ اصل</span>
                        ) : (
                          <button
                            type="button"
                            disabled={busyAction !== null}
                            onClick={() => removeMedia(item)}
                          >
                            {busyAction === `media-delete-${item.id}`
                              ? "حذف…"
                              : "حذف کریں"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function PageHeading({
  kicker,
  title,
  description,
  action,
}: {
  kicker: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-page-heading">
      <div>
        <p className="admin-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ program }: { program: Program }) {
  if (!program.isPublished) {
    return <span className="admin-badge admin-badge--draft">Draft</span>;
  }
  if (program.hasUnpublishedChanges) {
    return (
      <span className="admin-badge admin-badge--changes">Live + Draft</span>
    );
  }
  return <span className="admin-badge admin-badge--live">Live</span>;
}

function ProgramEditor({
  program,
  media,
  busyAction,
  onChange,
  onSave,
  onDelete,
  onClose,
}: {
  program: Program;
  media: MediaItem[];
  busyAction: string | null;
  onChange: <K extends keyof Program>(key: K, value: Program[K]) => void;
  onSave: (action: "draft" | "publish" | "unpublish") => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const images = media.filter((item) => item.contentType.startsWith("image/"));
  const selectedImage = images.find((item) => item.url === program.image);

  return (
    <article className="admin-panel admin-form-panel admin-program-form">
      <div className="admin-panel__heading">
        <div>
          <p className="admin-kicker">
            {program.id ? "منصوبہ ترمیم کریں" : "نیا منصوبہ"}
          </p>
          <h2>{program.title || "نیا منصوبہ"}</h2>
          <div className="admin-editor-status">
            <StatusBadge program={program} />
            {program.hasUnpublishedChanges && program.isPublished && (
              <span>Draft تبدیلیاں ابھی لائیو نہیں ہیں</span>
            )}
          </div>
        </div>
        <button
          className="admin-close-button"
          type="button"
          aria-label="ایڈیٹر بند کریں"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="admin-form-grid">
        <label className="admin-field">
          <span>منصوبے کا مکمل عنوان *</span>
          <input
            dir="auto"
            value={program.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="مثلاً: Emergency Food Assistance"
          />
        </label>
        <label className="admin-field">
          <span>مختصر عنوان</span>
          <input
            dir="auto"
            value={program.shortTitle}
            onChange={(event) => onChange("shortTitle", event.target.value)}
            placeholder="مثلاً: Food support"
          />
        </label>
        <label className="admin-field">
          <span>URL نام</span>
          <input
            dir="ltr"
            value={program.slug}
            onChange={(event) => onChange("slug", event.target.value)}
            placeholder="خالی چھوڑیں تو خود بن جائے گا"
          />
          <small>مثال: clean-water — بعد میں بدلنے سے پرانا لنک بدل سکتا ہے۔</small>
        </label>
        <label className="admin-field">
          <span>ترتیب نمبر</span>
          <input
            dir="ltr"
            type="number"
            min="0"
            max="999"
            value={program.sortOrder}
            onChange={(event) =>
              onChange("sortOrder", Number(event.target.value))
            }
          />
          <small>کم نمبر والا منصوبہ پہلے دکھائی دے گا۔</small>
        </label>
        <label className="admin-field admin-field--full">
          <span>کارڈ کی مختصر تفصیل</span>
          <textarea
            dir="auto"
            rows={3}
            value={program.summary}
            onChange={(event) => onChange("summary", event.target.value)}
          />
        </label>
        <label className="admin-field">
          <span>تصویر پر چھوٹا لیبل</span>
          <input
            dir="auto"
            value={program.label}
            onChange={(event) => onChange("label", event.target.value)}
            placeholder="مثلاً: Urgent care"
          />
        </label>
        <label className="admin-field">
          <span>تفصیلی حصے کی چھوٹی سرخی</span>
          <input
            dir="auto"
            value={program.eyebrow}
            onChange={(event) => onChange("eyebrow", event.target.value)}
          />
        </label>
        <div className="admin-field admin-field--full">
          <span>منصوبے کی مرکزی تصویر *</span>
          <div className="admin-media-picker">
            {selectedImage && (
              <img src={selectedImage.url} alt={selectedImage.altText} />
            )}
            <select
              dir="auto"
              value={program.image}
              onChange={(event) => onChange("image", event.target.value)}
            >
              <option value="">تصویر منتخب کریں</option>
              {images.map((item) => (
                <option key={item.id} value={item.url}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="admin-field admin-field--full">
          <span>تصویر کی وضاحت (Accessibility)</span>
          <input
            dir="auto"
            value={program.imageAlt}
            onChange={(event) => onChange("imageAlt", event.target.value)}
            placeholder="تصویر میں کیا دکھائی دے رہا ہے؟"
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>نمایاں تعارفی عبارت</span>
          <textarea
            dir="auto"
            rows={3}
            value={program.lead}
            onChange={(event) => onChange("lead", event.target.value)}
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>مکمل تفصیل</span>
          <textarea
            dir="auto"
            rows={6}
            value={program.body}
            onChange={(event) => onChange("body", event.target.value)}
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>اہم نکات — ہر لائن پر ایک</span>
          <textarea
            dir="auto"
            rows={5}
            value={program.bullets.join("\n")}
            onChange={(event) =>
              onChange("bullets", event.target.value.split("\n"))
            }
          />
        </label>
      </div>

      <div className="admin-form-actions">
        {program.id && (
          <button
            type="button"
            className="admin-button admin-button--danger-text"
            disabled={busyAction !== null}
            onClick={onDelete}
          >
            {busyAction === "program-delete" ? "حذف ہو رہا ہے…" : "حذف کریں"}
          </button>
        )}
        <span className="admin-form-actions__spacer" />
        {program.isPublished && (
          <button
            type="button"
            className="admin-button admin-button--quiet"
            disabled={busyAction !== null}
            onClick={() => onSave("unpublish")}
          >
            لائیو سے ہٹائیں
          </button>
        )}
        <button
          type="button"
          className="admin-button admin-button--secondary"
          disabled={busyAction !== null}
          onClick={() => onSave("draft")}
        >
          {busyAction === "program-draft"
            ? "محفوظ ہو رہا ہے…"
            : "Draft محفوظ کریں"}
        </button>
        <button
          type="button"
          className="admin-button admin-button--publish"
          disabled={busyAction !== null}
          onClick={() => onSave("publish")}
        >
          {busyAction === "program-publish"
            ? "شائع ہو رہا ہے…"
            : "Publish کریں"}
        </button>
      </div>
    </article>
  );
}

function ContentEditorField({
  field,
  value,
  media,
  onChange,
}: {
  field: ContentField;
  value: string;
  media: MediaItem[];
  onChange: (value: string) => void;
}) {
  const isMedia = field.type === "image" || field.type === "video";
  if (isMedia) {
    const choices = media.filter((item) =>
      field.type === "image"
        ? item.contentType.startsWith("image/")
        : item.contentType.startsWith("video/"),
    );
    const selected = choices.find((item) => item.url === value);

    return (
      <div className="admin-field admin-field--full">
        <span>{field.label}</span>
        <div className="admin-media-picker">
          {selected &&
            (field.type === "image" ? (
              <img src={selected.url} alt={selected.altText} />
            ) : (
              <video src={selected.url} muted playsInline preload="metadata" />
            ))}
          <select
            dir="auto"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">میڈیا منتخب کریں</option>
            {choices.map((item) => (
              <option key={item.id} value={item.url}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  const multiline = field.type === "textarea";
  return (
    <label
      className={`admin-field ${multiline ? "admin-field--full" : ""}`}
    >
      <span>{field.label}</span>
      {multiline ? (
        <textarea
          dir="auto"
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          dir={field.type === "url" || field.type === "email" ? "ltr" : "auto"}
          type={
            field.type === "email" ||
            field.type === "tel" ||
            field.type === "url"
              ? field.type
              : "text"
          }
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {field.help && <small>{field.help}</small>}
    </label>
  );
}
