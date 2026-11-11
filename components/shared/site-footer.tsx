import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="site-footer footer">
      <div className="site-footer__top">
        <div>
          <Logo inverse />
          <p>Travel prepared. Travel with a clearer plan.</p>
        </div>
        <div className="footer-links">
          <div>
            <span>Prototype</span>
            <Link href="/plan">Plan a trip</Link>
            <Link href="/trips">My trips</Link>
            <Link href="/claims">Claim companion</Link>
          </div>
          <div>
            <span>Trust</span>
            <Link href="/transparency">How AI works</Link>
            <Link href="/transparency#limits">Safety & limitations</Link>
            <Link href="/transparency#data">Your local data</Link>
          </div>
        </div>
        <Link className="footer-cta" href="/plan">
          Make a demo trip <ArrowUpRight size={20} aria-hidden="true" />
        </Link>
      </div>
      <div className="site-footer__legal">
        <p><strong>Powered by Igloo — prototype simulation.</strong> No real insurance, bookings, payments, or claims.</p>
        <p>AI-generated guidance — demo only.</p>
      </div>
      <p className="photo-credits">Photography: Dang Son (CC0), David Kernan (CC BY 4.0), KishujiRapid and Tail furry (CC BY-SA 4.0), Mr.ちゅらさん (CC0), via Wikimedia Commons.</p>
    </footer>
  );
}
