// Internal workspace sites can read the authenticated OpenAI user from the
// forwarded request headers:
//
// import { headers } from "next/headers";
//
// export default async function Home() {
//   const requestHeaders = await headers();
//   const email = requestHeaders.get("oai-authenticated-user-email");
//   const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
//   const fullName =
//     encodedFullName &&
//     requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
//       "percent-encoded-utf-8"
//       ? decodeURIComponent(encodedFullName)
//       : null;
//   const displayName = fullName ?? email;
//   // ...
// }

import Link from "next/link";
import ProgramCard from "./components/ProgramCard";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import {
  getPublishedPrograms,
  getPublishedSiteContent,
} from "@/lib/supabase-cms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [programs, content] = await Promise.all([
    getPublishedPrograms(),
    getPublishedSiteContent(),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-hero">
          <img
            className="home-hero__image"
            src={content["home.heroImage"]}
            alt="A completed bamboo shelter built for a vulnerable family"
          />
          <div className="home-hero__shade" aria-hidden="true" />
          <div className="shell home-hero__content">
            <p className="eyebrow eyebrow--light">
              {content["home.heroEyebrow"]}
            </p>
            <h1>{content["home.heroTitle"]}</h1>
            <p className="home-hero__intro">
              {content["home.heroIntro"]}
            </p>
            <div className="button-row">
              <Link className="button button--gold" href="/projects">
                Explore our work
              </Link>
              <Link className="button button--glass" href="/donate">
                Support responsibly
              </Link>
            </div>
            <div className="hero-principles" aria-label="Our working principles">
              <span>Community-led</span>
              <span>Needs-based</span>
              <span>Dignity first</span>
            </div>
          </div>
        </section>

        <section className="section section--intro">
          <div className="shell split-heading">
            <div>
              <p className="eyebrow">{content["home.purposeEyebrow"]}</p>
              <h2>{content["home.purposeTitle"]}</h2>
            </div>
            <div>
              <p className="lead">{content["home.purposeLead"]}</p>
              <p className="body-copy">{content["home.purposeBody"]}</p>
            </div>
          </div>
        </section>

        <section className="section section--soft">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{content["home.focusEyebrow"]}</p>
                <h2>{content["home.focusTitle"]}</h2>
              </div>
              <Link className="text-link" href="/projects">
                View all programmes <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="program-grid">
              {programs.map((program) => (
                <ProgramCard key={program.slug} {...program} />
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell field-story">
            <div className="field-story__copy">
              <p className="eyebrow">{content["home.storyEyebrow"]}</p>
              <h2>{content["home.storyTitle"]}</h2>
              <p className="lead">{content["home.storyLead"]}</p>
              <p className="body-copy">{content["home.storyBody"]}</p>
              <Link className="button button--navy" href="/projects#shelter">
                See the shelter project
              </Link>
            </div>
            <div className="before-after">
              <figure>
                <img
                  src={content["home.storyBeforeImage"]}
                  alt="Bamboo shelter under construction"
                />
                <figcaption>During construction</figcaption>
              </figure>
              <figure>
                <img
                  src={content["home.storyAfterImage"]}
                  alt="Completed bamboo shelter"
                />
                <figcaption>Completed shelter</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="section section--navy">
          <div className="shell">
            <div className="section-heading section-heading--light">
              <div>
                <p className="eyebrow eyebrow--gold">
                  {content["home.processEyebrow"]}
                </p>
                <h2>{content["home.processTitle"]}</h2>
              </div>
              <p>{content["home.processIntro"]}</p>
            </div>
            <div className="process-grid">
              <article>
                <span>01</span>
                <h3>{content["home.process1Title"]}</h3>
                <p>{content["home.process1Body"]}</p>
              </article>
              <article>
                <span>02</span>
                <h3>{content["home.process2Title"]}</h3>
                <p>{content["home.process2Body"]}</p>
              </article>
              <article>
                <span>03</span>
                <h3>{content["home.process3Title"]}</h3>
                <p>{content["home.process3Body"]}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell video-story">
            <div className="video-frame">
              <video
                controls
                muted
                playsInline
                preload="metadata"
                poster={content["home.videoPoster"]}
                src={content["home.videoUrl"]}
                aria-label="Field video of a completed bamboo shelter"
              />
            </div>
            <div className="video-story__copy">
              <p className="eyebrow">{content["home.videoEyebrow"]}</p>
              <h2>{content["home.videoTitle"]}</h2>
              <p className="lead">{content["home.videoLead"]}</p>
              <p className="media-note">
                {content["home.videoNote"]}
              </p>
            </div>
          </div>
        </section>

        <section className="section section--cta">
          <div className="shell cta-panel">
            <div>
              <p className="eyebrow eyebrow--gold">
                {content["home.ctaEyebrow"]}
              </p>
              <h2>{content["home.ctaTitle"]}</h2>
            </div>
            <div className="button-row">
              <Link className="button button--gold" href="/donate">
                Ways to support
              </Link>
              <Link className="button button--outline-light" href="/contact">
                Partner with us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
