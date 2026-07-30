import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import {
  getPublishedPrograms,
  getPublishedSiteContent,
} from "@/lib/supabase-cms";

export const metadata: Metadata = {
  title: "Support Our Work",
  description:
    "Learn how to support Noor Al-Aman Humanitarian responsibly and request verified giving information.",
};

export const dynamic = "force-dynamic";

export default async function DonatePage() {
  const [programs, content] = await Promise.all([
    getPublishedPrograms(),
    getPublishedSiteContent(),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={content["donate.heroEyebrow"]}
          title={content["donate.heroTitle"]}
          intro={content["donate.heroIntro"]}
          image={content["donate.heroImage"]}
          imageAlt="Essential food supplies prepared for distribution"
        />

        <section className="section">
          <div className="shell support-intro">
            <div>
              <p className="eyebrow">{content["donate.introEyebrow"]}</p>
              <h2>{content["donate.introTitle"]}</h2>
            </div>
            <div>
              <p className="lead">{content["donate.introLead"]}</p>
              <p className="body-copy">{content["donate.introBody"]}</p>
            </div>
          </div>
        </section>

        <section className="section section--soft">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Where support can help</p>
                <h2>{programs.length} areas of practical support</h2>
              </div>
            </div>
            <div className="support-grid">
              {programs.map((program, index) => (
                <article key={program.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{program.shortTitle}</h3>
                  <p>{program.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell giving-panel">
            <div className="giving-panel__image">
              <img
                src={content["donate.givingImage"]}
                alt="Hands using clean water from a community hand pump"
              />
            </div>
            <div className="giving-panel__copy">
              <p className="eyebrow eyebrow--gold">
                {content["donate.givingEyebrow"]}
              </p>
              <h2>{content["donate.givingTitle"]}</h2>
              <ol>
                <li>
                  <span>1</span>
                  {content["donate.givingStep1"]}
                </li>
                <li>
                  <span>2</span>
                  {content["donate.givingStep2"]}
                </li>
                <li>
                  <span>3</span>
                  {content["donate.givingStep3"]}
                </li>
              </ol>
              <Link className="button button--gold" href="/contact">
                Request verified information
              </Link>
            </div>
          </div>
        </section>

        <section className="section section--compact">
          <div className="shell notice">
            <div className="notice__mark">!</div>
            <div>
              <h2>{content["donate.transparencyTitle"]}</h2>
              <p>{content["donate.transparencyText"]}</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
