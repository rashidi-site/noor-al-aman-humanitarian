"use client";

import { useState } from "react";
import type { Program, ProjectMedia } from "../site-data";

function projectMedia(program: Program): ProjectMedia[] {
  const items: ProjectMedia[] = [
    {
      url: program.image,
      type: "image",
      altText: program.imageAlt,
    },
  ];

  if (program.video) {
    items.push({
      url: program.video,
      type: "video",
      altText: `${program.title} project video`,
    });
  }

  items.push(...(program.gallery ?? []));

  return items.filter(
    (item, index, all) =>
      Boolean(item.url) &&
      all.findIndex((candidate) => candidate.url === item.url) === index,
  );
}

export default function ProjectMediaGallery({ program }: { program: Program }) {
  const items = projectMedia(program);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = items[selectedIndex] ?? items[0];

  return (
    <div className="project-detail__media project-media-gallery">
      <div className="project-media-gallery__viewer">
        {selected.type === "video" ? (
          <video
            key={selected.url}
            controls
            playsInline
            preload="metadata"
            poster={program.image}
            aria-label={selected.altText || `${program.title} project video`}
          >
            <source src={selected.url} />
          </video>
        ) : (
          <img key={selected.url} src={selected.url} alt={selected.altText} />
        )}
        <span>{program.label}</span>
        {items.length > 1 && (
          <small className="project-media-gallery__count">
            {selectedIndex + 1} / {items.length}
          </small>
        )}
      </div>

      {items.length > 1 && (
        <div
          className="project-media-gallery__thumbs"
          role="list"
          aria-label={`${program.title} media gallery`}
        >
          {items.map((item, index) => (
            <button
              className={index === selectedIndex ? "is-active" : ""}
              type="button"
              key={`${item.url}-${index}`}
              role="listitem"
              aria-label={`Show ${item.type} ${index + 1} of ${items.length}`}
              aria-current={index === selectedIndex ? "true" : undefined}
              onClick={() => setSelectedIndex(index)}
            >
              {item.type === "video" ? (
                <>
                  <video
                    src={item.url}
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                  />
                  <b aria-hidden="true">▶</b>
                </>
              ) : (
                <img src={item.url} alt="" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
