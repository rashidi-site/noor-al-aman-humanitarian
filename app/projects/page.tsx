import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";
import ProjectMediaGallery from "../components/ProjectMediaGallery";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { getPublishedPrograms, getPublishedSiteContent } from "@/lib/cms";
import type { Program } from "../site-data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Noor Al-Aman Humanitarian work in shelter, family assistance, medical care, clean water, education, food support, Ramadan Iftar, and Qurbani distribution.",
};

export const dynamic = "force-dynamic";

function ProjectCopy({
  program,
  number,
}: {
  program: Program;
  number: number;
}) {
  return (
    <div>
      <p className="eyebrow">
        {String(number).padStart(2, "0")} / {program.eyebrow}
      </p>
      <h2>{program.title}</h2>
      <p className="lead">{program.lead}</p>
      <p className="body-copy">{program.body}</p>
      {program.bullets.length > 0 && (
        <ul className="check-list">
          {program.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function ProjectsPage() {
  const [programs, content] = await Promise.all([
    getPublishedPrograms(),
    getPublishedSiteContent(),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={content["projects.heroEyebrow"]}
          title={content["projects.heroTitle"]}
          intro={content["projects.heroIntro"]}
          image={content["projects.heroImage"]}
          imageAlt="A humanitarian project documented in the field"
        />

        {programs.map((program, index) => {
          const reverse = index % 2 === 1;
          return (
            <section
              className={`section project-detail ${reverse ? "section--soft" : ""}`}
              id={program.slug}
              key={program.id}
            >
              <div
                className={`shell project-detail__grid ${reverse ? "project-detail__grid--reverse" : ""}`}
              >
                {reverse ? (
                  <>
                    <ProjectMediaGallery program={program} />
                    <ProjectCopy program={program} number={index + 1} />
                  </>
                ) : (
                  <>
                    <ProjectCopy program={program} number={index + 1} />
                    <ProjectMediaGallery program={program} />
                  </>
                )}
              </div>
            </section>
          );
        })}

        <section className="section section--navy">
          <div className="shell">
            <div className="section-heading section-heading--light">
              <div>
                <p className="eyebrow eyebrow--gold">
                  {content["projects.recordsEyebrow"]}
                </p>
                <h2>{content["projects.recordsTitle"]}</h2>
              </div>
              <p>{content["projects.recordsIntro"]}</p>
            </div>
            <div className="field-gallery">
              {[1, 2, 3].map((number) => (
                <figure key={number}>
                  <img
                    src={content[`projects.gallery${number}Image`]}
                    alt={content[`projects.gallery${number}Label`]}
                  />
                  <figcaption>
                    <span>{String(number).padStart(2, "0")}</span>
                    {content[`projects.gallery${number}Label`]}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--cta">
          <div className="shell cta-panel">
            <div>
              <p className="eyebrow eyebrow--gold">
                {content["projects.ctaEyebrow"]}
              </p>
              <h2>{content["projects.ctaTitle"]}</h2>
            </div>
            <div className="button-row">
              <Link className="button button--gold" href="/donate">
                Ways to support
              </Link>
              <Link className="button button--outline-light" href="/contact">
                Discuss a partnership
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
