import Link from "next/link";
import { ArrowRight, Droplets, HeartPulse, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="slider_area"
      aria-labelledby="hero-heading"
      style={{
        backgroundImage: "url(/images/hero-community-health.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="single_slider overlay2">
        <div className="container-t w-full">
          <div className="slider_text">
            <span>
              <Droplets size={16} className="mr-2 inline align-[-2px]" aria-hidden="true" />
              Blood donation and medical supply matching, Kenya
            </span>
            <h1 id="hero-heading">
              Your blood.
              <br />
              Someone&apos;s second chance.
            </h1>
            <p>
              Amos Blood connects verified donors with hospitals and blood banks across Kenya. Register
              your blood type once, then answer the call when a patient near you needs it. Hospitals can
              post an urgent request and reach donors in minutes.
            </p>
            <div className="slider_actions">
              <Link href="/register-donor" className="boxed-btn3">
                Register as donor
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/post-request" className="boxed-btn5">
                Post an urgent request
              </Link>
            </div>
            <div className="slider_note">
              <span>
                <ShieldCheck size={16} aria-hidden="true" />
                Verified hospitals and blood banks
              </span>
              <span>
                <HeartPulse size={16} aria-hidden="true" />
                Free for donors, always
              </span>
              <span>
                <Droplets size={16} aria-hidden="true" />
                90 day safe donation interval
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
