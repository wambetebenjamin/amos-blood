import type { ReactNode } from "react";

type SectionTitleProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  as = "h2",
}: SectionTitleProps) {
  const Heading = as;
  return (
    <div className={`section_title ${align === "center" ? "text-center mx-auto max-w-3xl" : "text-left"}`}>
      {eyebrow ? <span className="eyebrow mb-4">{eyebrow}</span> : null}
      <Heading>{title}</Heading>
      {description ? <p className="mt-4">{description}</p> : null}
    </div>
  );
}
