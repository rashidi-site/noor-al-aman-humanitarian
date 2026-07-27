import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../components/PageHero";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Support Our Work",
  description:
    "Learn how to support Noor Al-Aman Humanitarian responsibly and request verified giving information.",
};

export default function DonatePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="Support our work"
          title="Give with compassion. Give with confidence."
          intro="Responsible support should be connected to a clear need, a verified channel, and transparent communication."
          image="/media/shelter-complete.webp"
          imageAlt="Completed shelter built with bamboo"
        />

        <section className="section">
          <div className="shell support-intro">
            <div>
              <p className="eyebrow">Your support matters</p>
              <h2>Help turn urgent needs into practical assistance.</h2>
            </div>
            <div>
              <p className="lead">
                Support can help a family move toward safer shelter, meet
                essential household needs, or access urgent medical treatment.
              </p>
              <p className="body-copy">
                Verified donation instructions are not published on this page
                yet. Please request the current official giving route before
                transferring funds, and never rely on an unverified personal
                account shared by a third party.
              </p>
            </div>
          </div>
        </section>

        <section className="section section--soft">
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Where support can help</p>
                <h2>Three areas of immediate work</h2>
              </div>
            </div>
            <div className="support-grid">
              <article>
                <span>01</span>
                <h3>Safer shelter</h3>
                <p>
                  Materials and practical labour for shelter repair or
                  rebuilding.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>Family essentials</h3>
                <p>
                  Direct household assistance for widows and families facing
                  severe hardship.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Urgent treatment</h3>
                <p>
                  Targeted help for vulnerable patients facing a medical
                  emergency.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell giving-panel">
            <div className="giving-panel__image">
              <img
                src="/media/shelter-interior.webp"
                alt="Finished interior of a bamboo shelter"
              />
            </div>
            <div className="giving-panel__copy">
              <p className="eyebrow eyebrow--gold">Before you give</p>
              <h2>Use only a verified Noor Al-Aman channel.</h2>
              <ol>
                <li>
                  <span>1</span>
                  Request the current official donation instructions.
                </li>
                <li>
                  <span>2</span>
                  Confirm the purpose of your contribution.
                </li>
                <li>
                  <span>3</span>
                  Keep the confirmation or receipt for your records.
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
              <h2>Transparency note</h2>
              <p>
                This website does not currently process online payments.
                Donation options will be added only after the relevant channel
                and public information have been verified.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
