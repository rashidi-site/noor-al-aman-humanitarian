import Link from "next/link";
import { getPublishedSiteContent } from "@/lib/supabase-cms";

export default async function SiteFooter() {
  const content = await getPublishedSiteContent();

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
          <p>{content["global.footerTagline"]}</p>
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
          <Link href="/admin">Admin</Link>
        </div>
        <div className="footer-note">
          <h2>Our commitment</h2>
          <p>{content["global.footerCommitment"]}</p>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Noor Al-Aman Humanitarian</span>
        <span>A community-led humanitarian initiative</span>
      </div>
    </footer>
  );
}
