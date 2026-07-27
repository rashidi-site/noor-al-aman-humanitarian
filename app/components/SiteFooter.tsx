import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Link className="brand brand--footer" href="/">
            <img src="/media/noor-al-aman-mark.webp" alt="" />
            <span>
              <strong>Noor Al-Aman</strong>
              <small>Humanitarian</small>
            </span>
          </Link>
          <p>Serving humanity with compassion and dignity.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link href="/about">About us</Link>
          <Link href="/projects">Our projects</Link>
          <Link href="/donate">Ways to support</Link>
        </div>
        <div>
          <h2>Connect</h2>
          <Link href="/contact">Contact</Link>
          <Link href="/contact#partnerships">Partnerships</Link>
          <Link href="/contact#media">Media enquiries</Link>
        </div>
        <div className="footer-note">
          <h2>Our commitment</h2>
          <p>
            We share field media selectively, protect personal dignity, and do
            not publish sensitive identifying information.
          </p>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Noor Al-Aman Humanitarian</span>
        <span>A community-led humanitarian initiative</span>
      </div>
    </footer>
  );
}
