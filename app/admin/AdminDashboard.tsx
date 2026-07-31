"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import type { ContentField, ContentPage } from "../cms-content";
import type {
  AdminDashboardData,
  ContactSubmission,
} from "@/lib/supabase-cms";
import type { MediaItem, Program, ProjectMedia } from "../site-data";

type AdminTab = "overview" | "messages" | "programs" | "content" | "media";

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
  { id: "overview", label: "Overview", hint: "Dashboard summary", icon: "⌂" },
  { id: "messages", label: "Messages", hint: "Contact inbox", icon: "✉" },
  { id: "programs", label: "Projects", hint: "Manage programmes", icon: "▦" },
  { id: "content", label: "Website Pages", hint: "Edit page content", icon: "✎" },
  { id: "media", label: "Media", hint: "Images and videos", icon: "▣" },
];

function newProgramTemplate(programs: Program[]): Program {
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
    image: "",
    imageAlt: "",
    video: "",
    gallery: [],
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
  if (!bytes) return "Original file";
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function messageDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || "The request could not be completed.");
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
  const [messages, setMessages] = useState(initialData.messages);
  const [selectedMessageId, setSelectedMessageId] = useState(
    initialData.messages[0]?.id ?? "",
  );
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
  const unreadCount = messages.filter((message) => message.status === "new").length;
  const selectedMessage =
    messages.find((message) => message.id === selectedMessageId) ?? messages[0];

  function chooseTab(tab: AdminTab) {
    setActiveTab(tab);
    setSidebarOpen(false);
    setNotice(null);
  }

  function showNotice(type: Notice["type"], message: string) {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 6000);
  }

  async function openMessage(message: ContactSubmission) {
    setSelectedMessageId(message.id);
    if (message.status === "read") return;

    setMessages((current) =>
      current.map((item) =>
        item.id === message.id ? { ...item, status: "read" } : item,
      ),
    );
    try {
      const response = await fetch(
        `/api/admin/messages/${encodeURIComponent(message.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "read" }),
        },
      );
      const data = await readJsonResponse<{ message: ContactSubmission }>(response);
      setMessages((current) =>
        current.map((item) => (item.id === data.message.id ? data.message : item)),
      );
    } catch (error) {
      setMessages((current) =>
        current.map((item) =>
          item.id === message.id ? { ...item, status: "new" } : item,
        ),
      );
      showNotice(
        "error",
        error instanceof Error ? error.message : "The message could not be updated.",
      );
    }
  }

  async function setMessageUnread(message: ContactSubmission) {
    setBusyAction(`message-unread-${message.id}`);
    try {
      const response = await fetch(
        `/api/admin/messages/${encodeURIComponent(message.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "new" }),
        },
      );
      const data = await readJsonResponse<{ message: ContactSubmission }>(response);
      setMessages((current) =>
        current.map((item) => (item.id === data.message.id ? data.message : item)),
      );
      showNotice("success", "Message marked as unread.");
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "The message could not be updated.",
      );
    } finally {
      setBusyAction(null);
    }
  }

  async function removeMessage(message: ContactSubmission) {
    const confirmed = window.confirm(
      `Permanently delete the message from “${message.name}”?`,
    );
    if (!confirmed) return;

    setBusyAction(`message-delete-${message.id}`);
    try {
      const response = await fetch(
        `/api/admin/messages/${encodeURIComponent(message.id)}`,
        { method: "DELETE" },
      );
      await readJsonResponse<{ deleted: boolean }>(response);
      setMessages((current) => current.filter((item) => item.id !== message.id));
      setSelectedMessageId("");
      showNotice("success", "Message deleted.");
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "The message could not be deleted.",
      );
    } finally {
      setBusyAction(null);
    }
  }

  function startNewProgram() {
    setProgramDraft(newProgramTemplate(programs));
    setActiveTab("programs");
    setNotice(null);
  }

  function editProgram(program: Program) {
    setProgramDraft({
      ...program,
      bullets: [...program.bullets],
      gallery: [...(program.gallery ?? [])],
    });
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
          ? "The project has been published and is now visible on the live website."
          : action === "unpublish"
            ? "The project has been removed from the live website. Its draft is still saved."
            : "Draft saved. The live website has not changed.",
      );
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "The project could not be saved.",
      );
    } finally {
      setBusyAction(null);
    }
  }

  async function removeProgram() {
    if (!programDraft?.id) return;
    const confirmed = window.confirm(
      `Permanently delete “${programDraft.title}”? This action cannot be undone.`,
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
      showNotice("success", "The project has been deleted.");
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "The project could not be deleted.",
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
          ? "All website page changes have been published."
          : "Page draft saved. The live website has not changed.",
      );
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "The website content could not be saved.",
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

  async function createUploadedMedia(
    file: File,
    altText: string,
  ): Promise<MediaItem> {
    const form = new FormData();
    form.append("file", file);
    form.append("altText", altText);
    const response = await fetch("/api/admin/media", {
      method: "POST",
      body: form,
    });
    const data = await readJsonResponse<{ media: MediaItem }>(response);
    setMedia((current) => [data.media, ...current]);
    return data.media;
  }

  async function uploadMedia() {
    if (!uploadFile) {
      showNotice("error", "Select an image or video first.");
      return;
    }

    setBusyAction("media-upload");
    setNotice(null);
    try {
      await createUploadedMedia(uploadFile, uploadAlt);
      setUploadFile(null);
      setUploadAlt("");
      setUploadKey((current) => current + 1);
      showNotice(
        "success",
        "Media uploaded. You can now select it for a project or website page.",
      );
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "The file could not be uploaded.",
      );
    } finally {
      setBusyAction(null);
    }
  }

  async function uploadProjectMedia(files: File[]): Promise<boolean> {
    if (files.length === 0) return false;
    if (files.length > 12) {
      showNotice("error", "Upload up to 12 files at a time.");
      return false;
    }

    setBusyAction("program-media-upload");
    setNotice(null);
    try {
      const uploaded = await Promise.all(
        files.map((file) =>
          createUploadedMedia(
            file,
            file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          ),
        ),
      );

      setProgramDraft((current) => {
        if (!current) return current;

        let image = current.image;
        let imageAlt = current.imageAlt;
        const gallery = [...(current.gallery ?? [])];

        for (const item of uploaded) {
          const projectItem: ProjectMedia = {
            url: item.url,
            type: item.contentType.startsWith("video/") ? "video" : "image",
            altText: item.altText,
          };

          if (!image && projectItem.type === "image") {
            image = projectItem.url;
            imageAlt = projectItem.altText;
          } else if (!gallery.some((entry) => entry.url === projectItem.url)) {
            gallery.push(projectItem);
          }
        }

        return { ...current, image, imageAlt, gallery };
      });
      showNotice(
        "success",
        `${uploaded.length} ${uploaded.length === 1 ? "file" : "files"} uploaded and added to this project.`,
      );
      return true;
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "The file could not be uploaded.",
      );
      return false;
    } finally {
      setBusyAction(null);
    }
  }

  async function removeMedia(item: MediaItem) {
    if (item.isProtected) return;
    const confirmed = window.confirm(
      `Permanently delete “${item.name}”?`,
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
      showNotice("success", "The file has been deleted.");
    } catch (error) {
      showNotice(
        "error",
        error instanceof Error ? error.message : "The file could not be deleted.",
      );
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="admin-shell" dir="ltr">
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
              {item.id === "messages" && unreadCount > 0 && (
                <em className="admin-nav-count" aria-label={`${unreadCount} unread messages`}>
                  {unreadCount}
                </em>
              )}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__bottom">
          <a href="/" target="_blank" rel="noreferrer">
            View live website ↗
          </a>
          <a href={signOutPath}>Sign out</a>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="admin-backdrop"
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-button"
            type="button"
            aria-label="Open menu"
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
            <span aria-hidden="true">●</span> Owner only
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
                title="Welcome"
                description="Manage your entire website, projects, images, and videos here without writing any code."
              />

              <div className="admin-stats">
                <article>
                  <span className="admin-stat-icon admin-stat-icon--green">✓</span>
                  <div>
                    <strong>{publishedCount}</strong>
                    <p>Live projects</p>
                  </div>
                </article>
                <article>
                  <span className="admin-stat-icon admin-stat-icon--gold">✎</span>
                  <div>
                    <strong>{draftCount}</strong>
                    <p>Drafts or new changes</p>
                  </div>
                </article>
                <article>
                  <span className="admin-stat-icon admin-stat-icon--blue">▣</span>
                  <div>
                    <strong>{uploadedCount}</strong>
                    <p>Your uploaded files</p>
                  </div>
                </article>
                <article>
                  <span className="admin-stat-icon admin-stat-icon--violet">✉</span>
                  <div>
                    <strong>{unreadCount}</strong>
                    <p>Unread messages</p>
                  </div>
                </article>
              </div>

              <div className="admin-overview-grid">
                <article className="admin-panel admin-quick-panel">
                  <div className="admin-panel__heading">
                    <div>
                      <p className="admin-kicker">Quick actions</p>
                      <h2>What would you like to do?</h2>
                    </div>
                  </div>
                  <div className="admin-quick-actions">
                    <button type="button" onClick={() => chooseTab("messages")}>
                      <span>✉</span>
                      <strong>Open messages</strong>
                      <small>{unreadCount ? `${unreadCount} unread` : "Inbox is up to date"}</small>
                    </button>
                    <button type="button" onClick={startNewProgram}>
                      <span>＋</span>
                      <strong>Add a new project</strong>
                      <small>It starts as a draft</small>
                    </button>
                    <button type="button" onClick={() => chooseTab("media")}>
                      <span>⇧</span>
                      <strong>Upload an image or video</strong>
                      <small>Works easily from your phone</small>
                    </button>
                    <button type="button" onClick={() => chooseTab("content")}>
                      <span>✎</span>
                      <strong>Edit website content</strong>
                      <small>Home, About, Contact, and more</small>
                    </button>
                  </div>
                </article>

                <article className="admin-panel admin-publish-panel">
                  <span className="admin-publish-panel__mark">✓</span>
                  <p className="admin-kicker">Safe publishing</p>
                  <h2>Draft first, publish when ready</h2>
                  <p>
                    Saved draft changes remain private. Publish only when
                    everything is ready for the live website.
                  </p>
                  <div className="admin-status-line">
                    <span
                      className={
                        contentHasChanges ? "status-dot status-dot--gold" : "status-dot"
                      }
                    />
                    {contentHasChanges
                      ? "A page draft is ready to publish"
                      : "All page changes are published"}
                  </div>
                </article>
              </div>

              <article className="admin-panel admin-safety-panel">
                <div className="admin-safety-panel__icon">⌾</div>
                <div>
                  <h2>Protect dignity and privacy in every image</h2>
                  <p>
                    Use authentic field images while protecting identities and
                    children&apos;s privacy. Avoid graphic medical or Qurbani
                    imagery. The selected Qurbani image shows packaged portions
                    prepared for distribution.
                  </p>
                </div>
              </article>
            </section>
          )}

          {activeTab === "messages" && (
            <section>
              <PageHeading
                kicker="Contact inbox"
                title="Messages"
                description="Read messages sent through the website contact form and reply directly by email."
              />

              <div className="admin-inbox-summary">
                <span>{messages.length} total messages</span>
                <strong>{unreadCount} unread</strong>
              </div>

              {messages.length > 0 ? (
                <div className="admin-inbox-layout">
                  <div className="admin-message-list" aria-label="Contact messages">
                    {messages.map((message) => (
                      <button
                        type="button"
                        key={message.id}
                        className={`${
                          selectedMessage?.id === message.id ? "is-selected" : ""
                        } ${message.status === "new" ? "is-unread" : ""}`}
                        onClick={() => openMessage(message)}
                      >
                        <span className="admin-message-list__topline">
                          <strong>{message.name}</strong>
                          {message.status === "new" && <b>New</b>}
                        </span>
                        <span className="admin-message-list__subject">
                          {message.subject}
                        </span>
                        <small>{messageDate(message.createdAt)}</small>
                      </button>
                    ))}
                  </div>

                  {selectedMessage && (
                    <article className="admin-panel admin-message-detail">
                      <div className="admin-message-detail__header">
                        <div>
                          <p className="admin-kicker">From</p>
                          <h2>{selectedMessage.name}</h2>
                          <span>{messageDate(selectedMessage.createdAt)}</span>
                        </div>
                        <span
                          className={`admin-message-status admin-message-status--${selectedMessage.status}`}
                        >
                          {selectedMessage.status === "new" ? "New" : "Read"}
                        </span>
                      </div>

                      <div className="admin-message-contact">
                        <a href={`mailto:${selectedMessage.email}`}>
                          {selectedMessage.email}
                        </a>
                        {selectedMessage.phone && (
                          <a href={`tel:${selectedMessage.phone}`}>
                            {selectedMessage.phone}
                          </a>
                        )}
                      </div>

                      <div className="admin-message-body">
                        <p className="admin-kicker">Subject</p>
                        <h3>{selectedMessage.subject}</h3>
                        <p>{selectedMessage.message}</p>
                      </div>

                      <div className="admin-message-actions">
                        <a
                          className="admin-button admin-button--primary"
                          href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                            `Re: ${selectedMessage.subject}`,
                          )}`}
                        >
                          Reply by email
                        </a>
                        {selectedMessage.status === "read" && (
                          <button
                            type="button"
                            className="admin-button admin-button--secondary"
                            disabled={busyAction !== null}
                            onClick={() => setMessageUnread(selectedMessage)}
                          >
                            {busyAction === `message-unread-${selectedMessage.id}`
                              ? "Updating…"
                              : "Mark unread"}
                          </button>
                        )}
                        <button
                          type="button"
                          className="admin-button admin-button--danger"
                          disabled={busyAction !== null}
                          onClick={() => removeMessage(selectedMessage)}
                        >
                          {busyAction === `message-delete-${selectedMessage.id}`
                            ? "Deleting…"
                            : "Delete"}
                        </button>
                      </div>
                    </article>
                  )}
                </div>
              ) : (
                <div className="admin-empty admin-inbox-empty">
                  <span>✉</span>
                  <h2>No messages yet</h2>
                  <p>New contact form messages will appear here automatically.</p>
                </div>
              )}
            </section>
          )}

          {activeTab === "programs" && (
            <section>
              <PageHeading
                kicker="Projects"
                title="Manage Projects"
                description="Add or edit a project, save it as a draft, and publish it when it is ready."
                action={
                  <button
                    type="button"
                    className="admin-button admin-button--primary"
                    onClick={startNewProgram}
                  >
                    ＋ New Project
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
                      <b aria-hidden="true">›</b>
                    </button>
                  ))}
                  {programs.length === 0 && (
                    <div className="admin-empty">
                      <span>▦</span>
                      <p>No projects have been added yet.</p>
                    </div>
                  )}
                </div>

                <div className="admin-program-editor">
                  {programDraft ? (
                    <ProgramEditor
                      key={programDraft.id || "new-project"}
                      program={programDraft}
                      media={media}
                      busyAction={busyAction}
                      onChange={updateProgram}
                      onSave={saveProgram}
                      onDelete={removeProgram}
                      onUploadMedia={uploadProjectMedia}
                      onClose={() => setProgramDraft(null)}
                    />
                  ) : (
                    <div className="admin-editor-placeholder">
                      <span>✎</span>
                      <h2>Select a project to edit</h2>
                      <p>
                        Choose a project from the list or create a new one.
                      </p>
                      <button
                        type="button"
                        className="admin-button admin-button--primary"
                        onClick={startNewProgram}
                      >
                        New Project
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
                title="Edit Website Pages"
                description="Update text and featured media here. Save a draft first, then publish it separately."
                action={
                  <div className="admin-heading-actions">
                    <button
                      type="button"
                      className="admin-button admin-button--secondary"
                      disabled={busyAction !== null}
                      onClick={() => saveContent(false)}
                    >
                      {busyAction === "content-draft"
                        ? "Saving…"
                        : "Save Draft"}
                    </button>
                    <button
                      type="button"
                      className="admin-button admin-button--publish"
                      disabled={busyAction !== null}
                      onClick={() => saveContent(true)}
                    >
                      {busyAction === "content-publish"
                        ? "Publishing…"
                        : "Publish"}
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
                  ? "The draft contains changes that have not been published."
                  : "The draft matches the live website."}
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
                  <p className="admin-kicker">Current page</p>
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
                    ? "Unpublished changes are ready"
                    : "All changes are published"}
                </span>
                <button
                  type="button"
                  className="admin-button admin-button--secondary"
                  disabled={busyAction !== null}
                  onClick={() => saveContent(false)}
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  className="admin-button admin-button--publish"
                  disabled={busyAction !== null}
                  onClick={() => saveContent(true)}
                >
                  Publish
                </button>
              </div>
            </section>
          )}

          {activeTab === "media" && (
            <section>
              <PageHeading
                kicker="Media library"
                title="Images and Videos"
                description="Upload original files from your phone or computer, then select them for a project or website page."
              />

              <article className="admin-panel admin-upload-panel">
                <div className="admin-upload-icon">⇧</div>
                <div className="admin-upload-copy">
                  <h2>Upload a New File</h2>
                  <p>
                    Images: JPG, PNG, WebP, AVIF, or GIF up to 25 MB. Videos:
                    MP4 or WebM up to 80 MB.
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
                        {uploadFile ? uploadFile.name : "Choose a file"}
                      </span>
                    </label>
                    <label className="admin-field">
                      <span>Image or video description</span>
                      <input
                        dir="auto"
                        value={uploadAlt}
                        onChange={(event) => setUploadAlt(event.target.value)}
                        placeholder="Example: Family receiving food assistance"
                      />
                    </label>
                    <button
                      type="button"
                      className="admin-button admin-button--primary"
                      disabled={!uploadFile || busyAction !== null}
                      onClick={uploadMedia}
                    >
                      {busyAction === "media-upload"
                        ? "Uploading…"
                        : "Upload"}
                    </button>
                  </div>
                </div>
              </article>

              <div className="admin-media-heading">
                <div>
                  <p className="admin-kicker">Media library</p>
                  <h2>{media.length} files</h2>
                </div>
                <p>
                  Curated original files are protected. Files you upload can be
                  deleted when they are no longer in use.
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
                          ? "Image"
                          : "Video"}
                      </span>
                    </div>
                    <div className="admin-media-card__body">
                      <strong title={item.name}>{item.name}</strong>
                      <p title={item.altText}>{item.altText || "No description"}</p>
                      <div>
                        <small>{humanFileSize(item.size)}</small>
                        {item.isProtected ? (
                          <span className="admin-protected">Protected original</span>
                        ) : (
                          <button
                            type="button"
                            disabled={busyAction !== null}
                            onClick={() => removeMedia(item)}
                          >
                            {busyAction === `media-delete-${item.id}`
                              ? "Deleting…"
                              : "Delete"}
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
  onUploadMedia,
  onClose,
}: {
  program: Program;
  media: MediaItem[];
  busyAction: string | null;
  onChange: <K extends keyof Program>(key: K, value: Program[K]) => void;
  onSave: (action: "draft" | "publish" | "unpublish") => void;
  onDelete: () => void;
  onUploadMedia: (files: File[]) => Promise<boolean>;
  onClose: () => void;
}) {
  const [projectUploadFiles, setProjectUploadFiles] = useState<File[]>([]);
  const [projectUploadKey, setProjectUploadKey] = useState(0);
  const [gallerySelection, setGallerySelection] = useState("");
  const images = media.filter((item) => item.contentType.startsWith("image/"));
  const videos = media.filter((item) => item.contentType.startsWith("video/"));
  const selectedImage = images.find((item) => item.url === program.image);
  const selectedVideo = videos.find((item) => item.url === program.video);
  const gallery = program.gallery ?? [];
  const galleryUrls = new Set(gallery.map((item) => item.url));
  const availableGalleryMedia = media.filter(
    (item) =>
      item.url !== program.image &&
      item.url !== program.video &&
      !galleryUrls.has(item.url),
  );

  function chooseProjectFiles(event: ChangeEvent<HTMLInputElement>) {
    setProjectUploadFiles(Array.from(event.target.files ?? []));
  }

  async function uploadAndUseProjectFiles() {
    if (projectUploadFiles.length === 0) return;
    const uploaded = await onUploadMedia(projectUploadFiles);
    if (uploaded) {
      setProjectUploadFiles([]);
      setProjectUploadKey((current) => current + 1);
    }
  }

  function addGalleryMedia() {
    const selected = media.find((item) => item.url === gallerySelection);
    if (!selected) return;

    onChange("gallery", [
      ...gallery,
      {
        url: selected.url,
        type: selected.contentType.startsWith("video/") ? "video" : "image",
        altText: selected.altText,
      },
    ]);
    setGallerySelection("");
  }

  function updateGalleryAlt(index: number, altText: string) {
    onChange(
      "gallery",
      gallery.map((item, itemIndex) =>
        itemIndex === index ? { ...item, altText } : item,
      ),
    );
  }

  function removeGalleryItem(index: number) {
    onChange(
      "gallery",
      gallery.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function moveGalleryItem(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= gallery.length) return;
    const next = [...gallery];
    [next[index], next[target]] = [next[target], next[index]];
    onChange("gallery", next);
  }

  function makeMainImage(index: number) {
    const item = gallery[index];
    if (!item || item.type !== "image") return;

    const next = gallery.filter((_, itemIndex) => itemIndex !== index);
    if (
      program.image &&
      program.image !== item.url &&
      !next.some((entry) => entry.url === program.image)
    ) {
      next.unshift({
        url: program.image,
        type: "image",
        altText: program.imageAlt,
      });
    }

    onChange("image", item.url);
    onChange("imageAlt", item.altText);
    onChange("gallery", next);
  }

  return (
    <article className="admin-panel admin-form-panel admin-program-form">
      <div className="admin-panel__heading">
        <div>
          <p className="admin-kicker">
            {program.id ? "Edit project" : "New project"}
          </p>
          <h2>{program.title || "New project"}</h2>
          <div className="admin-editor-status">
            <StatusBadge program={program} />
            {program.hasUnpublishedChanges && program.isPublished && (
              <span>Draft changes are not live yet</span>
            )}
          </div>
        </div>
        <button
          className="admin-close-button"
          type="button"
          aria-label="Close editor"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <section className="admin-project-upload" aria-label="Project media upload">
        <div className="admin-upload-icon">⇧</div>
        <div className="admin-upload-copy">
          <h3>Upload Project Images or Videos</h3>
          <p>
            Select one or several files from your phone or computer. They will
            be added to this project gallery. The first image becomes the main
            image only when the project does not already have one. Upload up to
            12 files at a time.
          </p>
          <div className="admin-upload-fields">
            <label className="admin-file-input">
              <input
                key={projectUploadKey}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm"
                onChange={chooseProjectFiles}
              />
              <span>
                {projectUploadFiles.length > 0
                  ? `${projectUploadFiles.length} ${projectUploadFiles.length === 1 ? "file" : "files"} selected`
                  : "Choose images or videos"}
              </span>
            </label>
            <button
              type="button"
              className="admin-button admin-button--primary"
              disabled={projectUploadFiles.length === 0 || busyAction !== null}
              onClick={uploadAndUseProjectFiles}
            >
              {busyAction === "program-media-upload"
                ? "Uploading…"
                : "Upload and Add"}
            </button>
          </div>
        </div>
      </section>

      <div className="admin-form-grid">
        <label className="admin-field">
          <span>Full project title *</span>
          <input
            dir="auto"
            value={program.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="Example: Emergency Food Assistance"
          />
        </label>
        <label className="admin-field">
          <span>Short title</span>
          <input
            dir="auto"
            value={program.shortTitle}
            onChange={(event) => onChange("shortTitle", event.target.value)}
            placeholder="Example: Food support"
          />
        </label>
        <label className="admin-field">
          <span>URL slug</span>
          <input
            dir="ltr"
            value={program.slug}
            onChange={(event) => onChange("slug", event.target.value)}
            placeholder="Leave blank to generate automatically"
          />
          <small>Example: clean-water. Changing it later will also change the project link.</small>
        </label>
        <label className="admin-field">
          <span>Display order</span>
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
          <small>Projects with lower numbers appear first.</small>
        </label>
        <label className="admin-field admin-field--full">
          <span>Short card description</span>
          <textarea
            dir="auto"
            rows={3}
            value={program.summary}
            onChange={(event) => onChange("summary", event.target.value)}
          />
        </label>
        <label className="admin-field">
          <span>Image label</span>
          <input
            dir="auto"
            value={program.label}
            onChange={(event) => onChange("label", event.target.value)}
            placeholder="Example: Urgent care"
          />
        </label>
        <label className="admin-field">
          <span>Detail section eyebrow</span>
          <input
            dir="auto"
            value={program.eyebrow}
            onChange={(event) => onChange("eyebrow", event.target.value)}
          />
        </label>
        <div className="admin-field admin-field--full">
          <span>Main project image *</span>
          <div
            className={`admin-media-picker ${
              selectedImage ? "" : "admin-media-picker--empty"
            }`}
          >
            {selectedImage && (
              <img src={selectedImage.url} alt={selectedImage.altText} />
            )}
            <select
              dir="auto"
              value={program.image}
              onChange={(event) => onChange("image", event.target.value)}
            >
              <option value="">Select an image</option>
              {images.map((item) => (
                <option key={item.id} value={item.url}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="admin-field admin-field--full">
          <span>Image description for accessibility</span>
          <input
            dir="auto"
            value={program.imageAlt}
            onChange={(event) => onChange("imageAlt", event.target.value)}
            placeholder="Describe what appears in the image"
          />
        </label>
        <div className="admin-field admin-field--full">
          <span>Featured project video (optional)</span>
          <div
            className={`admin-media-picker ${
              selectedVideo ? "" : "admin-media-picker--empty"
            }`}
          >
            {selectedVideo && (
              <video
                src={selectedVideo.url}
                muted
                playsInline
                preload="metadata"
              />
            )}
            <select
              dir="auto"
              value={program.video}
              onChange={(event) => onChange("video", event.target.value)}
            >
              <option value="">No project video</option>
              {videos.map((item) => (
                <option key={item.id} value={item.url}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <small>
            If selected, this video appears immediately after the main image.
            Additional videos can be added in the gallery below.
          </small>
        </div>
        <div className="admin-field admin-field--full admin-gallery-manager">
          <div className="admin-gallery-manager__heading">
            <div>
              <span>Project gallery</span>
              <small>
                Add multiple images and videos, change their order, or remove
                them from this project.
              </small>
            </div>
            <strong>
              {gallery.length} {gallery.length === 1 ? "item" : "items"}
            </strong>
          </div>

          <div className="admin-gallery-add">
            <select
              dir="auto"
              value={gallerySelection}
              onChange={(event) => setGallerySelection(event.target.value)}
            >
              <option value="">Choose from Media Library</option>
              {availableGalleryMedia.map((item) => (
                <option key={item.id} value={item.url}>
                  {item.contentType.startsWith("video/") ? "Video" : "Image"}:{" "}
                  {item.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="admin-button admin-button--secondary"
              disabled={!gallerySelection || busyAction !== null}
              onClick={addGalleryMedia}
            >
              Add to Gallery
            </button>
          </div>

          {gallery.length > 0 ? (
            <div className="admin-project-gallery">
              {gallery.map((item, index) => {
                const libraryItem = media.find(
                  (mediaItem) => mediaItem.url === item.url,
                );
                return (
                  <article className="admin-project-gallery__item" key={item.url}>
                    <div className="admin-project-gallery__preview">
                      {item.type === "video" ? (
                        <>
                          <video
                            src={item.url}
                            muted
                            playsInline
                            preload="metadata"
                          />
                          <b>Video</b>
                        </>
                      ) : (
                        <img src={item.url} alt="" />
                      )}
                    </div>
                    <div className="admin-project-gallery__body">
                      <strong>
                        {libraryItem?.name || `Gallery item ${index + 1}`}
                      </strong>
                      <label className="admin-field">
                        <span>Media description</span>
                        <input
                          dir="auto"
                          value={item.altText}
                          onChange={(event) =>
                            updateGalleryAlt(index, event.target.value)
                          }
                          placeholder="Describe what appears in this media"
                        />
                      </label>
                      <div className="admin-project-gallery__actions">
                        {item.type === "image" && (
                          <button
                            type="button"
                            onClick={() => makeMainImage(index)}
                          >
                            Set as Main
                          </button>
                        )}
                        <button
                          type="button"
                          aria-label="Move media earlier"
                          disabled={index === 0}
                          onClick={() => moveGalleryItem(index, -1)}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          aria-label="Move media later"
                          disabled={index === gallery.length - 1}
                          onClick={() => moveGalleryItem(index, 1)}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          className="is-danger"
                          onClick={() => removeGalleryItem(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="admin-gallery-empty">
              No additional media yet. Upload files above or add existing media
              from the library.
            </p>
          )}
        </div>
        <label className="admin-field admin-field--full">
          <span>Featured introduction</span>
          <textarea
            dir="auto"
            rows={3}
            value={program.lead}
            onChange={(event) => onChange("lead", event.target.value)}
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>Full description</span>
          <textarea
            dir="auto"
            rows={6}
            value={program.body}
            onChange={(event) => onChange("body", event.target.value)}
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>Key points, one per line</span>
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
            {busyAction === "program-delete" ? "Deleting…" : "Delete"}
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
            Unpublish
          </button>
        )}
        <button
          type="button"
          className="admin-button admin-button--secondary"
          disabled={busyAction !== null}
          onClick={() => onSave("draft")}
        >
          {busyAction === "program-draft"
            ? "Saving…"
            : "Save Draft"}
        </button>
        <button
          type="button"
          className="admin-button admin-button--publish"
          disabled={busyAction !== null}
          onClick={() => onSave("publish")}
        >
          {busyAction === "program-publish"
            ? "Publishing…"
            : "Publish"}
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
            <option value="">Select media</option>
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
