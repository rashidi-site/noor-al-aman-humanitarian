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
import { programs } from "./site-data";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-hero">
          <img
            className="home-hero__image"
            src="/media/shelter-complete.webp"
            alt="A completed bamboo shelter built for a vulnerable family"
          />
          <div className="home-hero__shade" aria-hidden="true" />
          <div className="shell home-hero__content">
            <p className="eyebrow eyebrow--light">
              Community-led humanitarian response
            </p>
            <h1>Relief that protects dignity.</h1>
            <p className="home-hero__intro">
              Noor Al-Aman Humanitarian stands with vulnerable families through
              practical support, local understanding, and compassionate action.
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
              <p className="eyebrow">Our purpose</p>
              <h2>Human care, grounded in real needs.</h2>
            </div>
            <div>
              <p className="lead">
                We support families affected by displacement, poverty, fragile
                shelter, food insecurity, limited access to water and learning,
                medical emergencies, and seasonal needs in Bangladesh.
              </p>
              <p className="body-copy">
                Our approach begins with listening. Assistance is shaped around
                urgent needs, delivered respectfully, and documented carefully.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--soft">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Where we focus</p>
                <h2>Practical support for vulnerable families</h2>
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
              <p className="eyebrow">Field story</p>
              <h2>From an exposed frame to a safer home</h2>
              <p className="lead">
                Shelter work is more than construction. It restores privacy,
                protection, and a measure of stability for a family.
              </p>
              <p className="body-copy">
                These real field photographs document a bamboo shelter during
                construction and after completion. The design uses familiar
                local materials and practical building methods.
              </p>
              <Link className="button button--navy" href="/projects#shelter">
                See the shelter project
              </Link>
            </div>
            <div className="before-after">
              <figure>
                <img
                  src="/media/shelter-progress.webp"
                  alt="Bamboo shelter under construction"
                />
                <figcaption>During construction</figcaption>
              </figure>
              <figure>
                <img
                  src="/media/shelter-complete.webp"
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
                <p className="eyebrow eyebrow--gold">How we work</p>
                <h2>Simple principles. Responsible action.</h2>
              </div>
              <p>
                Every response should respect the people it is intended to
                serve.
              </p>
            </div>
            <div className="process-grid">
              <article>
                <span>01</span>
                <h3>Listen locally</h3>
                <p>
                  Understand the family&apos;s situation before deciding what
                  support is appropriate.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>Respond practically</h3>
                <p>
                  Focus on useful assistance that addresses a clear and
                  immediate need.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Document carefully</h3>
                <p>
                  Record delivery while protecting personal dignity and
                  avoiding unnecessary exposure.
                </p>
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
                poster="/media/shelter-interior.webp"
                aria-label="Field video of a completed bamboo shelter"
              >
                <source src="/media/shelter-complete.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="video-story__copy">
              <p className="eyebrow">A record of the work</p>
              <h2>Real progress, shown with care</h2>
              <p className="lead">
                This short field video shows the interior of a completed
                shelter. It is shared to demonstrate the work without exposing
                the family receiving support.
              </p>
              <p className="media-note">
                Authentic field media • No staged imagery • Privacy-conscious
                selection
              </p>
            </div>
          </div>
        </section>

        <section className="section section--cta">
          <div className="shell cta-panel">
            <div>
              <p className="eyebrow eyebrow--gold">Stand with dignity</p>
              <h2>Help turn compassion into practical support.</h2>
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
