import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { getPublishedSiteContent } from "@/lib/supabase-cms";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the mission, vision, and humanitarian principles of Noor Al-Aman Humanitarian.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getPublishedSiteContent();

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={content["about.heroEyebrow"]}
          title={content["about.heroTitle"]}
          intro={content["about.heroIntro"]}
          image={content["about.heroImage"]}
          imageAlt="Interior of a completed bamboo shelter"
        />

        <section className="section">
          <div className="shell mission-grid">
            <article>
              <p className="eyebrow">{content["about.missionEyebrow"]}</p>
              <h2>{content["about.missionTitle"]}</h2>
              <p className="lead">{content["about.missionText"]}</p>
            </article>
            <article className="vision-card">
              <p className="eyebrow eyebrow--gold">
                {content["about.visionEyebrow"]}
              </p>
              <h2>{content["about.visionTitle"]}</h2>
              <p>{content["about.visionText"]}</p>
            </article>
          </div>
        </section>

        <section className="section section--soft">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{content["about.valuesEyebrow"]}</p>
                <h2>{content["about.valuesTitle"]}</h2>
              </div>
            </div>
            <div className="value-grid">
              <article>
                <span>01</span>
                <h3>{content["about.value1Title"]}</h3>
                <p>{content["about.value1Body"]}</p>
              </article>
              <article>
                <span>02</span>
                <h3>{content["about.value2Title"]}</h3>
                <p>{content["about.value2Body"]}</p>
              </article>
              <article>
                <span>03</span>
                <h3>{content["about.value3Title"]}</h3>
                <p>{content["about.value3Body"]}</p>
              </article>
              <article>
                <span>04</span>
                <h3>{content["about.value4Title"]}</h3>
                <p>{content["about.value4Body"]}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell image-copy">
            <div className="image-copy__image image-copy__image--portrait">
              <img
                src={content["about.dignityImage"]}
                alt="A woman receiving essential household support"
              />
            </div>
            <div>
              <p className="eyebrow">{content["about.dignityEyebrow"]}</p>
              <h2>{content["about.dignityTitle"]}</h2>
              <p className="lead">{content["about.dignityLead"]}</p>
              <p className="body-copy">{content["about.dignityBody"]}</p>
              <Link className="text-link" href="/projects">
                See our programmes <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="section section--cta">
          <div className="shell cta-panel">
            <div>
              <p className="eyebrow eyebrow--gold">
                {content["about.ctaEyebrow"]}
              </p>
              <h2>{content["about.ctaTitle"]}</h2>
            </div>
            <Link className="button button--gold" href="/contact">
              Start a conversation
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
