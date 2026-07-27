import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about the mission, vision, and humanitarian principles of Noor Al-Aman Humanitarian.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="About Noor Al-Aman"
          title="Compassion shaped by local understanding."
          intro="We are a community-led humanitarian initiative focused on practical, dignified support for vulnerable families."
          image="/media/shelter-interior.webp"
          imageAlt="Interior of a completed bamboo shelter"
        />

        <section className="section">
          <div className="shell mission-grid">
            <article>
              <p className="eyebrow">Our mission</p>
              <h2>Respond to urgent needs with care and accountability.</h2>
              <p className="lead">
                Our mission is to help vulnerable people meet essential needs
                while protecting their dignity, privacy, and agency.
              </p>
            </article>
            <article className="vision-card">
              <p className="eyebrow eyebrow--gold">Our vision</p>
              <h2>Communities where hardship does not erase hope.</h2>
              <p>
                We envision timely, trustworthy humanitarian support that
                strengthens safety and helps families move forward.
              </p>
            </article>
          </div>
        </section>

        <section className="section section--soft">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Our values</p>
                <h2>The standards behind every response</h2>
              </div>
            </div>
            <div className="value-grid">
              <article>
                <span>01</span>
                <h3>Dignity</h3>
                <p>
                  People are never reduced to images of hardship. Privacy and
                  respect guide how assistance is delivered and documented.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>Compassion</h3>
                <p>
                  We meet families with empathy and listen before deciding what
                  support is most useful.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Accountability</h3>
                <p>
                  We value clear needs assessment, responsible use of support,
                  and honest communication about the work.
                </p>
              </article>
              <article>
                <span>04</span>
                <h3>Local knowledge</h3>
                <p>
                  Community context informs priorities, materials, delivery,
                  and the practical design of each response.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell image-copy">
            <div className="image-copy__image image-copy__image--portrait">
              <img
                src="/media/widow-support.webp"
                alt="A woman receiving essential household support"
              />
            </div>
            <div>
              <p className="eyebrow">Dignity in practice</p>
              <h2>Responsible storytelling is part of humanitarian care.</h2>
              <p className="lead">
                The people receiving assistance are people first. Their
                hardship should never become a spectacle.
              </p>
              <p className="body-copy">
                We select authentic field images carefully, avoid publishing
                graphic material, remove hidden location data, and favour
                photographs that do not expose a person&apos;s identity.
              </p>
              <Link className="text-link" href="/projects">
                See our programmes <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="section section--cta">
          <div className="shell cta-panel">
            <div>
              <p className="eyebrow eyebrow--gold">Work with us</p>
              <h2>Partnership begins with shared principles.</h2>
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
