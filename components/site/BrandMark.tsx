type BrandMarkProps = {
  size?: number;
  variant?: "light" | "dark";
  withTagline?: boolean;
};

export function BrandMark({ size = 34, variant = "light", withTagline = true }: BrandMarkProps) {
  const ink = variant === "light" ? "#ffffff" : "#1c7a58";
  const soft = variant === "light" ? "#eafff6" : "#5fa78e";

  return (
    <span className="brand_mark">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M20 3.5C20 3.5 8.8 16.1 8.8 24.1C8.8 30.3 13.8 35.3 20 35.3C26.2 35.3 31.2 30.3 31.2 24.1C31.2 16.1 20 3.5 20 3.5Z"
          fill={ink}
        />
        <path
          d="M14.7 24.4C14.7 27.4 16.8 29.6 19.6 29.6"
          stroke={variant === "light" ? "#3cc78f" : "#ffffff"}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span>
        <span className="brand_name">Amos Blood</span>
        {withTagline ? (
          <span className="brand_tag" style={{ color: soft }}>
            Every drop answers a call
          </span>
        ) : null}
      </span>
    </span>
  );
}
