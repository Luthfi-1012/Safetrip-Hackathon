import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CloudSun, MapPin, ShieldCheck, Sparkles, Umbrella } from "lucide-react";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

const scenes = [
  {
    title: "An itinerary with the why included.",
    text: "See arrival, city days, and higher-risk activities in one timeline — with practical preparation beside each plan.",
    image: "/images/tokyo.jpg",
    alt: "Tokyo Tower glowing above the city at night",
    icon: MapPin,
    tag: "PLAN THE DAYS",
  },
  {
    title: "A readiness score you can inspect.",
    text: "Trip length, destination, travelers, and activities become visible factors. Nothing is hidden inside a black box.",
    image: "/images/winter.jpg",
    alt: "A ski resort in Yamagata, Japan, surrounded by snow",
    icon: CloudSun,
    tag: "READ THE SIGNALS",
  },
  {
    title: "Protection explained in plain language.",
    text: "Compare fictional demo packages, see benefits and exclusions, then ask what the wording means before activating a simulation.",
    image: "/images/kyoto.jpg",
    alt: "The entrance of Jyorakuji Temple in Kyoto",
    icon: Umbrella,
    tag: "KNOW THE COVER",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader overlay />
      <main id="main-content">
        <section className="home-hero hero" data-enter>
          <div className="home-hero__media hero__media" data-enter-media>
            <img src="/images/japan-hero.jpg" alt="Chureito Pagoda overlooking Mount Fuji in Japan" />
          </div>
          <div className="home-hero__shade" />
          <div className="home-hero__content wrap">
            <div className="home-hero__copy">
              <p className="hero-eyebrow"><span /> AI TRAVEL PLANNER · MADE FOR INDONESIA</p>
              <h1>Travel further.<br />Worry less.</h1>
              <p className="home-hero__lead">Your itinerary, travel readiness, and protection options — brought together in one calm companion.</p>
              <div className="hero-actions">
                <Link className="btn btn--primary btn--xl" href="/plan">Plan my trip <ArrowRight size={19} aria-hidden="true" /></Link>
                <Link className="hero-text-link" href="#how-it-works">See how it works <ArrowUpRight size={16} aria-hidden="true" /></Link>
              </div>
              <p className="hero-fact"><ShieldCheck size={16} aria-hidden="true" /> No sign-up. No API key. Your demo stays on this device.</p>
            </div>
            <div className="hero-signal" aria-label="Example Tokyo trip readiness">
              <div className="hero-signal__top"><span>EXAMPLE TRIP · TOKYO</span><Sparkles size={16} aria-hidden="true" /></div>
              <div className="hero-signal__route"><strong>Jakarta</strong><ArrowRight size={17} aria-hidden="true" /><strong>Tokyo</strong></div>
              <p>10–20 December · 2 travelers</p>
              <div className="hero-signal__score">
                <div><span>READINESS</span><strong>68<small>/100</small></strong></div>
                <span className="signal-level">High preparation</span>
              </div>
              <div className="hero-signal__footer"><span>Winter sports</span><span>Complete suggested</span></div>
            </div>
          </div>
          <div className="hero-scroll"><span>DISCOVER SAFETRIP</span><i /></div>
        </section>

        <section className="product-section screen-section" id="how-it-works">
          <div className="wrap">
            <div className="section-heading split-heading">
              <div><p className="eyebrow">YOUR TRIP, IN FOCUS</p><h2>Less juggling.<br />More knowing.</h2></div>
              <p>SafeTrip turns the details you already know into a plan you can use. The preview below is the same Tokyo journey you can create in one click.</p>
            </div>
            <div className="app-frame" data-visual>
              <div className="app-frame__bar">
                <div className="app-dots" aria-hidden="true"><i /><i /><i /></div>
                <span>My trip / Tokyo</span>
                <span className="demo-chip">DEMO</span>
              </div>
              <div className="app-frame__body">
                <aside className="preview-sidebar">
                  <p className="preview-kicker">YOUR JOURNEY</p>
                  <h3>Tokyo in December</h3>
                  <p>Jakarta → Tokyo</p>
                  <div className="preview-dates"><span>10 DEC</span><i /><span>20 DEC</span></div>
                  <nav aria-label="Preview trip sections">
                    <span className="active"><MapPin size={16} />Itinerary</span>
                    <span><ShieldCheck size={16} />Readiness <b>68</b></span>
                    <span><Sparkles size={16} />AI Advisor</span>
                  </nav>
                </aside>
                <div className="preview-main">
                  <div className="preview-main__head"><div><span>DAY 4 OF 11</span><h3>A winter day, planned well.</h3></div><span className="weather-chip">2°C · Snow</span></div>
                  <div className="preview-day">
                    <div className="preview-day__photo m-zoom"><img src="/images/winter.jpg" alt="Snow-covered ski slopes at a Japanese resort" /></div>
                    <div className="preview-day__agenda">
                      <div><time>08:30</time><span><strong>Resort transfer</strong><small>Allow extra time for snowy roads.</small></span></div>
                      <div><time>10:00</time><span><strong>Winter sports</strong><small>Use marked slopes and proper equipment.</small></span></div>
                      <div><time>16:30</time><span><strong>Return before dark</strong><small>Keep your emergency contact accessible.</small></span></div>
                    </div>
                  </div>
                  <div className="preview-tip"><Sparkles size={17} aria-hidden="true" /><p><strong>Trip signal</strong> Winter sports adds +18 to this demo readiness score.</p><Check size={17} aria-hidden="true" /></div>
                </div>
              </div>
            </div>
            <div className="section-link-row"><p>Built for a three-minute demo. Designed to feel like a real travel companion.</p><Link className="text-link" href="/plan">Create this trip <ArrowRight size={16} /></Link></div>
          </div>
        </section>

        <section className="scenes-section screen-section">
          <div className="wrap">
            <div className="section-heading split-heading">
              <div><p className="eyebrow">FROM PLAN TO PEACE OF MIND</p><h2>Preparation that<br />travels with you.</h2></div>
              <p>Three connected views help you move from “Where are we going?” to “What should we do next?” without losing the context.</p>
            </div>
            <div className="scene-grid">
              {scenes.map((scene, index) => {
                const Icon = scene.icon;
                return (
                  <article className="scene-card card" key={scene.title}>
                    <div className="scene-card__copy"><span className="scene-number">0{index + 1}</span><p className="eyebrow"><Icon size={14} />{scene.tag}</p><h3>{scene.title}</h3><p>{scene.text}</p></div>
                    <div className="scene-card__image m-zoom"><img src={scene.image} alt={scene.alt} /></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="trust-section screen-section ground-inverse" data-moment="iris-opens" data-moment-opts='{"from":"surface"}' id="trust">
          <div className="wrap trust-layout">
            <div className="trust-copy">
              <p className="eyebrow">CLEAR ABOUT ITS LIMITS</p>
              <h2>Helpful AI.<br />Honest boundaries.</h2>
              <p>SafeTrip gives structured guidance, not professional decisions. It tells you when to check a policy, contact a provider, or seek emergency help.</p>
              <Link className="btn btn--light btn--xl" href="/transparency">See how the AI works <ArrowUpRight size={18} /></Link>
            </div>
            <div className="trust-points">
              <div><span>01</span><div><h3>Visible reasoning</h3><p>Every readiness point has a named trip factor you can verify.</p></div></div>
              <div><span>02</span><div><h3>No invented coverage</h3><p>Policy answers stay inside the fictional demo plan data.</p></div></div>
              <div><span>03</span><div><h3>Safety before flow</h3><p>Medical emergencies always lead to local emergency services.</p></div></div>
              <div><span>04</span><div><h3>Private by prototype design</h3><p>No account, no sensitive data, and no server upload.</p></div></div>
            </div>
          </div>
          <p className="trust-disclaimer wrap">AI-generated guidance — demo only. Not medical, legal, or insurance advice.</p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
