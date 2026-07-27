import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Noor Al-Aman Humanitarian about partnerships, programme support, media, and volunteering.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Contact"
          title="Start a thoughtful conversation."
          intro="We welcome enquiries from responsible partners, supporters, volunteers, and media professionals who share our commitment to dignity."
          image="/media/shelter-interior.webp"
          imageAlt="Completed interior of a bamboo shelter"
        />

        <section className="section">
          <div className="shell contact-layout">
            <div className="contact-copy">
              <p className="eyebrow">Get in touch</p>
              <h2>Choose the right conversation.</h2>
              <p className="lead">
                Clear enquiries help us respond with the right information and
                protect the privacy of the families involved in our work.
              </p>
              <div className="contact-note">
                <span>Contact details are being verified</span>
                <p>
                  Direct email and official social links will appear here once
                  confirmed. Please do not send funds or sensitive personal
                  information through an unverified account.
                </p>
              </div>
            </div>
            <div className="contact-options">
              <article id="partnerships">
                <span>01</span>
                <div>
                  <h3>Partnerships &amp; programme support</h3>
                  <p>
                    For organisations, sponsors, and community partners
                    interested in supporting a clearly defined response.
                  </p>
                </div>
              </article>
              <article>
                <span>02</span>
                <div>
                  <h3>Volunteering</h3>
                  <p>
                    For people who want to contribute relevant time, skills, or
                    locally appropriate support.
                  </p>
                </div>
              </article>
              <article id="media">
                <span>03</span>
                <div>
                  <h3>Media &amp; documentation</h3>
                  <p>
                    For responsible requests about programme information,
                    approved images, and humanitarian storytelling.
                  </p>
                </div>
              </article>
              <article>
                <span>04</span>
                <div>
                  <h3>Verified giving information</h3>
                  <p>
                    For supporters who want to confirm the current official
                    donation route before contributing.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section section--soft">
          <div className="shell contact-principles">
            <div>
              <p className="eyebrow">Please protect privacy</p>
              <h2>Do not include sensitive personal details in an initial enquiry.</h2>
            </div>
            <p>
              Please avoid sending medical records, identification documents,
              full addresses, payment details, or photographs of children until
              an official and appropriate communication route has been
              confirmed.
            </p>
          </div>
        </section>

        <section className="section section--cta">
          <div className="shell cta-panel">
            <div>
              <p className="eyebrow eyebrow--gold">Learn more</p>
              <h2>See how compassion becomes practical work.</h2>
            </div>
            <Link className="button button--gold" href="/projects">
              Explore our projects
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
