import Link from "next/link";
import { ChevronRight } from "lucide-react";

type PageBannerProps = {
  title: string;
  description: string;
  current: string;
  image?: string;
};

export function PageBanner({
  title,
  description,
  current,
  image = "/images/blood-donation.jpg",
}: PageBannerProps) {
  return (
    <section
      className="bradcam_area overlay"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(15, 92, 66, 0.35), rgba(15, 92, 66, 0.15)), url(${image})`,
      }}
    >
      <div className="container-t">
        <h1>{title}</h1>
        <p>{description}</p>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page">{current}</span>
        </nav>
      </div>
    </section>
  );
}
