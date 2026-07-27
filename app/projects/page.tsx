import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore Noor Al-Aman Humanitarian shelter, widow and family, and medical support work.",
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Our projects"
          title="Focused responses to real needs."
          intro="Our current work reflects needs documented through authentic field records: safer shelter, essential family assistance, and urgent medical support."
          image="/media/shelter-progress.webp"
          imageAlt="A bamboo shelter being constructed"
        />

        <section className="section project-detail" id="shelter">
          <div className="shell project-detail__grid">
            <div>
              <p className="eyebrow">01 / Safer homes</p>
              <h2>Shelter Assistance</h2>
              <p className="lead">
                Fragile shelter leaves families exposed to weather, insecurity,
                and a daily loss of privacy.
              </p>
              <p className="body-copy">
                Our shelter response supports repair and rebuilding with
                practical local materials. The work shown here moves from an
                exposed bamboo frame to enclosed walls, a finished floor, and a
                safer living space.
              </p>
              <ul className="check-list">
                <li>Needs-led repair and rebuilding</li>
                <li>Locally familiar materials and methods</li>
                <li>Privacy, weather protection, and safer living space</li>
              </ul>
            </div>
            <div className="project-detail__media">
              <img
                src="/media/shelter-complete.webp"
                alt="Completed bamboo shelter"
              />
              <span>Completed shelter</span>
            </div>
          </div>
        </section>

        <section className="section section--soft project-detail" id="widow-support">
          <div className="shell project-detail__grid project-detail__grid--reverse">
            <div className="project-detail__media project-detail__media--portrait">
              <img
                src="/media/widow-support.webp"
                alt="A woman receiving an essential household support package"
              />
              <span>Essential household assistance</span>
            </div>
            <div>
              <p className="eyebrow">02 / Essential assistance</p>
              <h2>Widow &amp; Family Support</h2>
              <p className="lead">
                Widows and households without stable income can face acute
                difficulty meeting basic daily needs.
              </p>
              <p className="body-copy">
                This programme provides practical household support with
                discretion. Assistance is handed directly to recipients, and
                field documentation is selected to protect dignity.
              </p>
              <ul className="check-list">
                <li>Essential household support</li>
                <li>Direct, respectful delivery</li>
                <li>Privacy-conscious documentation</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section project-detail" id="medical-support">
          <div className="shell project-detail__grid">
            <div>
              <p className="eyebrow">03 / Urgent care</p>
              <h2>Medical Support</h2>
              <p className="lead">
                A medical emergency can become a financial emergency for a
                family already living with hardship.
              </p>
              <p className="body-copy">
                Medical assistance focuses on urgent, clearly identified needs.
                Public-facing images are cropped to avoid exposing identity or
                graphic injury while still documenting that care took place.
              </p>
              <ul className="check-list">
                <li>Support during urgent treatment</li>
                <li>Attention to clearly identified medical needs</li>
                <li>Respectful handling of patient information</li>
              </ul>
            </div>
            <div className="project-detail__media">
              <img
                src="/media/medical-support.webp"
                alt="A patient receiving hospital treatment for a bandaged leg"
              />
              <span>Emergency medical care</span>
            </div>
          </div>
        </section>

        <section className="section section--navy">
          <div className="shell">
            <div className="section-heading section-heading--light">
              <div>
                <p className="eyebrow eyebrow--gold">Field records</p>
                <h2>A shelter project, documented step by step</h2>
              </div>
              <p>
                Real photographs from the same body of work show the need,
                construction, and completed result.
              </p>
            </div>
            <div className="field-gallery">
              <figure>
                <img
                  src="/media/shelter-before.webp"
                  alt="A fragile shelter before rebuilding"
                />
                <figcaption>
                  <span>01</span>
                  Fragile shelter
                </figcaption>
              </figure>
              <figure>
                <img
                  src="/media/shelter-progress.webp"
                  alt="Bamboo structure under construction"
                />
                <figcaption>
                  <span>02</span>
                  Rebuilding
                </figcaption>
              </figure>
              <figure>
                <img
                  src="/media/shelter-complete.webp"
                  alt="Finished bamboo shelter"
                />
                <figcaption>
                  <span>03</span>
                  Safer home
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="section section--cta">
          <div className="shell cta-panel">
            <div>
              <p className="eyebrow eyebrow--gold">Support the work</p>
              <h2>Help meet a clear and practical need.</h2>
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
