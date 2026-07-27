import Link from "next/link";
import type { Program } from "../site-data";

export default function ProgramCard({
  slug,
  title,
  summary,
  image,
  imageAlt,
  label,
}: Program) {
  return (
    <article className="program-card">
      <div className="program-card__image">
        <img src={image} alt={imageAlt} loading="lazy" />
        <span>{label}</span>
      </div>
      <div className="program-card__body">
        <h3>{title}</h3>
        <p>{summary}</p>
        <Link href={`/projects#${slug}`}>
          Learn more <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
