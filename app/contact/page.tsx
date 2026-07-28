import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { getPublishedSiteContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Noor Al-Aman Humanitarian about partnerships, programme support, media, and volunteering.",
};

export const dynamic = "force-dynamic";

function whatsappHref(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export default async function ContactPage() {
  const content = await getPublishedSiteContent();
  const hasDirectContact = Boolean(
    content["contact.email"] ||
      content["contact.phone"] ||
      content["contact.whatsapp"] ||
      content["contact.location"] ||
      content["contact.facebook"] ||
      content["contact.instagram"] ||
      content["contact.youtube"],
  );

  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={content["contact.heroEyebrow"]}
          title={content["contact.heroTitle"]}
          intro={content["contact.heroIntro"]}
          image={content["contact.heroImage"]}
          imageAlt="Completed interior of a bamboo shelter"
        />

        <section className="section">
          <div className="shell contact-layout">
            <div className="contact-copy">
              <p className="eyebrow">{content["contact.introEyebrow"]}</p>
              <h2>{content["contact.introTitle"]}</h2>
              <p className="lead">{content["contact.introLead"]}</p>
              {hasDirectContact ? (
                <div className="contact-details">
                  {content["contact.email"] && (
                    <a href={`mailto:${content["contact.email"]}`}>
                      <span>Email</span>
                      <strong>{content["contact.email"]}</strong>
                    </a>
                  )}
                  {content["contact.phone"] && (
                    <a href={`tel:${content["contact.phone"].replace(/\s/g, "")}`}>
                      <span>Phone</span>
                      <strong>{content["contact.phone"]}</strong>
                    </a>
                  )}
                  {content["contact.whatsapp"] && (
                    <a
                      href={whatsappHref(content["contact.whatsapp"])}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>WhatsApp</span>
                      <strong>{content["contact.whatsapp"]}</strong>
                    </a>
                  )}
                  {content["contact.location"] && (
                    <div>
                      <span>Location</span>
                      <strong>{content["contact.location"]}</strong>
                    </div>
                  )}
                  <div className="contact-socials">
                    {content["contact.facebook"] && (
                      <a
                        href={content["contact.facebook"]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Facebook ↗
                      </a>
                    )}
                    {content["contact.instagram"] && (
                      <a
                        href={content["contact.instagram"]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Instagram ↗
                      </a>
                    )}
                    {content["contact.youtube"] && (
                      <a
                        href={content["contact.youtube"]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        YouTube ↗
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="contact-note">
                  <span>{content["contact.noticeTitle"]}</span>
                  <p>{content["contact.noticeText"]}</p>
                </div>
              )}
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
              <p className="eyebrow">{content["contact.privacyEyebrow"]}</p>
              <h2>{content["contact.privacyTitle"]}</h2>
            </div>
            <p>{content["contact.privacyText"]}</p>
          </div>
        </section>

        <section className="section section--cta">
          <div className="shell cta-panel">
            <div>
              <p className="eyebrow eyebrow--gold">
                {content["contact.ctaEyebrow"]}
              </p>
              <h2>{content["contact.ctaTitle"]}</h2>
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
